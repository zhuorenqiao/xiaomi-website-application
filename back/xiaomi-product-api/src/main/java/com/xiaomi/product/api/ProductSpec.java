package com.xiaomi.product.api;

/**
 * 详情页「规格参数」中的一行键值对，供前端直接渲染参数表。
 *
 * @param label 参数名（如「品牌」「售价」）
 * @param value 参数值（已格式化好的展示文案，如「Xiaomi」「6499 元」）
 */
public record ProductSpec(String label, String value) {
}
