package com.xiaomi.product.service;

import com.xiaomi.product.api.ProductSearchResult;
import com.xiaomi.product.api.ProductSection;
import com.xiaomi.product.api.SearchProductItem;
import com.xiaomi.product.catalog.ImageUrls;
import com.xiaomi.product.catalog.ProductRepository;
import com.xiaomi.product.catalog.ProductRow;
import com.xiaomi.product.config.ProductProperties;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * 商品查询服务：首页栏目（分组快照）与搜索分页列表（关键词 + 分类 + 排序 + 分页）。
 */
@Service
public class ProductService {

    private final ProductRepository repository;
    private final ProductProperties properties;

    public ProductService(ProductRepository repository, ProductProperties properties) {
        this.repository = repository;
        this.properties = properties;
    }

    /** 首页全部商品栏目（数据量小、按运营顺序取前 N 个） */
    public List<ProductSection> homepageSections() {
        return repository.homepageSections(properties.gridLimitOrDefault());
    }

    /**
     * 商品搜索 + 分页。
     *
     * <p>先算总数再收敛页码：用户翻到超出范围的页时会回到最后一页，避免出现「有页码却空列表」。
     */
    public ProductSearchResult search(ProductQuery query) {
        long total = repository.count(query.keyword(), query.category());
        int totalPages = (int) Math.min(Integer.MAX_VALUE, (total + query.size() - 1) / query.size());
        int page = Math.min(query.page(), Math.max(1, totalPages));
        ProductQuery effective = new ProductQuery(query.keyword(), query.category(), query.sort(), page, query.size());

        List<ProductRow> rows = repository.findPage(effective.keyword(), effective.category(),
                effective.sort().value(), effective.offset(), effective.size());

        return new ProductSearchResult(effective.keyword(), effective.category(), effective.sort().value(),
                page, effective.size(), total, totalPages,
                page > 1, page < totalPages,
                rows.stream().map(this::toItem).toList(),
                repository.facetCounts(effective.keyword()));
    }

    private SearchProductItem toItem(ProductRow row) {
        return new SearchProductItem(row.name(), row.subtitle(), row.priceText(), row.tag(),
                ImageUrls.photo(row.imageSubject()), row.brand(), row.sales(),
                row.categoryName());
    }
}
