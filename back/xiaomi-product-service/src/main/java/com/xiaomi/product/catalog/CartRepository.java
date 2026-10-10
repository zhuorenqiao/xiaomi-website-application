package com.xiaomi.product.catalog;

import com.xiaomi.product.api.CartItem;
import com.xiaomi.product.mapper.CartMapper;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Component;

/**
 * 购物车数据源：直接落 MySQL cart_item（{@link CartMapper}）。
 * 本类只做「与 SQL 无关」的读取封装，数量累加/汇总等在 service 处理。
 */
@Component
public class CartRepository {

    private final CartMapper mapper;

    public CartRepository(CartMapper mapper) {
        this.mapper = mapper;
    }

    /** 某会话的购物车条目（按加入先后） */
    public List<CartItem> list(String sessionId) {
        return mapper.selectBySession(sessionId);
    }

    /** 读取 SKU 快照；商品/SKU 不存在返回 null */
    public SkuSnapshot skuSnapshot(long skuId) {
        return mapper.selectSkuSnapshot(skuId);
    }

    /** 加入 / 累加一行 */
    public void add(String sessionId, SkuSnapshot snapshot, String image, int quantity) {
        mapper.upsertAdd(sessionId, snapshot.productId(), snapshot.skuId(), snapshot.productName(),
                snapshot.version(), snapshot.color(), snapshot.colorHex(), snapshot.price(), quantity, image);
    }

    /** 设为指定数量 */
    public void setQuantity(String sessionId, long skuId, int quantity) {
        mapper.updateQuantity(sessionId, skuId, quantity);
    }

    /** 删除单个条目 */
    public void remove(String sessionId, long skuId) {
        mapper.deleteItem(sessionId, skuId);
    }

    /** 清空该会话 */
    public void clear(String sessionId) {
        mapper.deleteBySession(sessionId);
    }

    /** 合计金额（∑ 单价 x 数量），空车返回 0.00 */
    public static BigDecimal totalAmount(List<CartItem> items) {
        BigDecimal sum = BigDecimal.ZERO;
        for (CartItem item : items) {
            BigDecimal price = item.price() == null ? BigDecimal.ZERO : item.price();
            sum = sum.add(price.multiply(BigDecimal.valueOf(item.quantity())));
        }
        return sum;
    }
}
