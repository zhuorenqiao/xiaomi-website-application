package com.xiaomi.product.web;

import com.xiaomi.product.api.ApiResponse;
import com.xiaomi.product.api.ProductSearchResult;
import com.xiaomi.product.api.ProductSection;
import com.xiaomi.product.service.ProductQuery;
import com.xiaomi.product.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 商品接口：
 * <ul>
 *   <li>GET /api/products/sections —— 首页商品栏目；</li>
 *   <li>GET /api/products/search —— 关键词搜索 + 分类筛选 + 排序 + 分页的商品列表。</li>
 * </ul>
 * 两者数据均来自 MySQL 商品库（back/db/docker-compose.yml）。
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * 返回首页全部商品栏目（左大图 + 右商品网格）。
     *
     * @return 统一响应外层，{@code data} 为栏目列表（结构与前端 ProductSection 组件一致）
     */
    @GetMapping("/sections")
    public ApiResponse<List<ProductSection>> sections() {
        return ApiResponse.ok(productService.homepageSections());
    }

    /**
     * 商品列表搜索（分页）。参考小米商城 /shop/search?keyword=电视：
     * 关键词命中商品名 / 卖点 / 品牌 / 分类名，可按分类过滤与排序，返回命中总数与页码信息。
     *
     * @param keyword  关键词，留空表示浏览全部商品
     * @param category 分类编码（如 tv），留空表示不限分类
     * @param sort     排序方式：default 综合 / sales 销量 / price_asc 价格升 / price_desc 价格降
     * @param page     页码，从 1 开始，超出总页数时收敛到最后一页
     * @param size     每页条数，默认 20，上限 60
     * @return 统一响应外层，{@code data} 为分页结果（含 items / total / totalPages / categories 筛选项）
     */
    @GetMapping("/search")
    public ApiResponse<ProductSearchResult> search(@RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "sort", required = false) String sort,
            @RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "size", required = false) Integer size) {
        return ApiResponse.ok(productService.search(ProductQuery.of(keyword, category, sort, page, size)));
    }
}
