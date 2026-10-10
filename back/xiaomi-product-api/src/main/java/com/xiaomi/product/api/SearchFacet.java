package com.xiaomi.product.api;

/**
 * 搜索页分类筛选项：分类编码、名称，以及当前关键词下的命中数量。
 *
 * @param code  分类编码（如 tv）
 * @param name  分类名称（如 电视）
 * @param count 当前关键词下该分类命中的商品数
 */
public record SearchFacet(String code, String name, long count) {
}
