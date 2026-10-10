package com.xiaomi.product.api;

import java.math.BigDecimal;

/**
 * 商品详情页可选择的单个 SKU（版本 x 颜色）。前端据此渲染版本 / 颜色选择器，
 * 选中后用 {@code price} 覆盖展示价、用 {@code image} 切换主图、用 {@code stock} 判定是否有货。
 *
 * @param id        SKU 主键（加入购物车时用其定位）
 * @param version   版本 / 规格文案（如「标准版」「升级版」）
 * @param color     颜色展示文案（如「曜石黑」）
 * @param colorHex  颜色色值（用于色块展示，如 #2b2b2b）
 * @param price     该 SKU 售价（元，数字便于前端按选择实时联动价格与合计）
 * @param stock     库存，0 表示无货
 * @param image     该 SKU 对应颜色的商品图 URL
 */
public record ProductSku(long id, String version, String color, String colorHex,
        BigDecimal price, int stock, String image) {
}
