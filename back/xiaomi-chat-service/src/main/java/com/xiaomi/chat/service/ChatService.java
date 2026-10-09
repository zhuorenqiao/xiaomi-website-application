package com.xiaomi.chat.service;

import com.xiaomi.chat.config.ChatProperties;
import com.xiaomi.chat.llm.LlmClient;
import com.xiaomi.chat.llm.LlmMessage;
import com.xiaomi.chat.llm.LlmProperties;
import com.xiaomi.chat.api.ChatChunk;
import com.xiaomi.chat.api.ChatRequest;
import com.xiaomi.chat.session.ChatMessage;
import com.xiaomi.chat.session.ChatSession;
import com.xiaomi.chat.session.ChatSessionStore;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 聊天业务：生成回复并以 SSE 增量推送给前端。
 *
 * <p>回复来源二选一（由 chat.llm.api-key 是否配置决定）：
 * <ul>
 *   <li>已配置 → 通过 {@link LlmClient} 调用真实大模型，增量原样转发（OpenAI 兼容协议），
 *       上下文自动携带会话历史与系统提示词；</li>
 *   <li>未配置 → 内置模拟回复（保留「错误」触发分支，供前端联调错误态/重新生成）。</li>
 * </ul>
 * 两条路径共用同一套推送管线与断连清理逻辑。
 */
