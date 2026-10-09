package com.xiaomi.chat.session;

import com.xiaomi.chat.api.ChatRole;

/**
 * 会话内的一条消息记录（服务端内存留存，用于组装上下文/统计）。
 *
 * @param role    消息归属角色
 * @param content 消息文本
 * @param time    时间（HH:mm）
 */
public record ChatMessage(ChatRole role, String content, String time) {

    public static ChatMessage user(String content, String time) {
        return new ChatMessage(ChatRole.USER, content, time);
    }

    public static ChatMessage assistant(String content, String time) {
        return new ChatMessage(ChatRole.ASSISTANT, content, time);
    }
}
