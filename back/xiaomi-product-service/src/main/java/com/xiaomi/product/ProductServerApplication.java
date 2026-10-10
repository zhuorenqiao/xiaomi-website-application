package com.xiaomi.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * 小米商品服务（独立可运行微服务，默认端口 8861）。
 *
 * <p>为前端提供商品列表数据，数据源为 MySQL 商品库 xiaomi_product
 * （本地用 {@code back/db/docker-compose.yml} 拉起，建表与种子数据由
 * {@code resources/db/schema.sql}、{@code data.sql} 在服务启动时幂等执行）：
 * <pre>
 * GET /api/products/sections —— 首页商品栏目
 * 成功响应：统一外层 { "success": true, "data": [
 *            { id, title, feature: { name, desc, price, cta, image },
 *              products: [{ name, desc, price, tag?, image }] } ] }
 *
 * GET /api/products/search?keyword=电视&amp;category=&amp;sort=default&amp;page=1&amp;size=20 —— 关键词分页列表
 * 成功响应：{ "success": true, "data": { keyword, category, sort, page, size,
 *            total, totalPages, hasPrev, hasNext, items: [...], categories: [{ code, name, count }] } }
 *
 * 异常响应：{ "success": false, "message": "..." }（见 GlobalExceptionHandler）。
 * </pre>
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class ProductServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductServerApplication.class, args);
    }
}
