package com.xiaomi.product.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

/**
 * 商品详情页聚合数据（参考 mi.com/shop/buy/detail）：一次请求带回详情视图所需的全部内容，
 * 前端无需再拼装多接口。字段均来自 MySQL 商品库，图片按 {@code image_subject} 生成多视角，
 * 亮点由卖点文案拆分，规格参数与同类推荐由已入库数据派生，保持演示链路自洽。
 *
 * @param id           商品主键
 * @param name         商品名称
 * @param subtitle     一句话卖点（详情页副标题）
 * @param brand        品牌
 * @param price        价格文案（如「6499 元」）
 * @param tag          角标（新品 / 热卖 / 直降），可为空——为空时序列化省略
 * @param category     分类编码（用于「返回列表」按分类筛选）
 * @param categoryName 分类名称（面包屑与推荐标题）
 * @param sales        累计销量
 * @param gallery      主图画廊（多视角商品图 URL，首图与列表卡片一致）
 * @param highlights   核心卖点（由 subtitle 按分隔符拆分）
 * @param poster       图文详情横幅大图 URL
 * @param specs        规格参数表
 * @param skus         可选择的 SKU（版本 x 颜色），驱动详情页价格 / 主图 / 有货联动
 * @param related      同类推荐（同分类、销量靠前的其它商品）
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductDetail(long id, String name, String subtitle, String brand, String price, String tag,
        String category, String categoryName, Integer sales,
        List<String> gallery, List<String> highlights, String poster,
        List<ProductSpec> specs, List<ProductSku> skus, List<SearchProductItem> related) {
}
