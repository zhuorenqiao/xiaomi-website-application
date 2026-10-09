package com.xiaomi.chat.api;

/**
 * SSE 流式响应的单个数据块，对应协议：
 * { content, time, status: 'success' | 'error', role: 'assistant' | 'user' }
 *
 * @param content 增量文本；status=error 时可作为错误描述（留空则由前端展示兜底文案）
 * @param time    服务端时间（HH:mm）
 * @param status  数据块状态
 * @param role    数据块归属角色
 */
public record ChatChunk(String content, String time, ChatStatus status, ChatRole role) {

    /** 助手正常增量数据块 */
    public static ChatChunk assistant(String content, String time) {
        return new ChatChunk(content, time, ChatStatus.SUCCESS, ChatRole.ASSISTANT);
    }

    /** 服务端错误数据块（中断后续内容） */
    public static ChatChunk error(String time) {
        return new ChatChunk("", time, ChatStatus.ERROR, ChatRole.ASSISTANT);
    }
}
