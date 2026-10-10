package com.xiaomi.product.api;

/**
 * 商品栏目左侧竖版大图（主推位）。
 *
 * @param id    主推商品主键，前端据此跳转详情页
 * @param name  主推商品名称
 * @param desc  一句话卖点
 * @param price 价格文案（如「6499 元起」）
 * @param cta   行动按钮文案（如「了解更多」）
 * @param image 竖版大图 URL
 */
public record ProductFeature(long id, String name, String desc, String price, String cta, String image) {
}
