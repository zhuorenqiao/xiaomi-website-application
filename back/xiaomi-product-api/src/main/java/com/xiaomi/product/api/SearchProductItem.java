package com.xiaomi.product.api;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 搜索结果中的单个商品卡片，比首页网格的 {@link ProductItem} 多带品牌与销量，
 * 供搜索页展示「已售 xx 件」以及让销量排序结果可被用户感知。
 *
 * @param name     商品名称
 * @param desc     一句话卖点
 * @param price    价格文案（如「6499 元」）
 * @param tag      角标（新品 / 热卖 / 直降等），可为空——为空时序列化省略该字段
 * @param image    商品图 URL
 * @param brand    品牌（Xiaomi / REDMI / 米家）
 * @param sales    累计销量（用于展示与排序佐证）
 * @param category 所属分类名称
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record SearchProductItem(String name, String desc, String price, String tag, String image,
        String brand, Integer sales, String category) {
}
