package com.xiaomi.chat.session;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 单个会话：按 sessionId 留存消息历史。
 * 线程安全：同一会话可能被并发请求读写。
 */
public class ChatSession {

    private final String id;
    private final List<ChatMessage> messages = Collections.synchronizedList(new ArrayList<>());

    public ChatSession(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    /** 追加一条消息 */
    public void append(ChatMessage message) {
        messages.add(message);
    }

    /** 当前消息条数 */
    public int messageCount() {
        return messages.size();
    }

    /** 历史消息快照（只读） */
    public List<ChatMessage> snapshot() {
        synchronized (messages) {
            return List.copyOf(messages);
        }
    }
}
