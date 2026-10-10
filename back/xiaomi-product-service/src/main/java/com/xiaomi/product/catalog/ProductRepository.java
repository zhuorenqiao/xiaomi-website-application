package com.xiaomi.product.catalog;

import com.xiaomi.product.api.ProductFeature;
import com.xiaomi.product.api.ProductItem;
import com.xiaomi.product.api.ProductSection;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.stereotype.Component;

/**
 * 商品目录内存数据源（演示用），承载原前端 siteData.sections 的全部内容。
 *
 * <p>图片沿用统一的 text_to_image 服务：此处按与原前端 <code>prod()/feature()</code>
 * 完全相同的规则拼装 URL（含与 JS <code>encodeURIComponent</code> 一致的百分号编码），
 * 迁移到后端后首页商品列表直接消费接口返回的 image 字段即可，视觉保持不变。
 *
 * <p>真实项目里，把本类替换为基于数据库 / 远程商品中心的 Repository 即可，上层无感。
 */
@Component
public class ProductRepository {

    private static final String IMG_ENDPOINT = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";

    private final List<ProductSection> sections = List.of(
            section("phone", "手机",
                    feature("Xiaomi 15 Ultra", "徕卡光学 · 一英寸主摄", "6499 元起",
                            "flagship smartphone with huge circular quad camera module floating above a reflective surface, deep blue-black gradient background with orange rim light"),
                    List.of(
                            hot("Xiaomi 15 Ultra", "徕卡四摄 · 2K 全等深微曲屏", "6499 元", "新品", "flagship smartphone with huge circular quad camera module, two-tone titanium and black leather back, front and back angled view"),
                            hot("REDMI K80 Pro", "骁龙 8 至尊版 · 2K 直屏", "3699 元", "热卖", "gaming smartphone with glossy blue gradient back and triple camera strip, angled back view"),
                            item("Xiaomi 15", "徕卡光学 Summilux 镜头", "4499 元", "compact flagship smartphone in pastel lavender with square triple camera module, angled back view"),
                            item("REDMI Turbo 4 Pro", "天玑旗舰芯 · 1.5K 护眼屏", "1999 元", "slim smartphone in frosted mint green with dual camera rings, angled back view"),
                            item("Xiaomi Civi 5 Pro", "轻薄人像 · 6.55 英寸好屏", "2999 元", "ultra-thin fashion smartphone in peach pink with small round camera module, angled back view"),
                            item("REDMI Note 15 Pro+", "1.5K 直屏 · 6200mAh 大电量", "1499 元", "mid-range smartphone in graphite black with large circular camera module, angled back view"),
                            hot("Xiaomi 15 Pro", "徕卡三摄 · 骁龙 8 至尊版", "5299 元", "热卖", "flagship smartphone in ceramic white with square quad camera, angled front view showing curved display with colorful wallpaper"),
                            item("REDMI K80", "2K 护眼屏 · 6550mAh", "2499 元", "smartphone in dark grey matte finish with vertical camera lenses, angled back view"))),
            section("wear", "智能穿戴",
                    feature("小米手表 S4", "eSIM 独立通话 · 血氧监测", "999 元起",
                            "smartwatch with bright round AMOLED display surrounded by floating glowing fitness rings graphics, dark teal gradient background"),
                    List.of(
                            hot("小米手表 S4", "eSIM 独立通话 · 150+ 运动模式", "999 元", "新品", "smartwatch with bright round AMOLED screen showing colorful watch face, silver case and orange sport band, angled view"),
                            item("小米手环 10 Pro", "大屏金属机身 · 21 天续航", "499 元", "fitness band with large rectangular AMOLED screen and metal frame, black silicone strap"),
                            item("小米手表 Color 3", "潮流外观 · 全天候监测", "699 元", "colorful smartwatch with fabric strap and round dial showing pastel watch face"),
                            item("REDMI Buds 6 Pro", "55dB 主动降噪 · Hi-Res", "499 元", "pair of white wireless earbuds beside an open charging case"),
                            item("小米儿童手表 S3", "4G 视频 · 家长守护", "799 元", "kids smartwatch in bright yellow with protective bumper and round screen"),
                            hot("小米 Buds 5 Pro", "旗舰降噪 · 空间音频", "1299 元", "热卖", "black wireless in-ear earbuds with glossy touch panels beside charging case"),
                            item("小米手环 10", "超大视野 AMOLED 屏", "399 元", "slim fitness band with curved edge display and coral red strap"),
                            item("小米开放式耳机 Pro", "不入耳佩戴 · 长续航", "1999 元", "open-ear hook style wireless earphone in white, single unit angled view"))),
            section("laptop", "笔记本 | 平板",
                    feature("小米笔记本 Pro 16", "旗舰性能 · 专业创作", "8999 元起",
                            "ultra-thin aluminum laptop half open with tablet and stylus beside it, soft gradient studio background with cool light"),
                    List.of(
                            hot("小米笔记本 Pro 16", "3.1K 大师屏 · 酷睿 Ultra", "8999 元", "新品", "premium thin aluminum laptop open at 100 degrees with blank bright screen, slight side angle"),
                            item("REDMI Book Pro 16 2025", "2.8K 高刷屏 · 大容量电池", "5299 元", "grey aluminum laptop open showing colorful abstract wallpaper on screen, three-quarter view"),
                            hot("小米平板 7S Pro", "3.2K 144Hz · 澎湃 OS", "3299 元", "热卖", "large tablet with slim bezels and stylus magnetically attached, standing with kickstand"),
                            item("小米平板 7 Pro", "骁龙旗舰芯 · 生产力套装", "2599 元", "tablet showing colorful abstract wallpaper with detachable keyboard cover, angled view"),
                            item("REDMI Book 14 2025", "轻薄金属机身 · 长续航", "3999 元", "silver compact laptop open with bright screen, three-quarter front view"),
                            item("小米游戏本 16 Ultra", "旗舰显卡 · 冰川散热", "10999 元", "gaming laptop with RGB backlit keyboard open, aggressive cooling vents design"),
                            item("小米显示器 27 英寸", "4K 专业色彩 · Type-C 90W", "1999 元", "27-inch desktop monitor with thin bezels on minimalist stand showing colorful gradient screen"),
                            item("小米无线键鼠套装", "静音按键 · 双模连接", "199 元", "slim wireless keyboard and matching mouse set in white, top-down angle"))),
            section("appliance", "家电",
                    feature("小米电视 S Pro 85", "Mini LED 千级分区 · 高刷旗舰", "9999 元起",
                            "ultra-thin 85-inch smart TV glowing in an elegant dark living room at dusk with city lights outside the window"),
                    List.of(
                            hot("小米电视 S Pro 65", "Mini LED · 144Hz 高刷", "4299 元", "直降", "ultra-thin bezel-less 4K smart TV showing vivid colorful gradient, slight angle"),
                            item("米家空调 Pro 1.5 匹", "全屋互联 · 超一级能效", "3299 元", "white wall-mounted split air conditioner, front three-quarter view"),
                            item("米家冰箱 610L", "风冷无霜 · 智能互联屏", "3999 元", "large French-door refrigerator in brushed grey steel, front view"),
                            item("米家滚筒洗衣机 1S", "10kg 大容量 · 除菌洗", "2299 元", "white front-loading washing machine with round glass door and touch display"),
                            hot("米家空气净化器 5", "除醛除菌 · 全屋净化", "899 元", "热卖", "minimalist white cylindrical air purifier with round air quality display"),
                            item("米家净水器 1600G", "大通量 · 一秒一杯水", "2999 元", "white water purifier unit with round digital display, front view"),
                            item("米家扫地机器人 5 Pro", "激光导航 · 自动集尘", "2299 元", "round white robot vacuum cleaner with LiDAR tower, three-quarter view"),
                            item("米家除湿机", "静音除湿 · 40L/天", "1499 元", "white portable dehumidifier with water tank and carry handle"))),
            section("smarthome", "智能家居",
                    feature("小米智能门锁 M30 Pro", "3D 结构光人脸识别 · 全自动锁体", "2199 元起",
                            "collection of smart home devices including smart speaker, security camera, door lock and router on a dark gradient background with soft orange glow"),
                    List.of(
                            hot("小米智能摄像头 5 Pro", "2.5K 云台 · AI 智能看家", "349 元", "热卖", "white smart security camera with pan-tilt base and lens, three-quarter view"),
                            item("小米智能门锁 E30", "指纹锁 · 可视猫眼", "1299 元", "black smart door lock with keypad and fingerprint reader, front view"),
                            item("小米路由器 BE7000", "Wi-Fi 7 · 全屋覆盖", "599 元", "black Wi-Fi router with minimalist vertical antenna design, three-quarter view"),
                            item("小爱音箱 Pro", "智能中控 · 红外遥控", "299 元", "smart speaker in dark grey fabric mesh with top control panel"),
                            item("米家智能台灯 Pro", "国AA级照度 · 无蓝光危害", "199 元", "minimalist white LED desk lamp with slim adjustable arm"),
                            item("米家智能网关 3", "全屋设备中枢 · Zigbee 3.0", "199 元", "small white round smart home hub device"),
                            item("米家电水壶 2", "1.7L 大容量 · 双层防烫", "129 元", "white electric kettle with stainless steel interior"),
                            item("米家体重秤 S400", "双频检测 · 数据同步", "199 元", "white glass bathroom scale with small round display")))
    );

