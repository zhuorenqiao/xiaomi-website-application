package com.xiaomi.chat.llm;

import java.util.List;

/**
 * 大模型客户端抽象：屏蔽具体厂商协议，由 ChatService 调用。
 */
public interface LlmClient {

    /**
     * 发起流式对话，通过 listener 回调增量内容。
     *
     * <p>回调约定：listener 抛出异常（典型场景：前端已断开连接）会中断上游
     * 读取并关闭 HTTP 连接，后续回调不再触发。
     *
     * @param messages 对话上下文（含系统提示词与历史消息）
     * @param listener 回调
     */
    void streamChat(List<LlmMessage> messages, Listener listener);

    /** 流式回调 */
    interface Listener {

        /** 收到一段增量文本 */
        void onDelta(String content);

        /** 上游流正常结束 */
        void onComplete();

        /** 请求失败 / 流中断 / 回调链路异常 */
        void onError(Exception cause);
    }
}
