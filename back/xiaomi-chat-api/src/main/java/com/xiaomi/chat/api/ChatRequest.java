package com.xiaomi.chat.api;

import jakarta.validation.constraints.NotBlank;

/**
 * 聊天接口请求体，对应协议：{ query: string, sessionId?: string }
 *
 * @param query     用户输入（必填）
 * @param sessionId 会话 ID（可选；前端聊天模块总是携带）
 */
public record ChatRequest(

        @NotBlank(message = "query 不能为空")
        String query,

        String sessionId) {
}
