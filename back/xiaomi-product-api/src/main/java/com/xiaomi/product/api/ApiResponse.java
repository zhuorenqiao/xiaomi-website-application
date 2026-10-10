package com.xiaomi.product.api;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 统一响应外层：避免前端直接解析裸数组 / 裸对象。
 *
 * <p>成功：{@code { "success": true, "data": ... }}（message 为空时省略）；
 * 失败：{@code { "success": false, "message": "..." }}（data 为空时省略）。
 * 与 {@code GlobalExceptionHandler} 的错误体结构保持一致。
 *
 * @param success 是否成功
 * @param message 失败时的错误描述（成功时为 null 并省略）
 * @param data    业务数据（失败时为 null 并省略）
 * @param <T>     业务数据类型
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(boolean success, String message, T data) {

    /** 成功响应，携带业务数据 */
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, null, data);
    }

    /** 失败响应，携带错误描述 */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
