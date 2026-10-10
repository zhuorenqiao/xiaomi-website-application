package com.xiaomi.product.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/**
 * 搜索参数归一化（纯逻辑，不连数据库）：分页与排序的边界都收敛在这里，
 * 避免脏参数把 SQL 的 LIMIT/OFFSET 打飞。
 */
class ProductQueryTest {

    @Test
    void 全部为空时回落到默认查询() {
        assertThat(ProductQuery.of(null, null, null, null, null))
                .isEqualTo(new ProductQuery("", "", ProductSort.DEFAULT, 1, ProductQuery.DEFAULT_PAGE_SIZE));
    }

    @Test
    void 去除首尾空白并保留分类条件() {
        ProductQuery query = ProductQuery.of("  电视  ", " tv ", "price_desc", 3, 40);
        assertThat(query.keyword()).isEqualTo("电视");
        assertThat(query.category()).isEqualTo("tv");
        assertThat(query.sort()).isEqualTo(ProductSort.PRICE_DESC);
        assertThat(query.page()).isEqualTo(3);
        assertThat(query.size()).isEqualTo(40);
    }

    @Test
    void 非法分页参数被收敛到合法区间() {
        assertThat(ProductQuery.of("电视", "", "default", 0, 0).page()).isEqualTo(1);
        assertThat(ProductQuery.of("电视", "", "default", -5, 0).size()).isEqualTo(ProductQuery.DEFAULT_PAGE_SIZE);
        assertThat(ProductQuery.of("电视", "", "default", 1, 9999).size()).isEqualTo(ProductQuery.MAX_PAGE_SIZE);
        assertThat(ProductQuery.of("电视", "", "default", 999999, 20).page()).isEqualTo(ProductQuery.MAX_PAGE);
    }

    @Test
    void 超长关键词被截断() {
        String longKeyword = "电".repeat(ProductQuery.KEYWORD_MAX_LENGTH + 10);
        assertThat(ProductQuery.of(longKeyword, "", null, 1, 20).keyword())
                .isEqualTo("电".repeat(ProductQuery.KEYWORD_MAX_LENGTH));
    }

    @Test
    void 未知排序编码回落到综合排序() {
        assertThat(ProductQuery.of("电视", "", "no-such-sort; DROP TABLE product", 1, 20).sort())
                .isEqualTo(ProductSort.DEFAULT);
    }

    @Test
    void 页码从1开始换算偏移量() {
        assertThat(new ProductQuery("电视", "tv", ProductSort.SALES, 1, 20).offset()).isZero();
        assertThat(new ProductQuery("电视", "tv", ProductSort.SALES, 3, 20).offset()).isEqualTo(40);
    }

    @Test
    void 排序编码与mapper分支一一对应() {
        // ProductMapper.xml 的 orderBy 片段只认这几个编码（default 走 <otherwise>），
        // 新增枚举值必须同时补 XML 分支，否则会被默默当成综合排序
        assertThat(ProductSort.values()).extracting(ProductSort::value)
                .containsExactly("default", "sales", "price_asc", "price_desc");
        for (ProductSort sort : ProductSort.values()) {
            assertThat(ProductSort.from(sort.value())).isEqualTo(sort);
        }
    }
}
