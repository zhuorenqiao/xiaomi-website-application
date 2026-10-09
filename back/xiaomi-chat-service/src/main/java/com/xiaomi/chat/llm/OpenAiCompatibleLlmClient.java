package com.xiaomi.chat.llm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * OpenAI 兼容协议的大模型流式客户端（JDK HttpClient 实现，无额外依赖）。
 *
 * <p>POST {base-url}/chat/completions（stream=true），逐行读取 SSE：
 * data 行为 OpenAI chunk JSON（增量在 choices[0].delta.content），以 data:[DONE] 结束。
 * 兼容智谱 GLM / DeepSeek / Moonshot / 通义（兼容模式）/ OpenAI 等服务。
 */
@Component
public class OpenAiCompatibleLlmClient implements LlmClient {

    private static final Logger log = LoggerFactory.getLogger(OpenAiCompatibleLlmClient.class);

    private final LlmProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public OpenAiCompatibleLlmClient(LlmProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    public void streamChat(List<LlmMessage> messages, Listener listener) {
        try {
            doStream(messages, listener);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            listener.onError(e);
        } catch (Exception e) {
            // 含 listener 主动抛出的中断信号（前端已断开）：关闭流并通知即可
            listener.onError(e);
        }
    }

    private void doStream(List<LlmMessage> messages, Listener listener) throws Exception {
        Map<String, Object> body = Map.of(
                "model", properties.model(),
                "messages", messages,
                "stream", true,
                "temperature", properties.temperatureOrDefault());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(properties.chatCompletionsUrl()))
                .timeout(Duration.ofSeconds(properties.timeoutSecondsOrDefault()))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + properties.apiKey())
                .POST(HttpRequest.BodyPublishers.ofString(
                        objectMapper.writeValueAsString(body), StandardCharsets.UTF_8))
                .build();

        long start = System.currentTimeMillis();
        HttpResponse<java.io.InputStream> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());

        if (response.statusCode() != 200) {
            String errorSnippet = snippetOf(response.body());
            log.warn("LLM request failed: status={}, body={}", response.statusCode(), errorSnippet);
            listener.onError(new IllegalStateException(
                    "LLM HTTP " + response.statusCode() + ": " + errorSnippet));
            return;
        }

        // try-with-resources 保证异常/中断时关闭上游流（即取消请求）
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(response.body(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.startsWith("data:")) {
                    continue;
                }
                String data = line.substring(5).trim();
                if (data.isEmpty()) {
                    continue;
                }
                if ("[DONE]".equals(data)) {
                    break;
                }
                String delta = parseDelta(data);
                if (delta != null && !delta.isEmpty()) {
                    listener.onDelta(delta);
                }
            }
            listener.onComplete();
            log.info("LLM stream finished in {} ms", System.currentTimeMillis() - start);
        }
    }

    /** 解析 OpenAI chunk 的 choices[0].delta.content；无内容（如仅 reasoning/usage 的块）返回 null */
    private String parseDelta(String data) {
        try {
            JsonNode node = objectMapper.readTree(data);
            JsonNode delta = node.path("choices").path(0).path("delta").path("content");
            if (delta.isTextual()) {
                return delta.asText();
            }
            // 兜底：部分兼容服务把整段内容放在 message.content
            JsonNode message = node.path("choices").path(0).path("message").path("content");
            return message.isTextual() ? message.asText() : null;
        } catch (Exception e) {
            log.debug("skip unparsable llm chunk: {}", data);
            return null;
        }
    }

    /** 读取错误响应体（截断到 300 字符）用于日志与异常信息 */
    private String snippetOf(java.io.InputStream body) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(body, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            char[] buf = new char[300];
            int n = reader.read(buf);
            if (n > 0) {
                sb.append(buf, 0, n);
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }
}
