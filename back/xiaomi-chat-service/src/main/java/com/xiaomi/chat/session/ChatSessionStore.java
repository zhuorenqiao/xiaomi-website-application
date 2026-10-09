package com.xiaomi.chat.session;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

/**
 * 会话存储：内存实现（demo 用途，重启即清空）。
 * 生产环境应替换为 Redis / 数据库实现，接口保持不变即可平滑替换。
 */
@Component
public class ChatSessionStore {

    /** 未携带 sessionId 的请求归入同一匿名会话 */
    public static final String ANONYMOUS = "anonymous";

    private final Map<String, ChatSession> sessions = new ConcurrentHashMap<>();

    /**
     * 获取或创建会话。
     *
     * @param sessionId 会话 ID；为空时使用匿名会话
     */
    public ChatSession getOrCreate(String sessionId) {
        String key = (sessionId == null || sessionId.isBlank()) ? ANONYMOUS : sessionId;
        return sessions.computeIfAbsent(key, ChatSession::new);
    }
}