@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    private final ChatSessionStore sessionStore;
    private final ChatProperties properties;
    private final LlmProperties llmProperties;
    private final LlmClient llmClient;
    private final ScheduledExecutorService scheduler;

    public ChatService(ChatSessionStore sessionStore, ChatProperties properties,
                       LlmProperties llmProperties, LlmClient llmClient) {
        this.sessionStore = sessionStore;
        this.properties = properties;
        this.llmProperties = llmProperties;
        this.llmClient = llmClient;
        this.scheduler = Executors.newScheduledThreadPool(16, runnable -> {
            Thread thread = new Thread(runnable, "chat-stream");
            thread.setDaemon(true);
            return thread;
        });
    }

    @jakarta.annotation.PreDestroy
    void shutdown() {
        scheduler.shutdownNow();
    }

    /** 处理一条用户消息，通过 emitter 以 SSE 增量返回回复 */
    public void streamReply(ChatRequest request, SseEmitter emitter) {
        ChatSession session = sessionStore.getOrCreate(request.sessionId());
        String time = LocalTime.now().format(TIME_FORMAT);
        int historyCount = session.messageCount();
        session.append(ChatMessage.user(request.query(), time));

        if (!llmProperties.isConfigured()) {
            log.warn("chat.llm.api-key 未配置，使用内置模拟回复（仅供联调）");
            log.info("query='{}', sessionId={}, mode=mock", request.query(), session.getId());
            pump(emitter, buildMockChunks(request, session, time, historyCount));
            return;
        }

        log.info("query='{}', sessionId={}, mode=llm model={}", request.query(), session.getId(), llmProperties.model());
        streamFromLlm(session, emitter, time);
    }

    // ============================ 真实大模型路径 ============================

    /** 调用大模型并把增量转发给前端；会话历史自动作为上下文携带 */
    private void streamFromLlm(ChatSession session, SseEmitter emitter, String time) {
        List<LlmMessage> context = buildContext(session);
        AtomicBoolean finished = new AtomicBoolean(false);
        StringBuilder reply = new StringBuilder();

        // 前端断开 / 超时：置位即可，下一次 onDelta 的 send 失败会中断上游读取
        Runnable onClientGone = () -> finished.set(true);

        scheduler.execute(() -> llmClient.streamChat(context, new LlmClient.Listener() {

            @Override
            public void onDelta(String content) {
                if (finished.get()) {
                    throw new ClientAbortException("client gone");
                }
                reply.append(content);
                try {
                    emitter.send(SseEmitter.event().data(ChatChunk.assistant(content, time)));
                } catch (Exception e) {
                    finished.set(true);
                    // 抛出以中断上游读取并关闭 LLM 连接
                    throw new ClientAbortException(e);
                }
            }

            @Override
            public void onComplete() {
                if (finished.get()) {
                    return;
                }
                finished.set(true);
                session.append(ChatMessage.assistant(reply.toString(), time));
                try {
                    emitter.send(SseEmitter.event().data("[DONE]"));
                    emitter.complete();
                } catch (Exception e) {
                    log.debug("complete aborted: {}", e.getMessage());
                }
            }

            @Override
            public void onError(Exception cause) {
                if (finished.get() && !(cause instanceof ClientAbortException)) {
                    return;
                }
                finished.set(true);
                log.warn("LLM stream failed: {}", cause.getMessage());
                // 留存已生成的部分内容，便于续聊上下文完整
                if (reply.length() > 0) {
                    session.append(ChatMessage.assistant(reply.toString(), time));
                }
                try {
                    emitter.send(SseEmitter.event().data(ChatChunk.error(time)));
                    emitter.send(SseEmitter.event().data("[DONE]"));
                    emitter.complete();
                } catch (Exception ignored) {
                    // 前端已断开
                }
            }
        }));

        emitter.onTimeout(onClientGone);
        emitter.onError(throwable -> onClientGone.run());
    }

    /** 组装大模型上下文：系统提示词 + 最近 N 条会话历史（含刚追加的用户消息） */
    private List<LlmMessage> buildContext(ChatSession session) {
        List<LlmMessage> messages = new ArrayList<>();
        if (llmProperties.systemPrompt() != null && !llmProperties.systemPrompt().isBlank()) {
            messages.add(LlmMessage.system(llmProperties.systemPrompt()));
        }
        List<ChatMessage> history = session.snapshot();
        int from = Math.max(0, history.size() - llmProperties.maxHistoryMessagesOrDefault());
        for (ChatMessage message : history.subList(from, history.size())) {
            messages.add(LlmMessage.fromSessionRole(message.role().getValue(), message.content()));
        }
        return messages;
    }

    /** 监听器主动抛出：仅用于中断上游流，服务端已自行处理 */
    private static class ClientAbortException extends RuntimeException {
        ClientAbortException(String message) {
            super(message);
        }

        ClientAbortException(Throwable cause) {
            super(cause);
        }
    }

    // ============================ 模拟回复路径（未配置 api-key 时兜底） ============================

    /**
     * 生成模拟回复数据块序列。
     * query 含「错误 / error」时走服务端错误分支（便于联调前端的错误态与重新生成）。
     */
    private List<ChatChunk> buildMockChunks(ChatRequest request, ChatSession session, String time, int historyCount) {
        String query = request.query();
        List<ChatChunk> chunks = new ArrayList<>();

        if (isErrorTrigger(query)) {
            String partial = "让我查一下您的订单……";
            session.append(ChatMessage.assistant(partial, time));
            chunks.addAll(split(partial, time));
            chunks.add(ChatChunk.error(time));
            return chunks;
        }

        String reply = """
                您好！收到您的问题：「%s」。这是 Java 服务端（Spring Boot SSE）返回的流式回复\
               （sessionId=%s），当前会话历史消息 %d 条。内容将分多段推送，\
                用于验证 Ant Design X 前端的流式渲染、停止与重新生成是否正常。""".formatted(query, session.getId(), historyCount);
        session.append(ChatMessage.assistant(reply, time));
        chunks.addAll(split(reply, time));
        return chunks;
    }

    /** 定时推送：每 intervalMs 发送一个数据块，发完补 data:[DONE] 并完成本次响应 */
    private void pump(SseEmitter emitter, List<ChatChunk> chunks) {
        long intervalMs = Math.max(10, properties.stream().intervalMs());
        AtomicInteger index = new AtomicInteger();
        AtomicBoolean finished = new AtomicBoolean(false);
        AtomicReference<ScheduledFuture<?>> futureRef = new AtomicReference<>();

        Runnable cancelTask = () -> {
            finished.set(true);
            ScheduledFuture<?> current = futureRef.get();
            if (current != null) {
                current.cancel(false);
            }
        };

        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(() -> {
            if (finished.get()) {
                return;
            }
            int i = index.getAndIncrement();
            try {
                if (i < chunks.size()) {
                    emitter.send(SseEmitter.event().data(chunks.get(i)));
                } else {
                    emitter.send(SseEmitter.event().data("[DONE]"));
                    emitter.complete();
                    cancelTask.run();
                }
            } catch (Exception e) {
                // 客户端断开（IOException）或响应已完成（IllegalStateException）
                log.debug("stream aborted: {}", e.getMessage());
                cancelTask.run();
                completeQuietly(emitter);
            }
        }, 0, intervalMs, TimeUnit.MILLISECONDS);
        futureRef.set(future);

        emitter.onTimeout(cancelTask);
        emitter.onError(throwable -> cancelTask.run());
    }

    /** 按 code point 分块，避免把 emoji 等增补字符拆成乱码 */
    private List<ChatChunk> split(String text, String time) {
        int step = Math.max(1, properties.stream().charsPerChunk());
        int total = text.codePointCount(0, text.length());
        List<ChatChunk> chunks = new ArrayList<>();
        for (int cp = 0; cp < total; cp += step) {
            int start = text.offsetByCodePoints(0, cp);
            int end = text.offsetByCodePoints(0, Math.min(total, cp + step));
            chunks.add(ChatChunk.assistant(text.substring(start, end), time));
        }
        return chunks;
    }

    private boolean isErrorTrigger(String query) {
        return query.contains("错误") || query.toLowerCase(Locale.ROOT).contains("error");
    }

    private void completeQuietly(SseEmitter emitter) {
        try {
            emitter.complete();
        } catch (Exception ignored) {
            // emitter 已被容器完成/客户端已断开时忽略
        }
    }
}
