package com.xiaomi.product.web;

import com.xiaomi.product.api.ApiResponse;
import com.xiaomi.product.api.CartItemRequest;
import com.xiaomi.product.api.CartView;
import com.xiaomi.product.service.CartService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 购物车接口（游客会话，数据落 MySQL cart_item）：
 * <ul>
 *   <li>GET    /api/cart?sessionId= —— 查看（条目 + 件数 + 合计）；</li>
 *   <li>POST   /api/cart/items —— 加入（body: sessionId/skuId/quantity，命中同 SKU 累加）；</li>
 *   <li>PUT    /api/cart/items —— 设为指定数量（&lt;1 删除）；</li>
 *   <li>DELETE /api/cart/items?sessionId=&amp;skuId= —— 删除单个；</li>
 *   <li>DELETE /api/cart?sessionId= —— 清空。</li>
 * </ul>
 * 写操作一律返回最新的 {@link CartView}，前端据此同步列表与角标。
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ApiResponse<CartView> view(@RequestParam(name = "sessionId", required = false) String sessionId) {
        String session = sessionId == null ? "" : sessionId.trim();
        if (session.isEmpty()) {
            return ApiResponse.ok(new CartView(List.of(), 0, BigDecimal.ZERO));
        }
        return ApiResponse.ok(cartService.view(session));
    }

    @PostMapping("/items")
    public ApiResponse<CartView> add(@RequestBody CartItemRequest request) {
        String session = requireSession(request.sessionId());
        long skuId = requireSkuId(request.skuId());
        int quantity = request.quantity() == null ? 1 : request.quantity();
        return ApiResponse.ok(cartService.add(session, skuId, quantity));
    }

    @PutMapping("/items")
    public ApiResponse<CartView> update(@RequestBody CartItemRequest request) {
        String session = requireSession(request.sessionId());
        long skuId = requireSkuId(request.skuId());
        int quantity = request.quantity() == null ? 1 : request.quantity();
        return ApiResponse.ok(cartService.updateQuantity(session, skuId, quantity));
    }

    @DeleteMapping("/items")
    public ApiResponse<CartView> remove(@RequestParam(name = "sessionId") String sessionId,
            @RequestParam(name = "skuId") Long skuId) {
        String session = requireSession(sessionId);
        long id = requireSkuId(skuId);
        return ApiResponse.ok(cartService.remove(session, id));
    }

    @DeleteMapping
    public ApiResponse<CartView> clear(@RequestParam(name = "sessionId") String sessionId) {
        return ApiResponse.ok(cartService.clear(requireSession(sessionId)));
    }

    private static String requireSession(String sessionId) {
        String session = sessionId == null ? "" : sessionId.trim();
        if (session.isEmpty()) {
            throw new IllegalArgumentException("缺少购物车会话");
        }
        return session;
    }

    private static long requireSkuId(Long skuId) {
        if (skuId == null || skuId <= 0) {
            throw new IllegalArgumentException("缺少商品 SKU");
        }
        return skuId;
    }
}
