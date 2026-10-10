package com.xiaomi.product.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 商品服务配置项（对应 application.yml 的 product.*）。
 *
 * @param cors     CORS 配置
 * @param homepage 首页栏目相关配置
 */
@ConfigurationProperties(prefix = "product")
public record ProductProperties(Cors cors, Homepage homepage) {

    /** 首页栏目网格商品上限（homepage 整段缺省时也返回默认值 8） */
    public int gridLimitOrDefault() {
        return homepage == null ? 8 : homepage.gridLimitOrDefault();
    }

    /** CORS 允许的前端来源 */
    public record Cors(List<String> allowedOrigins) {
    }

    /**
     * 首页栏目配置。
     *
     * @param maxGridProducts 每个栏目网格最多展示的商品数，未配置时按 8 处理
     */
    public record Homepage(Integer maxGridProducts) {

        /** 归一化后的网格商品上限（至少 1 个） */
        public int gridLimitOrDefault() {
            Integer value = maxGridProducts == null ? 8 : maxGridProducts;
            return Math.max(1, value);
        }
    }
}
