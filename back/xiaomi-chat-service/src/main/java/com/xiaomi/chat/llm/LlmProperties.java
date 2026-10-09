package com.xiaomi.chat.llm;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 大模型接入配置（对应 application.yml 的 chat.llm.*）。
 *
 * <p>采用 OpenAI 兼容协议（/chat/completions 流式），因此任何兼容该协议的
 * 服务均可通过配置接入：智谱 GLM、DeepSeek、Moonshot(Kimi)、通义千问(DashScope 兼容模式)、OpenAI 等。
 * api-key 通过环境变量注入，避免提交到代码库。
 *
 * @param baseUrl            OpenAI 兼容服务地址（如 https://open.bigmodel.cn/api/paas/v4）
 * @param apiKey             API Key；为空时 ChatService 退回内置模拟回复
 * @param model              模型名（如 glm-4-flash、deepseek-chat）
 * @param temperature        采样温度
 * @param timeoutSeconds     单次请求超时（秒）
 * @param maxHistoryMessages 随请求携带的最大历史消息条数（上下文窗口控制）
 * @param systemPrompt       系统提示词
 */
@ConfigurationProperties(prefix = "chat.llm")
public record LlmProperties(
        String baseUrl,
        String apiKey,
        String model,
        Double temperature,
        Integer timeoutSeconds,
        Integer maxHistoryMessages,
        String systemPrompt) {

    /** 是否已配置可用的大模型服务 */
    public boolean isConfigured() {
        return notBlank(baseUrl) && notBlank(apiKey) && notBlank(model);
    }

    public double temperatureOrDefault() {
        return temperature == null ? 0.7 : temperature;
    }

    public int timeoutSecondsOrDefault() {
        return timeoutSeconds == null || timeoutSeconds <= 0 ? 60 : timeoutSeconds;
    }

    public int maxHistoryMessagesOrDefault() {
        return maxHistoryMessages == null || maxHistoryMessages < 0 ? 20 : maxHistoryMessages;
    }

    /** 补全为 /chat/completions 端点地址 */
    public String chatCompletionsUrl() {
        String base = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        return base + "/chat/completions";
    }

    private static boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }
}
