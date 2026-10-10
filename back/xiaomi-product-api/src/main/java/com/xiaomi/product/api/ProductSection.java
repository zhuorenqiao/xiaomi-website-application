package com.xiaomi.product.api;

import java.util.List;

/**
 * 首页商品栏目（左大图 + 右商品网格），对应前端 ProductSection 组件的入参结构。
 *
 * @param id       栏目锚点 ID（如 phone / appliance）
 * @param title    栏目标题
 * @param feature  左侧主推大图
 * @param products 右侧商品列表
 */
public record ProductSection(String id, String title, ProductFeature feature, List<ProductItem> products) {
}
