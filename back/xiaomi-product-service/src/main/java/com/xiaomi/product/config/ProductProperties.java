package com.xiaomi.product.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 商品服务配置项（对应 application.yml 的 product.*）。
 *
 * @param cors CORS 配置
 */
@ConfigurationProperties(prefix = "product")
public record ProductProperties(Cors cors) {

    /** CORS 允许的前端来源 */
    public record Cors(List<String> allowedOrigins) {
    }
}
