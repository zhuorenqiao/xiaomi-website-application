package com.xiaomi.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * 小米商品服务（独立可运行微服务，默认端口 8861）。
 *
 * <p>为前端首页提供商品列表数据：
 * <pre>
 * GET /api/products/sections
 * 响应：[{ id, title, feature: { name, desc, price, cta, image },
 *          products: [{ name, desc, price, tag?, image }] }]
 * </pre>
 * 数据源当前为内存目录（{@code ProductRepository}），可平滑替换为数据库或远程商品中心。
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class ProductServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductServerApplication.class, args);
    }
}
