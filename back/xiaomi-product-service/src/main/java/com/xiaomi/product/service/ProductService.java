package com.xiaomi.product.service;

import com.xiaomi.product.api.ProductDetail;
import com.xiaomi.product.api.ProductSearchResult;
import com.xiaomi.product.api.ProductSection;
import com.xiaomi.product.api.ProductSku;
import com.xiaomi.product.api.ProductSpec;
import com.xiaomi.product.api.SearchProductItem;
import com.xiaomi.product.catalog.ImageUrls;
import com.xiaomi.product.catalog.ProductRepository;
import com.xiaomi.product.catalog.ProductRow;
import com.xiaomi.product.catalog.ProductSkuRow;
import com.xiaomi.product.config.ProductProperties;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * 商品查询服务：首页栏目（分组快照）与搜索分页列表（关键词 + 分类 + 排序 + 分页）。
 */
@Service
public class ProductService {

    /** 同类推荐取数量 */
    private static final int RELATED_LIMIT = 8;
    /** 搜索联想词下拉最多展示几条 */
    private static final int SUGGEST_LIMIT = 10;
    /** 画廊多视角：首图沿用列表卡片的正面图（保证点击前后视觉一致），再补 4 个机位 */
    private static final String[] GALLERY_ANGLES = {
            "back view showing the camera module and finish",
            "side profile showing thin bezels and ports",
            "angled hero view with premium lighting",
            "close-up detail of materials and build quality",
    };

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

    /**
     * 搜索框联想词：只按商品名匹配，销量高优先，最多 {@value #SUGGEST_LIMIT} 条。
     *
     * <p>空关键词直接返回空列表（不把整个商品库倒给前端），超长关键词按搜索接口的同一上限截断。
     */
    public List<String> suggest(String keyword) {
        String clean = keyword == null ? "" : keyword.trim();
        if (clean.length() > ProductQuery.KEYWORD_MAX_LENGTH) {
            clean = clean.substring(0, ProductQuery.KEYWORD_MAX_LENGTH);
        }
        return clean.isEmpty() ? List.of() : repository.suggest(clean, SUGGEST_LIMIT);
    }

    private SearchProductItem toItem(ProductRow row) {
        return new SearchProductItem(row.id(), row.name(), row.subtitle(), row.priceText(), row.tag(),
                ImageUrls.photo(row.imageSubject()), row.brand(), row.sales(),
                row.categoryName());
    }

    /**
     * 商品详情：按主键取回商品行，派生画廊 / 卖点 / 规格参数 / 同类推荐，组装成详情页一次性回包。
     *
     * @param id 商品主键
     * @return 详情聚合数据；商品不存在时返回 {@code null}（controller 转成业务错误）
     */
    public ProductDetail detail(long id) {
        ProductRow row = repository.findById(id);
        if (row == null) {
            return null;
        }
        List<SearchProductItem> related = repository.related(row.categoryCode(), row.id(), RELATED_LIMIT)
                .stream().map(this::toItem).toList();
        return new ProductDetail(row.id(), row.name(), row.subtitle(), row.brand(), row.priceText(), row.tag(),
                row.categoryCode(), row.categoryName(), row.sales(),
                buildGallery(row.imageSubject()), buildHighlights(row.subtitle()),
                ImageUrls.detailBanner(row.posterSubjectOrFallback()), buildSpecs(row), buildSkus(row), related);
    }

    /**
     * SKU 列表：用商品 image_subject + SKU 颜色英文拼出每张颜色主图。
     * 若该商品尚未配 SKU（理论上不会，种子已覆盖），回落到一条不可下单的默认项以防前端报错。
     */
    private List<ProductSku> buildSkus(ProductRow row) {
        List<ProductSkuRow> rows = repository.findSkus(row.id());
        if (rows.isEmpty()) {
            return List.of(new ProductSku(0L, "默认版本", "默认", "#f5f5f5", row.price(), 0,
                    ImageUrls.photo(row.imageSubject())));
        }
        return rows.stream()
                .map(sku -> new ProductSku(sku.id(), sku.version(), sku.color(), sku.colorHex(), sku.price(),
                        sku.stock(), ImageUrls.photoColor(row.imageSubject(), sku.colorEn())))
                .toList();
    }

    /** 画廊：正面主图 + 多视角变体，均基于同一 image_subject，视觉与列表卡片一致 */
    private static List<String> buildGallery(String subject) {
        List<String> gallery = new ArrayList<>(GALLERY_ANGLES.length + 1);
        gallery.add(ImageUrls.photo(subject));
        for (String angle : GALLERY_ANGLES) {
            gallery.add(ImageUrls.photoVariant(subject, angle));
        }
        return gallery;
    }

    /** 卖点：把「A · B · C」形式的副标题拆成独立亮点，供详情页高亮条展示 */
    private static List<String> buildHighlights(String subtitle) {
        if (subtitle == null || subtitle.isBlank()) {
            return List.of();
        }
        return Arrays.stream(subtitle.split("[·・/｜|]+"))
                .map(String::trim)
                .filter(part -> !part.isEmpty())
                .toList();
    }

    /** 规格参数：由已入库字段派生（演示级参数表，不新增库列以保持链路直观） */
    private static List<ProductSpec> buildSpecs(ProductRow row) {
        return List.of(
                new ProductSpec("商品名称", row.name()),
                new ProductSpec("品牌", row.brand()),
                new ProductSpec("所属分类", row.categoryName()),
                new ProductSpec("售价", row.priceText()),
                new ProductSpec("累计销量", row.sales() + " 件"),
                new ProductSpec("商品编号", String.valueOf(row.id())));
    }
}
