package com.xiaomi.chat.config;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS 配置：允许前端开发服务器跨域调用 /chat（含 JSON POST 触发的预检请求）。
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final ChatProperties properties;

    public WebConfig(ChatProperties properties) {
        this.properties = properties;
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(properties.cors().allowedOrigins().toArray(String[]::new))
                .allowedMethods("POST", "GET", "OPTIONS")
                .allowedHeaders("Content-Type")
                .maxAge(3600);
    }
}
