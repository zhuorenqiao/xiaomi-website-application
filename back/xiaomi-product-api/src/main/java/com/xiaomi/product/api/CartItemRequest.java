package com.xiaomi.product.api;

/**
 * 购物车写操作请求体（POST 加入 / PUT 改数量共用）。
 *
 * @param sessionId 游客购物车会话标识（前端 localStorage 生成并随请求带上）
 * @param skuId     目标 SKU id
 * @param quantity  POST 表示「追加数量」，PUT 表示「设为该数量」（&lt;1 视为删除）
 */
public record CartItemRequest(String sessionId, Long skuId, Integer quantity) {
}
