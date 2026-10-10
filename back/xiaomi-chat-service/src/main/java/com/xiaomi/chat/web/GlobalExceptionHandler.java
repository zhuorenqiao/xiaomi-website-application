package com.xiaomi.chat.web;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * 全局异常处理：参数校验失败等返回结构化 JSON 错误。
 * 前端 XRequest 对非 2xx 响应统一抛错并展示友好提示；
 * SSE 已建立后的流内错误通过 status:"error" 数据块传递（见 ChatService）。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** 请求体缺失 / JSON 格式错误 */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleNotReadable(HttpMessageNotReadableException e) {
        return error(HttpStatus.BAD_REQUEST, "请求体格式不正确");
    }

    /** 参数校验失败（如 query 为空） */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fieldError -> fieldError.getDefaultMessage())
                .orElse("请求参数不正确");
        return error(HttpStatus.BAD_REQUEST, message);
    }

    /** 未映射路径 / 静态资源不存在：单独返回 404，避免被下方兜底分支误报成服务端错误 */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NoResourceFoundException e) {
        log.debug("no resource for {} {}", e.getHttpMethod(), e.getResourcePath());
        return error(HttpStatus.NOT_FOUND, "接口不存在");
    }

    /** 兜底：未预期异常 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception e) {
        log.error("unexpected error", e);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "服务内部错误");
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of(
                "success", false,
                "message", message));
    }
}
