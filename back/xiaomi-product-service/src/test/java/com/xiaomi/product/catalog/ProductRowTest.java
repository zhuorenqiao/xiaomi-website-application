package com.xiaomi.product.catalog;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

/**
 * 商品行 -> 前端文案的映射（纯逻辑，不连数据库）：
 * 价格「6499.00 -> 6499 元」、主推位文案与海报的回落规则。
 */
class ProductRowTest {

    private static ProductRow row(String price, String subtitle, String featureSubtitle, String posterSubject) {
        return new ProductRow(1L, "小米电视 S Pro 85", subtitle, featureSubtitle, "Xiaomi",
                new BigDecimal(price), "新品", "tv", "电视", "85-inch mini LED smart TV", posterSubject,
                true, 24500, 1);
    }

    @Test
    void 价格去掉多余小数并按场景出文案() {
        ProductRow row = row("6499.00", "Mini LED · 144Hz 高刷", null, null);
        assertThat(row.priceText()).isEqualTo("6499 元");
        assertThat(row.featurePriceText()).isEqualTo("6499 元起");
        assertThat(row("99.90", "s", null, null).priceText()).isEqualTo("99.9 元");
        assertThat(row("15999", "s", null, null).priceText()).isEqualTo("15999 元");
    }

    @Test
    void 主推位文案缺省时回落到卖点() {
        assertThat(row("9999", "Mini LED · 144Hz 高刷", null, null).featureDesc()).isEqualTo("Mini LED · 144Hz 高刷");
        assertThat(row("9999", "Mini LED · 144Hz 高刷", "千级分区 · 高刷旗舰", null).featureDesc())
                .isEqualTo("千级分区 · 高刷旗舰");
    }

    @Test
    void 没配海报时回落到商品图主体() {
        assertThat(row("9999", "s", null, null).posterSubjectOrFallback()).isEqualTo("85-inch mini LED smart TV");
        assertThat(row("9999", "s", null, "dark living room TV").posterSubjectOrFallback())
                .isEqualTo("dark living room TV");
    }
}
