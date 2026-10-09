package com.xiaomi.chat.llm;

/**
 * 发送给大模型的消息（OpenAI Chat Completions 的 messages 元素）。
 *
 * @param role    user / assistant / system
 * @param content 消息文本
 */
public record LlmMessage(String role, String content) {

    public static LlmMessage system(String content) {
        return new LlmMessage("system", content);
    }

    public static LlmMessage fromSessionRole(String sessionRole, String content) {
        return new LlmMessage("user".equals(sessionRole) ? "user" : "assistant", content);
    }
}
