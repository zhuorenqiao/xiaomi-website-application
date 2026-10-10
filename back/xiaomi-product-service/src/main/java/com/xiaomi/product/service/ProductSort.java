package com.xiaomi.product.service;

/**
 * 搜索排序方式白名单：对外只暴露短编码，MyBatis 映射文件（{@code ProductMapper.xml} 的 {@code orderBy} 片段）
 * 按编码从固定分支里选 ORDER BY，用户输入永远不会拼进 SQL。
 *
 * <p>新增枚举值时，记得同步在 XML 里加一个 {@code <when>} 分支。
 */
public enum ProductSort {

    /** 综合：主推位优先，其次运营配置的展示顺序 */
    DEFAULT("default"),
    /** 销量优先 */
    SALES("sales"),
    /** 价格从低到高 */
    PRICE_ASC("price_asc"),
    /** 价格从高到低 */
    PRICE_DESC("price_desc");

    private final String value;

    ProductSort(String value) {
        this.value = value;
    }

    /** 对外暴露的排序编码（也是 mapper 里的分支键） */
    public String value() {
        return value;
    }

    /** 按编码解析排序方式，非法或为空时回落到综合排序 */
    public static ProductSort from(String value) {
        if (value != null) {
            String normalized = value.trim();
            for (ProductSort sort : values()) {
                if (sort.value.equalsIgnoreCase(normalized)) {
                    return sort;
                }
            }
        }
        return DEFAULT;
    }
}
