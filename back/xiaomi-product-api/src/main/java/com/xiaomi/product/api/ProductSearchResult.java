package com.xiaomi.product.api;

import java.util.List;

/**
 * 搜索分页结果：一次商品列表查询的完整回包，分页元数据与数据一起返回，
 * 前端不再需要额外接口即可渲染「共找到 N 件商品」与页码条。
 *
 * @param keyword    生效的搜索关键词（已去空白，可为空串表示全部商品）
 * @param category   生效的分类编码，空串表示不限分类
 * @param sort       生效的排序方式（default / sales / price_asc / price_desc）
 * @param page       当前页码（从 1 开始，超出总页数时已被服务端收敛到最后一页）
 * @param size       每页条数
 * @param total      命中总条数
 * @param totalPages 总页数
 * @param hasPrev    是否有上一页
 * @param hasNext    是否有下一页
 * @param items      当前页商品列表
 * @param categories 分类筛选项（含命中数量），用于渲染分类筛选条
 */
public record ProductSearchResult(String keyword, String category, String sort, int page, int size,
        long total, int totalPages, boolean hasPrev, boolean hasNext,
        List<SearchProductItem> items, List<SearchFacet> categories) {
}
