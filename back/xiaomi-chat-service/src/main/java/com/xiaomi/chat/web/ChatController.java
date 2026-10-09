package com.xiaomi.chat.web;

import com.xiaomi.chat.api.ChatRequest;
import com.xiaomi.chat.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 聊天接口：POST /chat（text/event-stream）。
 * 协议与前端 Ant Design X 聊天模块（XRequest）一一对应。
 */
@RestController
@RequestMapping("/chat")
public class ChatController {

    /** SSE 响应超时（毫秒）：单轮流式总时长上限，超时由容器完成响应 */
    private static final long STREAM_TIMEOUT_MS = 60_000;

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * 发送一条用户消息，返回流式回复。
     *
     * @param request { query, sessionId? }
     * @return SSE emitter，逐块推送 { content, time, status, role }，以 data:[DONE] 结束
     */
    @PostMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter chat(@Valid @RequestBody ChatRequest request) {
        SseEmitter emitter = new SseEmitter(STREAM_TIMEOUT_MS);
        chatService.streamReply(request, emitter);
        return emitter;
    }
}
