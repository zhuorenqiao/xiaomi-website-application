package com.xiaomi.product.service;

import com.xiaomi.product.api.CartItem;
import com.xiaomi.product.api.CartView;
import com.xiaomi.product.catalog.CartRepository;
import com.xiaomi.product.catalog.ImageUrls;
import com.xiaomi.product.catalog.SkuSnapshot;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * 购物车服务：以游客会话 id 归组，加入时对 SKU 做快照，写操作后统一返回最新视图。
 */
@Service
public class CartService {

    /** 单条数量上限，防止异常入参把数量刷爆 */
    private static final int MAX_QUANTITY = 999;

    private final CartRepository repository;

    public CartService(CartRepository repository) {
        this.repository = repository;
    }

    /** 当前会话购物车视图（条目 + 件数 + 合计金额） */
    public CartView view(String sessionId) {
        List<CartItem> items = repository.list(sessionId);
        int count = items.stream().mapToInt(CartItem::quantity).sum();
        BigDecimal total = CartRepository.totalAmount(items);
        return new CartView(items, count, total);
    }

    /** 加入购物车：按 SKU 快照生成图片，命中同一 SKU 时累加数量 */
    public CartView add(String sessionId, long skuId, int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("数量必须大于 0");
        }
        SkuSnapshot snapshot = repository.skuSnapshot(skuId);
        if (snapshot == null) {
            throw new IllegalArgumentException("商品不存在");
        }
        String image = ImageUrls.photoColor(snapshot.imageSubject(), snapshot.colorEn());
        repository.add(sessionId, snapshot, image, Math.min(quantity, MAX_QUANTITY));
        return view(sessionId);
    }

    /** 设为指定数量；&lt;1 视为删除 */
    public CartView updateQuantity(String sessionId, long skuId, int quantity) {
        if (quantity < 1) {
            repository.remove(sessionId, skuId);
        } else {
            repository.setQuantity(sessionId, skuId, Math.min(quantity, MAX_QUANTITY));
        }
        return view(sessionId);
    }

    /** 删除单个条目 */
    public CartView remove(String sessionId, long skuId) {
        repository.remove(sessionId, skuId);
        return view(sessionId);
    }

    /** 清空购物车 */
    public CartView clear(String sessionId) {
        repository.clear(sessionId);
        return view(sessionId);
    }
}
