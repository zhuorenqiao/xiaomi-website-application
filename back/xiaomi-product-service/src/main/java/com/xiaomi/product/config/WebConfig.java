package com.xiaomi.product.config;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS 配置：允许前端开发服务器跨域调用 /api/products（GET）。
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final ProductProperties properties;

    public WebConfig(ProductProperties properties) {
        this.properties = properties;
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(properties.cors().allowedOrigins().toArray(String[]::new))
                .allowedMethods("GET", "OPTIONS")
                .allowedHeaders("Content-Type")
                .maxAge(3600);
    }
}
