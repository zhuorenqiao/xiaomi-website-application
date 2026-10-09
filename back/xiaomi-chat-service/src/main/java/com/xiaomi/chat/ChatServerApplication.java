package com.xiaomi.chat;

import com.xiaomi.chat.config.ChatProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * 小米在线客服聊天服务。
 *
 * <p>与前端聊天模块（Ant Design X + XRequest）对接的流式接口：
 * <pre>
 * POST /chat
 * 请求体：{ "query": "string", "sessionId": "可选 string" }
 * 响应：text/event-stream，每条 data 行为一个 JSON：
 *   { "content": "string", "time": "HH:mm", "status": "success" | "error", "role": "assistant" | "user" }
 * 流结束以 data:[DONE] 标记。
 * </pre>
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class ChatServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatServerApplication.class, args);
    }
}