    /** 对外暴露的栏目列表 */
    public List<ProductSection> sections() {
        return sections;
    }

    // ---------------- 构造辅助 ----------------

    private static ProductSection section(String id, String title, ProductFeature feature, List<ProductItem> products) {
        return new ProductSection(id, title, feature, products);
    }

    /** 左侧主推大图，CTA 文案统一为「了解更多」 */
    private static ProductFeature feature(String name, String desc, String price, String subject) {
        return new ProductFeature(name, desc, price, "了解更多", poster(subject));
    }

    /** 无角标商品 */
    private static ProductItem item(String name, String desc, String price, String subject) {
        return new ProductItem(name, desc, price, null, photo(subject));
    }

    /** 带角标商品（新品 / 热卖 / 直降等） */
    private static ProductItem hot(String name, String desc, String price, String tag, String subject) {
        return new ProductItem(name, desc, price, tag, photo(subject));
    }

    // ---------------- 图片 URL 构造（与原前端保持一致） ----------------

    private static String photo(String subject) {
        return buildImg("E-commerce studio product photo: " + subject
                + ". Pure white background, centered composition, soft natural shadow, clean catalog photography, photorealistic, 8k", "square");
    }

    private static String poster(String subject) {
        return buildImg("Vertical premium advertising poster: " + subject
                + ". Large empty dark space at the bottom for text overlay, premium commercial photography, photorealistic, cinematic lighting, 8k", "portrait_16_9");
    }

    private static String buildImg(String prompt, String size) {
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
