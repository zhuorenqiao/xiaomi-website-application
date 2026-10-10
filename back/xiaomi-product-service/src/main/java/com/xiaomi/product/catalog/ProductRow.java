package com.xiaomi.product.catalog;

import java.math.BigDecimal;

/**
 * product 与 product_category 关联后的一行商品数据（仓储层与领域契约之间的内部模型）。
 *
 * @param id              商品主键
 * @param name            商品名称
 * @param subtitle        一句话卖点
 * @param featureSubtitle 首页主推位文案，为空时回落到 subtitle
 * @param brand           品牌
 * @param price           售价（元）
 * @param tag             角标，可为 null
 * @param categoryCode    分类编码（首页栏目 id / 搜索筛选值）
 * @param categoryName    分类名称（首页栏目标题 / 搜索筛选文案）
 * @param imageSubject    白底商品图主体描述
 * @param posterSubject   主推位海报主体描述，仅 isFeature=true 时有值
 * @param isFeature       是否为所属分类的首页主推大图
 * @param sales           累计销量
 * @param listOrder       分类内展示顺序
 */
public record ProductRow(long id, String name, String subtitle, String featureSubtitle, String brand,
        BigDecimal price, String tag, String categoryCode, String categoryName,
        String imageSubject, String posterSubject, boolean isFeature, int sales, int listOrder) {

    /** 主推位价格文案：带「起」（如「6499 元起」），与迁移前的 feature 卡片一致 */
    public String featurePriceText() {
        return amountText() + " 元起";
    }

    /** 网格 / 搜索结果价格文案（如「6499 元」） */
    public String priceText() {
        return amountText() + " 元";
    }

    /** 主推位文案：优先取 featureSubtitle，缺省回落到 subtitle */
    public String featureDesc() {
        return featureSubtitle == null || featureSubtitle.isBlank() ? subtitle : featureSubtitle;
    }

    /** 海报主体：库里没配海报时回落到商品图主体，保证主推位不出错图 */
    public String posterSubjectOrFallback() {
        return posterSubject == null || posterSubject.isBlank() ? imageSubject : posterSubject;
    }

    /** 去掉小数末尾多余的 0：6499.00 -> 6499，99.90 -> 99.9 */
    private String amountText() {
        BigDecimal stripped = price.stripTrailingZeros();
        return (stripped.scale() < 0 ? stripped.setScale(0) : stripped).toPlainString();
    }
}
