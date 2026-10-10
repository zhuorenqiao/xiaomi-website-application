package com.xiaomi.product.catalog;

import java.nio.charset.StandardCharsets;

/**
 * 商品图 URL 构造：库里只存英文主体描述（image_subject / poster_subject），
 * 出参时统一拼成 text_to_image 服务地址，规则与迁移前前端 siteData 的
 * <code>prod() / feature()</code> 完全一致（含与 JS <code>encodeURIComponent</code> 相同的百分号编码），
 * 因此改为数据库供数后首页与搜索页视觉不变。
 */
public final class ImageUrls {

    private static final String IMG_ENDPOINT = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";

    private ImageUrls() {
    }

    /** 白底商品图（首页网格与搜索结果卡片） */
    public static String photo(String subject) {
        return build("E-commerce studio product photo: " + subject
                + ". Pure white background, centered composition, soft natural shadow, clean catalog photography, photorealistic, 8k", "square");
    }

    /**
     * 详情页多视角商品图：与 {@link #photo} 同风格，仅追加视角描述，
     * 让同一商品的画廊呈现正面 / 背面 / 侧面 / 特写等不同机位。
     *
     * @param subject 商品主体描述
     * @param angle   视角描述（如 back view showing the camera module）
     */
    public static String photoVariant(String subject, String angle) {
        return build("E-commerce studio product photo: " + subject + ", " + angle
                + ". Pure white background, centered composition, soft natural shadow, clean catalog photography, photorealistic, 8k", "square");
    }

    /**
     * 按颜色成图：与 {@link #photo} 同风格，额外描述配色（colorway），
     * 让同一商品不同颜色 SKU 的主图随之变化。
     *
     * @param subject 商品主体描述
     * @param colorEn 颜色英文（如 black）
     */
    public static String photoColor(String subject, String colorEn) {
        return build("E-commerce studio product photo: " + subject + ", in " + colorEn
                + " colorway. Pure white background, centered composition, soft natural shadow, clean catalog photography, photorealistic, 8k", "square");
    }

    /** 竖版主推海报（首页栏目左侧大图，底部留黑边压文案） */
    public static String poster(String subject) {
        return build("Vertical premium advertising poster: " + subject
                + ". Large empty dark space at the bottom for text overlay, premium commercial photography, photorealistic, cinematic lighting, 8k", "portrait_16_9");
    }

    /** 详情页图文横幅（通栏大图，用于「概述」卖点展示区） */
    public static String detailBanner(String subject) {
        return build("Wide editorial product showcase: " + subject
                + ". Soft light studio backdrop, generous negative space on one side for text, premium commercial photography, photorealistic, 8k", "landscape_16_9");
    }

    private static String build(String prompt, String size) {
        return IMG_ENDPOINT + "?prompt=" + percentEncode(prompt) + "&image_size=" + size;
    }

    /** 等价于 JS encodeURIComponent：仅保留 [A-Za-z0-9-_.!~*'()]，其余按 UTF-8 百分号编码（空格 -> %20） */
    private static String percentEncode(String value) {
        StringBuilder sb = new StringBuilder();
        for (byte b : value.getBytes(StandardCharsets.UTF_8)) {
            int c = b & 0xFF;
            boolean unreserved = (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')
                    || c == '-' || c == '_' || c == '.' || c == '!' || c == '~' || c == '*'
                    || c == '\'' || c == '(' || c == ')';
            if (unreserved) {
                sb.append((char) c);
            } else {
                sb.append('%');
                sb.append(Character.toUpperCase(Character.forDigit((c >> 4) & 0xF, 16)));
                sb.append(Character.toUpperCase(Character.forDigit(c & 0xF, 16)));
            }
        }
        return sb.toString();
    }
}
