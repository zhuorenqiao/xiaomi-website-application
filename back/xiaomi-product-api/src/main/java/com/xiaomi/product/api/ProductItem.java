package com.xiaomi.product.api;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 商品卡片（栏目右侧网格中的单个商品），对应前端首页商品列表项。
 *
 * @param name  商品名称
 * @param desc  一句话卖点
 * @param price 价格文案（如「6499 元」）
 * @param tag   角标（新品 / 热卖 / 直降等），可为空——为空时序列化省略该字段
 * @param image 商品图 URL
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductItem(String name, String desc, String price, String tag, String image) {
}
