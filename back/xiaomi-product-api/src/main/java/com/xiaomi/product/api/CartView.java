package com.xiaomi.product.api;

import java.math.BigDecimal;
import java.util.List;

/**
 * 购物车视图：条目列表 + 汇总，前端一次拿到即可渲染列表、角标件数与合计金额。
 *
 * @param items      购物车条目（按加入先后）
 * @param count      总件数（各条目数量之和，用于导航栏角标）
 * @param totalAmount 合计金额（∑ 单价 x 数量）
 */
public record CartView(List<CartItem> items, int count, BigDecimal totalAmount) {
}
