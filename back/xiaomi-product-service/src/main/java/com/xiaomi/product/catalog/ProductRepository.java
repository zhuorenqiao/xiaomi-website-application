package com.xiaomi.product.catalog;

import com.xiaomi.product.api.ProductFeature;
import com.xiaomi.product.api.ProductItem;
import com.xiaomi.product.api.ProductSection;
import com.xiaomi.product.api.SearchFacet;
import com.xiaomi.product.mapper.ProductMapper;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

/**
 * 商品目录数据源：MySQL 的 product / product_category 两张表，SQL 由 MyBatis
 * （{@link ProductMapper} + {@code resources/mapper/ProductMapper.xml}）承担。
 *
 * <p>本类只保留「与 SQL 无关」的两件事：
 * <ul>
 *   <li>首页栏目的分组：分类内取 is_feature=1 作主推位、取前 N 个作网格；</li>
 *   <li>关键词到 LIKE 模式的转换（去空白 + 转义 {@code % _ \} + 加百分号），
 *       让 mapper 里的条件保持成纯占位符。</li>
 * </ul>
 */
@Component
public class ProductRepository {

    private final ProductMapper mapper;

    public ProductRepository(ProductMapper mapper) {
        this.mapper = mapper;
    }

    // ---------------- 首页栏目 ----------------

    /**
     * 首页全部商品栏目：分类按 list_order 排序，栏目内主推位取 is_feature=1 的商品，
     * 网格取该分类 list_order 靠前的 gridLimit 个商品。
     */
    public List<ProductSection> homepageSections(int gridLimit) {
        Map<String, List<ProductRow>> grouped = new LinkedHashMap<>();
        for (ProductRow row : mapper.selectAllOrdered()) {
            grouped.computeIfAbsent(row.categoryCode(), code -> new ArrayList<>()).add(row);
        }

        List<ProductSection> sections = new ArrayList<>(grouped.size());
        grouped.forEach((code, list) -> {
            ProductRow feature = list.stream().filter(ProductRow::isFeature).findFirst().orElse(list.get(0));
            List<ProductItem> products = list.stream().limit(gridLimit).map(this::toItem).toList();
            sections.add(new ProductSection(code, list.get(0).categoryName(), toFeature(feature), products));
        });
        return sections;
    }

    // ---------------- 搜索列表（关键词 + 分类 + 排序 + 分页） ----------------

    /** 命中总数（用于总页数与「共找到 N 件商品」） */
    public long count(String keyword, String category) {
        return mapper.countByCriteria(likePattern(keyword), normalizeCategory(category));
    }

    /**
     * 当前页商品。
     *
     * @param sortCode 排序编码，取值来自 {@code ProductSort}，mapper 内以固定分支映射 ORDER BY
     */
    public List<ProductRow> findPage(String keyword, String category, String sortCode, int offset, int limit) {
        return mapper.selectPage(likePattern(keyword), normalizeCategory(category), sortCode, offset, limit);
    }

    /** 分类筛选项及命中数量：只按关键词统计，不受当前选中分类影响 */
    public List<SearchFacet> facetCounts(String keyword) {
        return mapper.selectFacets(likePattern(keyword));
    }

    // ---------------- 内部辅助 ----------------

    /** 关键词转 LIKE 模式；空关键词返回 null，表示 mapper 里不生成该条件 */
    private static String likePattern(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }
        return "%" + escapeLike(keyword.trim()) + "%";
    }

    /** 转义用户输入里的 LIKE 通配符，避免搜「100%」之类的关键词退化成全表匹配 */
    private static String escapeLike(String keyword) {
        return keyword.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }

    /** 空分类统一成 null，便于 XML 用 {@code category != null} 判断 */
    private static String normalizeCategory(String category) {
        if (category == null || category.isBlank()) {
            return null;
        }
        return category.trim();
    }

    private ProductFeature toFeature(ProductRow row) {
        return new ProductFeature(row.name(), row.featureDesc(), row.featurePriceText(), "了解更多",
                ImageUrls.poster(row.posterSubjectOrFallback()));
    }

    private ProductItem toItem(ProductRow row) {
        return new ProductItem(row.name(), row.subtitle(), row.priceText(), row.tag(), ImageUrls.photo(row.imageSubject()));
    }
}
