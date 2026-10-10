package com.xiaomi.product.mapper;

import com.xiaomi.product.api.SearchFacet;
import com.xiaomi.product.catalog.ProductRow;
import com.xiaomi.product.catalog.ProductSkuRow;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 商品库 MyBatis 映射器：SQL 与动态条件全部在 {@code resources/mapper/ProductMapper.xml} 维护。
 *
 * <p>约定：{@code pattern} 为已经转义并加好百分号的 LIKE 模式（null 表示不加关键词条件），
 * {@code sort} 只接受 {@code ProductSort} 的编码，XML 内用 {@code <choose>} 映射到固定的 ORDER BY 片段，
 * 因此用户输入永远不会以 SQL 片段的形式进入语句。
 */
@Mapper
public interface ProductMapper {

    /** 首页用：全部分类的商品行，按分类展示顺序 + 分类内顺序排列 */
    List<ProductRow> selectAllOrdered();

    /** 详情页用：按主键取单个商品行（不存在时返回 null） */
    ProductRow selectById(@Param("id") long id);

    /** 详情页同类推荐：同分类、排除自身、按销量倒序取前 limit 个 */
    List<ProductRow> selectRelated(@Param("category") String category, @Param("excludeId") long excludeId,
            @Param("limit") int limit);

    /** 详情页 SKU：按商品取全部可选项，按展示顺序排列 */
    List<ProductSkuRow> selectSkusByProductId(@Param("productId") long productId);

    /** 命中总数（关键词 + 分类） */
    long countByCriteria(@Param("pattern") String pattern, @Param("category") String category);

    /** 当前页商品（关键词 + 分类 + 排序 + 分页） */
    List<ProductRow> selectPage(@Param("pattern") String pattern, @Param("category") String category,
            @Param("sort") String sort, @Param("offset") int offset, @Param("limit") int limit);

    /** 分类筛选项及命中数量：只按关键词统计，不受当前选中分类影响 */
    List<SearchFacet> selectFacets(@Param("pattern") String pattern);
}
