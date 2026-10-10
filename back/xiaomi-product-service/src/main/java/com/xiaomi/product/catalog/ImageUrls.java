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

    /** 竖版主推海报（首页栏目左侧大图，底部留黑边压文案） */
    public static String poster(String subject) {
        return build("Vertical premium advertising poster: " + subject
                + ". Large empty dark space at the bottom for text overlay, premium commercial photography, photorealistic, cinematic lighting, 8k", "portrait_16_9");
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
