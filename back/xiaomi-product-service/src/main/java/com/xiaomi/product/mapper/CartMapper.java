package com.xiaomi.product.mapper;

import com.xiaomi.product.api.CartItem;
import com.xiaomi.product.catalog.SkuSnapshot;
import java.math.BigDecimal;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 购物车 MyBatis 映射器：SQL 在 {@code resources/mapper/CartMapper.xml} 维护。
 *
 * <p>购物车以「游客会话 id」归组；加入时对 SKU 做快照，条目直接自动映射到 {@link CartItem}
 * （查询里用列别名对齐其字段名）。写入全部走 {@code #{}} 预编译占位符。
 */
@Mapper
public interface CartMapper {

    /** 某会话的购物车条目，按加入先后（id 升序）返回 */
    List<CartItem> selectBySession(@Param("sessionId") String sessionId);

    /** 读取 SKU 及其商品快照（加入购物车时用），不存在返回 null */
    SkuSnapshot selectSkuSnapshot(@Param("skuId") long skuId);

    /** 加入 / 累加：命中唯一键 (session_id, sku_id) 时把数量累加，否则新插入一行 */
    int upsertAdd(@Param("sessionId") String sessionId, @Param("productId") long productId,
            @Param("skuId") long skuId, @Param("productName") String productName,
            @Param("version") String version, @Param("color") String color,
            @Param("colorHex") String colorHex, @Param("price") BigDecimal price,
            @Param("quantity") int quantity, @Param("image") String image);

    /** 设为指定数量 */
    int updateQuantity(@Param("sessionId") String sessionId, @Param("skuId") long skuId,
            @Param("quantity") int quantity);

    /** 删除单个 SKU 条目 */
    int deleteItem(@Param("sessionId") String sessionId, @Param("skuId") long skuId);

    /** 清空该会话购物车 */
    int deleteBySession(@Param("sessionId") String sessionId);
}
