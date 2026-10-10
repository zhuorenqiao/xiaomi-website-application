package com.xiaomi.product.web;

import com.xiaomi.product.api.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * 全局异常处理：未映射路径返回 404，其余未预期异常统一返回 500 结构化 JSON。
 * 与 xiaomi-chat-service 保持一致的错误响应体 { success:false, message }。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** 未映射路径 / 静态资源不存在：单独返回 404，避免被下方兜底分支误报成服务端错误 */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(NoResourceFoundException e) {
        log.debug("no resource for {} {}", e.getHttpMethod(), e.getResourcePath());
        return error(HttpStatus.NOT_FOUND, "接口不存在");
    }

    /** 兜底：未预期异常 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception e) {
        log.error("unexpected error", e);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "服务内部错误");
    }

    private ResponseEntity<ApiResponse<Void>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ApiResponse.error(message));
    }
}
