package com.xiaomi.chat.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 聊天服务配置项（对应 application.yml 的 chat.*）。
 *
 * @param cors   CORS 配置
 * @param stream 流式推送配置
 */
@ConfigurationProperties(prefix = "chat")
public record ChatProperties(Cors cors, Stream stream) {

    /** CORS 允许的前端来源 */
    public record Cors(List<String> allowedOrigins) {
    }

    /** 流式推送节奏：每 intervalMs 毫秒推送 charsPerChunk 个字符 */
    public record Stream(long intervalMs, int charsPerChunk) {
    }
}
