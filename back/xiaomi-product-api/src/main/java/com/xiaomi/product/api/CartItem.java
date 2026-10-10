package com.xiaomi.product.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;

/**
 * 购物车中的一行（加入时的商品 / SKU 快照，展示用）。
 *
 * @param id       购物车项主键
 * @param productId 商品 id
 * @param skuId    SKU id（增减数量 / 删除时定位）
 * @param name     商品名快照
 * @param version  版本快照
 * @param color    颜色快照
 * @param colorHex 颜色色值快照（可为空）
 * @param price    单价快照（元）
 * @param quantity 数量
 * @param image    商品图 URL 快照
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CartItem(long id, long productId, long skuId, String name, String version, String color,
        String colorHex, BigDecimal price, int quantity, String image) {
}
