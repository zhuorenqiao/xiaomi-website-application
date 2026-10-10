package com.xiaomi.product.catalog;

import java.math.BigDecimal;

/**
 * SKU 与其所属商品关联后的快照行（加入购物车时读取，用于落库展示字段）。
 *
 * @param productId    商品 id
 * @param productName  商品名
 * @param skuId        SKU id
 * @param version      版本文案
 * @param color        颜色展示文案
 * @param colorEn      颜色英文（拼入成图 prompt）
 * @param colorHex     颜色色值
 * @param price        SKU 单价（元）
 * @param imageSubject 商品图主体描述（用于生成加入时的图片快照）
 */
public record SkuSnapshot(long productId, String productName, long skuId, String version, String color,
        String colorEn, String colorHex, BigDecimal price, String imageSubject) {
}
