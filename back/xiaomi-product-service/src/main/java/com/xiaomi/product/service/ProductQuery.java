package com.xiaomi.product.service;

/**
 * 归一化后的商品搜索查询条件：把「用户随便传的参数」收敛成仓储层可以放心使用的值。
 *
 * @param keyword 关键词（已去空白并截断到 {@link #KEYWORD_MAX_LENGTH}，空串表示不限）
 * @param category 分类编码（已去空白，空串表示不限）
 * @param sort     排序方式（白名单枚举）
 * @param page     页码，从 1 开始
 * @param size     每页条数
 */
public record ProductQuery(String keyword, String category, ProductSort sort, int page, int size) {

    /** 关键词最大长度，避免超长输入放大 LIKE 扫描成本 */
    public static final int KEYWORD_MAX_LENGTH = 64;
    /** 每页条数上限（前端只提供 20 / 40 / 60 三档，这里留一点余量） */
    public static final int MAX_PAGE_SIZE = 60;
    public static final int DEFAULT_PAGE_SIZE = 20;
    /** 页码上限，主要用来防止 offset 溢出与恶意深翻 */
    public static final int MAX_PAGE = 10_000;

    /**
     * 构建查询条件，所有入参都做了兜底归一化：
     * 空关键词=全部商品，size 收敛到 [1, {@link #MAX_PAGE_SIZE}]，page 收敛到 [1, {@link #MAX_PAGE}]。
     */
    public static ProductQuery of(String keyword, String category, String sort, Integer page, Integer size) {
        String cleanKeyword = keyword == null ? "" : keyword.trim();
        if (cleanKeyword.length() > KEYWORD_MAX_LENGTH) {
            cleanKeyword = cleanKeyword.substring(0, KEYWORD_MAX_LENGTH);
        }
        String cleanCategory = category == null ? "" : category.trim();
        int cleanSize = size == null || size < 1 ? DEFAULT_PAGE_SIZE : Math.min(size, MAX_PAGE_SIZE);
        int cleanPage = page == null || page < 1 ? 1 : Math.min(page, MAX_PAGE);
        return new ProductQuery(cleanKeyword, cleanCategory, ProductSort.from(sort), cleanPage, cleanSize);
    }

    /** 当前页的数据库偏移量 */
    public int offset() {
        return (page - 1) * size;
    }
}
