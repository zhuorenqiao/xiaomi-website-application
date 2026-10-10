package com.xiaomi.product.catalog;

import java.math.BigDecimal;

/**
 * product_sku 的一行（仓储层内部模型，供详情页组装 {@code ProductSku}）。
 * 图片由 service 用商品 image_subject + 本行 colorEn 现拼，故此处不带商品主体描述。
 *
 * @param id        SKU 主键
 * @param version   版本文案
 * @param color     颜色展示文案
 * @param colorEn   颜色英文（拼入成图 prompt）
 * @param colorHex  颜色色值
 * @param price     该 SKU 售价（元）
 * @param stock     库存
 * @param listOrder 展示顺序
 */
public record ProductSkuRow(long id, String version, String color, String colorEn, String colorHex,
        BigDecimal price, int stock, int listOrder) {
}
