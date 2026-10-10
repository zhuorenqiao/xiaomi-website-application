-- ============================================================
-- 商品种子数据（幂等：固定主键 + INSERT IGNORE，重启不会重复灌入）
-- 需要重新灌入时：先清空 product / product_category 表，再重启商品服务。
-- image_subject / poster_subject 只存主体描述，完整成图 URL 由后端 ImageUrls 统一拼装，
-- 规则与迁移前的前端 prod() / feature() 完全一致，首页视觉保持不变。
-- ============================================================

INSERT IGNORE INTO product_category (id, code, name, list_order)
VALUES (1, 'phone', '手机', 1),
       (2, 'tv', '电视', 2),
       (3, 'laptop', '笔记本 | 平板', 3),
       (4, 'wear', '智能穿戴', 4),
       (5, 'appliance', '家电', 5),
       (6, 'smarthome', '智能家居', 6);

-- ---------------- 手机（1001 起） ----------------
INSERT IGNORE INTO product (id, name, subtitle, feature_subtitle, brand, price, tag, category_code, image_subject, poster_subject, is_feature, sales, list_order)
VALUES (1001, 'Xiaomi 15 Ultra', '徕卡四摄 · 2K 全等深微曲屏', '徕卡光学 · 一英寸主摄', 'Xiaomi', 6499, '新品', 'phone', 'flagship smartphone with huge circular quad camera module, two-tone titanium and black leather back, front and back angled view', 'flagship smartphone with huge circular quad camera module floating above a reflective surface, deep blue-black gradient background with orange rim light', 1, 98230, 1),
       (1002, 'REDMI K80 Pro', '骁龙 8 至尊版 · 2K 直屏', NULL, 'REDMI', 3699, '热卖', 'phone', 'gaming smartphone with glossy blue gradient back and triple camera strip, angled back view', NULL, 0, 156800, 2),
       (1003, 'Xiaomi 15', '徕卡光学 Summilux 镜头', NULL, 'Xiaomi', 4499, NULL, 'phone', 'compact flagship smartphone in pastel lavender with square triple camera module, angled back view', NULL, 0, 45120, 3),
       (1004, 'REDMI Turbo 4 Pro', '天玑旗舰芯 · 1.5K 护眼屏', NULL, 'REDMI', 1999, NULL, 'phone', 'slim smartphone in frosted mint green with dual camera rings, angled back view', NULL, 0, 88210, 4),
       (1005, 'Xiaomi Civi 5 Pro', '轻薄人像 · 6.55 英寸好屏', NULL, 'Xiaomi', 2999, NULL, 'phone', 'ultra-thin fashion smartphone in peach pink with small round camera module, angled back view', NULL, 0, 33450, 5),
       (1006, 'REDMI Note 15 Pro+', '1.5K 直屏 · 6200mAh 大电量', NULL, 'REDMI', 1499, NULL, 'phone', 'mid-range smartphone in graphite black with large circular camera module, angled back view', NULL, 0, 201300, 6),
       (1007, 'Xiaomi 15 Pro', '徕卡三摄 · 骁龙 8 至尊版', NULL, 'Xiaomi', 5299, '热卖', 'phone', 'flagship smartphone in ceramic white with square quad camera, angled front view showing curved display with colorful wallpaper', NULL, 0, 52140, 7),
       (1008, 'REDMI K80', '2K 护眼屏 · 6550mAh', NULL, 'REDMI', 2499, NULL, 'phone', 'smartphone in dark grey matte finish with vertical camera lenses, angled back view', NULL, 0, 120450, 8),
       (1009, 'REDMI Note 14', '千元 5G · 大电池长续航', NULL, 'REDMI', 999, NULL, 'phone', 'budget smartphone in sky blue with dual camera strip, angled back view', NULL, 0, 268900, 9),
       (1010, 'Xiaomi MIX 4', '屏下摄像 · 陶瓷一体化机身', NULL, 'Xiaomi', 4999, NULL, 'phone', 'ceramic white unibody smartphone with seamless front display, three-quarter view', NULL, 0, 12450, 10),
       (1011, 'Xiaomi MIX Fold 4', '折叠旗舰 · 徕卡四摄', NULL, 'Xiaomi', 8999, '新品', 'phone', 'foldable smartphone half unfolded showing inner square display and rear camera bar', NULL, 0, 9860, 11),
       (1012, 'Xiaomi Civi 4 Pro', '徕卡人像 · 轻薄直屏', NULL, 'Xiaomi', 2299, NULL, 'phone', 'slim fashion smartphone in mint green with pill-shaped dual camera, angled back view', NULL, 0, 41230, 12),
       (1013, 'REDMI 14C', '大屏大音量 · 长续航', NULL, 'REDMI', 649, NULL, 'phone', 'entry-level smartphone in dark grey with single camera module, front view', NULL, 0, 189600, 13),
       (1014, 'Xiaomi 14 Ultra', '一英寸主摄 · 专业影像套装', NULL, 'Xiaomi', 5499, NULL, 'phone', 'flagship smartphone with large round quad camera module in black vegan leather, angled back view', NULL, 0, 76540, 14),
       (1015, 'REDMI Turbo 4', '天玑芯 · 90W 快充', NULL, 'REDMI', 1499, NULL, 'phone', 'smartphone in glossy violet gradient back with dual camera rings, angled view', NULL, 0, 95430, 15);

-- ---------------- 电视（2001 起，数量足以验证多页分页） ----------------
INSERT IGNORE INTO product (id, name, subtitle, feature_subtitle, brand, price, tag, category_code, image_subject, poster_subject, is_feature, sales, list_order)
VALUES (2001, '小米电视 S Pro 85', 'Mini LED · 144Hz 高刷', 'Mini LED 千级分区 · 高刷旗舰', 'Xiaomi', 9999, '新品', 'tv', 'ultra-thin 85-inch mini LED smart TV with slim bezel showing vivid colorful gradient wallpaper, central metal stand, slight front angle', 'ultra-thin 85-inch smart TV glowing in an elegant dark living room at dusk with city lights outside the window', 1, 24500, 1),
       (2002, '小米电视 S Pro 75', 'Mini LED · 240Hz 赛事级高刷', NULL, 'Xiaomi', 7999, NULL, 'tv', '75-inch mini LED smart TV showing football match on screen, thin bezel, metal blade stand', NULL, 0, 31200, 2),
       (2003, '小米电视 S Pro 65', 'Mini LED · 144Hz 高刷', NULL, 'Xiaomi', 4299, '直降', 'tv', 'ultra-thin bezel-less 4K smart TV showing vivid colorful gradient, slight angle', NULL, 0, 68900, 3),
       (2004, 'REDMI 智能电视 MAX 98', '98 英寸巨幕 · 家庭影院', NULL, 'REDMI', 15999, '新品', 'tv', 'enormous 98-inch home theatre TV mounted on a dark feature wall showing cinematic landscape', NULL, 0, 4210, 4),
       (2005, 'REDMI 智能电视 MAX 86', '86 英寸大屏 · 4K 120Hz', NULL, 'REDMI', 8999, NULL, 'tv', '86-inch large screen TV on a minimalist living room stand showing colorful abstract art', NULL, 0, 8630, 5),
       (2006, 'REDMI 智能电视 X 2026 75', '75 英寸 · 144Hz 游戏电视', NULL, 'REDMI', 4799, NULL, 'tv', '75-inch gaming smart TV displaying racing game on screen, RGB ambient backlight glow', NULL, 0, 21300, 6),
       (2007, 'REDMI 智能电视 X 2026 65', '4K 高刷 · 双 120Hz', NULL, 'REDMI', 3299, '热卖', 'tv', '65-inch smart TV with slim bezels showing a video game scene, angled view', NULL, 0, 55400, 7),
       (2008, '小米电视 S Mini LED 75', 'Mini LED · 4K 超高清', NULL, 'Xiaomi', 4599, NULL, 'tv', '75-inch mini LED television front view with colorful HDR nature wallpaper', NULL, 0, 33900, 8),
       (2009, '小米电视 S Mini LED 65', '4K 144Hz · 3+64GB', NULL, 'Xiaomi', 3299, NULL, 'tv', '65-inch smart TV with thin bezels showing nature documentary on screen', NULL, 0, 47800, 9),
       (2010, '小米电视 S Mini LED 55', '4K 高色域 · 金属机身', NULL, 'Xiaomi', 2499, NULL, 'tv', '55-inch smart TV with metallic frame showing city skyline at night', NULL, 0, 62300, 10),
       (2011, 'REDMI 智能电视 A Pro 75', '75 英寸 4K · 全景声音效', NULL, 'REDMI', 3799, NULL, 'tv', '75-inch large screen TV on wooden cabinet showing colorful streaming UI menu', NULL, 0, 18900, 11),
       (2012, 'REDMI 智能电视 A Pro 65', '4K 护眼 · 语音遥控', NULL, 'REDMI', 2699, NULL, 'tv', '65-inch TV with narrow bezels on slim legs, showing streaming app interface', NULL, 0, 36200, 12),
       (2013, 'REDMI 智能电视 A Pro 55', '144Hz 高刷 · 双频 WiFi', NULL, 'REDMI', 1999, '热卖', 'tv', '55-inch smart TV front view with movie poster on screen', NULL, 0, 74500, 13),
       (2014, 'REDMI 智能电视 A 43', '全高清 · 入门大屏', NULL, 'REDMI', 1299, NULL, 'tv', '43-inch flat television on wall bracket showing colorful wallpaper', NULL, 0, 132000, 14),
       (2015, 'REDMI 智能电视 A 32', '高清液晶 · 小客厅适用', NULL, 'REDMI', 799, NULL, 'tv', 'compact 32-inch television on a shelf showing warm toned news channel', NULL, 0, 168000, 15),
       (2016, '小米电视 EA 65', '4K 全面屏 · 金属边框', NULL, 'Xiaomi', 2899, NULL, 'tv', '65-inch TV with metal frame and central stand showing abstract gradient', NULL, 0, 25800, 16),
       (2017, '小米电视 EA 55', '4K 全面屏 · 立体声音效', NULL, 'Xiaomi', 2199, NULL, 'tv', '55-inch television slight angle showing a bright nature scene', NULL, 0, 41600, 17),
       (2018, '小米电视 EA 75', '75 英寸 4K · 高屏占比', NULL, 'Xiaomi', 4299, NULL, 'tv', '75-inch large screen television mounted on white wall showing ocean scene', NULL, 0, 12800, 18),
       (2019, '小米壁画电视 65', '壁画设计 · 艺术画框模式', NULL, 'Xiaomi', 5999, '新品', 'tv', 'frame-style art television on brick wall displaying classical oil painting', NULL, 0, 5420, 19),
       (2020, '小米智能会议电视 75', '4K 触控 · 白板书写', NULL, 'Xiaomi', 12999, NULL, 'tv', 'interactive flat panel conference display with whiteboard UI and stylus', NULL, 0, 1830, 20),
       (2021, '小米电视 OLED 77', 'OLED 自发光 · 无限对比度', NULL, 'Xiaomi', 19999, '新品', 'tv', '77-inch OLED television ultra-thin profile showing high contrast space scene', NULL, 0, 2360, 21),
       (2022, '小米电视 OLED 65', 'OLED 4K · 杜比视界', NULL, 'Xiaomi', 12999, NULL, 'tv', '65-inch OLED TV on glass stand showing vivid rainbow abstract image', NULL, 0, 4870, 22),
       (2023, '小米激光电视 1S', '4K 激光 · 100 英寸巨幕', NULL, 'Xiaomi', 9999, NULL, 'tv', 'ultra short throw laser TV projector with 100-inch screen in dark home theatre room', NULL, 0, 3260, 23),
       (2024, '小米电视 SoundBar 音响', '杜比全景声 · 无线低音炮', NULL, 'Xiaomi', 1999, NULL, 'tv', 'black soundbar speaker with wireless subwoofer beside a television', NULL, 0, 9640, 24),
       (2025, '小米电视移动支架', '360 度万向 · 适配 55-85 英寸', NULL, 'Xiaomi', 799, NULL, 'tv', 'mobile TV stand with rolling base holding a large flat screen television', NULL, 0, 6230, 25),
       (2026, '小米电视投屏器', '一碰投屏 · 4K 60 帧', NULL, 'Xiaomi', 249, NULL, 'tv', 'small white HDMI dongle device projecting content onto a large TV screen', NULL, 0, 27400, 26),
       (2027, '小米电视隐私摄像头', '磁吸可拆 · 视频通话', NULL, 'Xiaomi', 399, NULL, 'tv', 'small detachable TV webcam with magnetic mount attached on TV top bezel', NULL, 0, 15200, 27),
       (2028, 'REDMI 智能电视 A 55', '4K 高清 · 高性价比', NULL, 'REDMI', 1699, NULL, 'tv', '55-inch flat screen TV on a low cabinet showing colorful children cartoon', NULL, 0, 96300, 28),
       (2029, '小米电视 X 2026 50', '4K 120Hz · HDMI 2.1', NULL, 'Xiaomi', 2099, NULL, 'tv', '50-inch smart television showing sports match, slight side angle', NULL, 0, 30500, 29),
       (2030, '小米电视 S Pro 55', 'Mini LED · 抗反射屏', NULL, 'Xiaomi', 3699, NULL, 'tv', '55-inch mini LED TV with anti-glare screen in bright living room', NULL, 0, 21700, 30);

-- ---------------- 笔记本 | 平板（3001 起） ----------------
INSERT IGNORE INTO product (id, name, subtitle, feature_subtitle, brand, price, tag, category_code, image_subject, poster_subject, is_feature, sales, list_order)
VALUES (3001, '小米笔记本 Pro 16', '3.1K 大师屏 · 酷睿 Ultra', '旗舰性能 · 专业创作', 'Xiaomi', 8999, '新品', 'laptop', 'premium thin aluminum laptop open at 100 degrees with blank bright screen, slight side angle', 'ultra-thin aluminum laptop half open with tablet and stylus beside it, soft gradient studio background with cool light', 1, 3240, 1),
       (3002, 'REDMI Book Pro 16 2025', '2.8K 高刷屏 · 大容量电池', NULL, 'REDMI', 5299, NULL, 'laptop', 'grey aluminum laptop open showing colorful abstract wallpaper on screen, three-quarter view', NULL, 0, 2130, 2),
       (3003, '小米平板 7S Pro', '3.2K 144Hz · 澎湃 OS', NULL, 'Xiaomi', 3299, '热卖', 'laptop', 'large tablet with slim bezels and stylus magnetically attached, standing with kickstand', NULL, 0, 18700, 3),
       (3004, '小米平板 7 Pro', '骁龙旗舰芯 · 生产力套装', NULL, 'Xiaomi', 2599, NULL, 'laptop', 'tablet showing colorful abstract wallpaper with detachable keyboard cover, angled view', NULL, 0, 12600, 4),
       (3005, 'REDMI Book 14 2025', '轻薄金属机身 · 长续航', NULL, 'REDMI', 3999, NULL, 'laptop', 'silver compact laptop open with bright screen, three-quarter front view', NULL, 0, 4320, 5),
       (3006, '小米游戏本 16 Ultra', '旗舰显卡 · 冰川散热', NULL, 'Xiaomi', 10999, NULL, 'laptop', 'gaming laptop with RGB backlit keyboard open, aggressive cooling vents design', NULL, 0, 980, 6),
       (3007, '小米显示器 27 英寸', '4K 专业色彩 · Type-C 90W', NULL, 'Xiaomi', 1999, NULL, 'laptop', '27-inch desktop monitor with thin bezels on minimalist stand showing colorful gradient screen', NULL, 0, 9640, 7),
       (3008, '小米无线键鼠套装', '静音按键 · 双模连接', NULL, 'Xiaomi', 199, NULL, 'laptop', 'slim wireless keyboard and matching mouse set in white, top-down angle', NULL, 0, 43200, 8),
       (3009, 'REDMI 平板 2 Pro', '2.5K 高刷 · 8 扬声器', NULL, 'REDMI', 1999, NULL, 'laptop', 'large tablet lying flat with stylus on top, showing split screen notes app', NULL, 0, 26800, 9),
       (3010, 'REDMI 平板 2', '11 英寸 2.5K · 学习娱乐', NULL, 'REDMI', 1299, '热卖', 'laptop', 'affordable tablet in space grey with rounded corners showing online class on screen', NULL, 0, 51200, 10),
       (3011, '小米平板 7', '11 英寸高刷屏 · 徕卡影像同步', NULL, 'Xiaomi', 2299, NULL, 'laptop', 'slim tablet in blue with magnetic keyboard case, angled view on desk', NULL, 0, 15400, 11),
       (3012, '小米笔记本 Air 13', '1.3kg 轻薄 · 全天候续航', NULL, 'Xiaomi', 5999, NULL, 'laptop', 'ultra-thin light laptop in silver partially closed on a marble table', NULL, 0, 6120, 12),
       (3013, 'REDMI Book 16 2025', '全高清大屏 · 酷睿平台', NULL, 'REDMI', 4299, NULL, 'laptop', '16-inch laptop in grey open on wooden desk with documents beside', NULL, 0, 5340, 13),
       (3014, '小米曲面显示器 34 英寸', '带鱼屏 · 144Hz 高刷', NULL, 'Xiaomi', 2599, NULL, 'laptop', 'curved ultrawide 34-inch monitor showing immersive racing game, rear cable management view', NULL, 0, 4210, 14),
       (3015, '小米无线鼠标 静音版', '人体工学 · 长续航', NULL, 'Xiaomi', 79, NULL, 'laptop', 'compact wireless mouse in white on a clean desk mat, top-down view', NULL, 0, 88400, 15),
       (3016, '小米 Type-C 扩展坞', '五合一 · 4K 输出', NULL, 'Xiaomi', 299, NULL, 'laptop', 'aluminum USB-C hub with multiple ports and short cable, studio shot', NULL, 0, 21600, 16);

-- ---------------- 智能穿戴（4001 起） ----------------
INSERT IGNORE INTO product (id, name, subtitle, feature_subtitle, brand, price, tag, category_code, image_subject, poster_subject, is_feature, sales, list_order)
VALUES (4001, '小米手表 S4', 'eSIM 独立通话 · 150+ 运动模式', 'eSIM 独立通话 · 血氧监测', 'Xiaomi', 999, '新品', 'wear', 'smartwatch with bright round AMOLED screen showing colorful watch face, silver case and orange sport band, angled view', 'smartwatch with bright round AMOLED display surrounded by floating glowing fitness rings graphics, dark teal gradient background', 1, 65400, 1),
       (4002, '小米手环 10 Pro', '大屏金属机身 · 21 天续航', NULL, 'Xiaomi', 499, NULL, 'wear', 'fitness band with large rectangular AMOLED screen and metal frame, black silicone strap', NULL, 0, 132000, 2),
       (4003, '小米手表 Color 3', '潮流外观 · 全天候监测', NULL, 'Xiaomi', 699, NULL, 'wear', 'colorful smartwatch with fabric strap and round dial showing pastel watch face', NULL, 0, 43800, 3),
       (4004, 'REDMI Buds 6 Pro', '55dB 主动降噪 · Hi-Res', NULL, 'REDMI', 499, NULL, 'wear', 'pair of white wireless earbuds beside an open charging case', NULL, 0, 96400, 4),
       (4005, '小米儿童手表 S3', '4G 视频 · 家长守护', NULL, 'Xiaomi', 799, NULL, 'wear', 'kids smartwatch in bright yellow with protective bumper and round screen', NULL, 0, 28600, 5),
       (4006, '小米 Buds 5 Pro', '旗舰降噪 · 空间音频', NULL, 'Xiaomi', 1299, '热卖', 'wear', 'black wireless in-ear earbuds with glossy touch panels beside charging case', NULL, 0, 51200, 6),
       (4007, '小米手环 10', '超大视野 AMOLED 屏', NULL, 'Xiaomi', 399, NULL, 'wear', 'slim fitness band with curved edge display and coral red strap', NULL, 0, 218000, 7),
       (4008, '小米开放式耳机 Pro', '不入耳佩戴 · 长续航', NULL, 'Xiaomi', 1999, NULL, 'wear', 'open-ear hook style wireless earphone in white, single unit angled view', NULL, 0, 17800, 8),
       (4009, '小米头戴耳机 降噪版', '40mm 动圈 · 无线降噪', NULL, 'Xiaomi', 799, NULL, 'wear', 'over-ear wireless headphones in matte black with soft ear cushions, side view', NULL, 0, 9420, 9),
       (4010, '小米手表 S4 Sport', '钛合金表体 · 专业运动模式', NULL, 'Xiaomi', 1499, NULL, 'wear', 'sport smartwatch in titanium with hexagonal dial and orange strap, angled view', NULL, 0, 8260, 10),
       (4011, '小米体脂秤 2', '双频测量 · 数据同步', NULL, 'Xiaomi', 149, NULL, 'wear', 'white glass body scale with small led display, top-down view', NULL, 0, 156000, 11),
       (4012, '小米血压计', '上臂式 · 语音播报', NULL, 'Xiaomi', 299, NULL, 'wear', 'home blood pressure monitor with arm cuff and digital display', NULL, 0, 32700, 12),
       (4013, 'REDMI Watch 5', '大屏通话 · 超长续航', NULL, 'REDMI', 599, NULL, 'wear', 'square smartwatch with large color screen and black strap, front angled view', NULL, 0, 74300, 13),
       (4014, '小米手环 9', '轻薄无感佩戴 · 睡眠监测', NULL, 'Xiaomi', 269, NULL, 'wear', 'slim fitness band with small display and lavender strap on reflective surface', NULL, 0, 264000, 14);

-- ---------------- 家电（5001 起） ----------------
INSERT IGNORE INTO product (id, name, subtitle, feature_subtitle, brand, price, tag, category_code, image_subject, poster_subject, is_feature, sales, list_order)
VALUES (5001, '米家空调 Pro 1.5 匹', '全屋互联 · 超一级能效', '新风增氧 · 超一级能效', '米家', 3299, NULL, 'appliance', 'white wall-mounted split air conditioner, front three-quarter view', 'white wall-mounted split air conditioner in a bright modern living room, soft daylight, minimal interior', 1, 41200, 1),
       (5002, '米家冰箱 610L', '风冷无霜 · 智能互联屏', NULL, '米家', 3999, NULL, 'appliance', 'large French-door refrigerator in brushed grey steel, front view', NULL, 0, 26400, 2),
       (5003, '米家滚筒洗衣机 1S', '10kg 大容量 · 除菌洗', NULL, '米家', 2299, NULL, 'appliance', 'white front-loading washing machine with round glass door and touch display', NULL, 0, 33800, 3),
       (5004, '米家空气净化器 5', '除醛除菌 · 全屋净化', NULL, '米家', 899, '热卖', 'appliance', 'minimalist white cylindrical air purifier with round air quality display', NULL, 0, 118000, 4),
       (5005, '米家净水器 1600G', '大通量 · 一秒一杯水', NULL, '米家', 2999, NULL, 'appliance', 'white water purifier unit with round digital display, front view', NULL, 0, 15600, 5),
       (5006, '米家扫地机器人 5 Pro', '激光导航 · 自动集尘', NULL, '米家', 2299, NULL, 'appliance', 'round white robot vacuum cleaner with LiDAR tower, three-quarter view', NULL, 0, 62400, 6),
       (5007, '米家除湿机', '静音除湿 · 40L/天', NULL, '米家', 1499, NULL, 'appliance', 'white portable dehumidifier with water tank and carry handle', NULL, 0, 9830, 7),
       (5008, '米家洗地机 4 Pro', '吸拖一体 · 热风烘干', NULL, '米家', 2499, '新品', 'appliance', 'upright wet-dry vacuum cleaner in white with charging dock, angled view', NULL, 0, 21700, 8),
       (5009, '米家空调 3 匹柜机', '客厅立式 · 快速冷暖', NULL, '米家', 6299, NULL, 'appliance', 'floor-standing cabinet air conditioner in white beside a sofa, front view', NULL, 0, 12400, 9),
       (5010, '米家对开门冰箱 540L', '风冷无霜 · 变频静音', NULL, '米家', 2799, NULL, 'appliance', 'side-by-side refrigerator in silver steel with long handles, front view', NULL, 0, 18300, 10),
       (5011, '米家波轮洗衣机 8kg', '一键强洗 · 桶自洁', NULL, '米家', 999, NULL, 'appliance', 'top-loading washing machine in white with glass lid, slight top angle', NULL, 0, 43600, 11),
       (5012, '米家电饭煲 Pro', 'IH 电磁加热 · 24 小时预约', NULL, '米家', 499, NULL, 'appliance', 'black rice cooker with round touch panel, front view on wooden table', NULL, 0, 87500, 12),
       (5013, '米家微波炉', '光波烧烤一体 · 20L', NULL, '米家', 399, NULL, 'appliance', 'white countertop microwave oven with digital display, front view', NULL, 0, 36200, 13),
       (5014, '米家油烟机', '22 立方米大风量 · 自动清洗', NULL, '米家', 1999, NULL, 'appliance', 'stainless steel kitchen range hood above cooktop, three-quarter view', NULL, 0, 7620, 14),
       (5015, '米家净水器 1200G', '双出水 · 长效滤芯', NULL, '米家', 1999, NULL, 'appliance', 'compact white water filter unit under-sink style with digital tap', NULL, 0, 11400, 15),
       (5016, '米家加湿器 Pro', '无雾上加水 · 4L 大水箱', NULL, '米家', 399, NULL, 'appliance', 'white cylindrical humidifier on bedside table with soft morning light', NULL, 0, 52800, 16),
       (5017, '米家电暖器', '快速升温 · 倾倒断电', NULL, '米家', 299, NULL, 'appliance', 'white oil-filled radiator heater with wheels, front view', NULL, 0, 61300, 17),
       (5018, '米家无线吸尘器 4', '大吸力 · 长续航', NULL, '米家', 1299, '热卖', 'appliance', 'cordless stick vacuum cleaner in grey with transparent dust bin, angled view', NULL, 0, 74200, 18);

-- ---------------- 智能家居（6001 起，主推位排在列表末尾以复刻原首页网格内容） ----------------
INSERT IGNORE INTO product (id, name, subtitle, feature_subtitle, brand, price, tag, category_code, image_subject, poster_subject, is_feature, sales, list_order)
VALUES (6001, '小米智能摄像头 5 Pro', '2.5K 云台 · AI 智能看家', NULL, 'Xiaomi', 349, '热卖', 'smarthome', 'white smart security camera with pan-tilt base and lens, three-quarter view', NULL, 0, 218000, 1),
       (6002, '小米智能门锁 E30', '指纹锁 · 可视猫眼', NULL, 'Xiaomi', 1299, NULL, 'smarthome', 'black smart door lock with keypad and fingerprint reader, front view', NULL, 0, 45200, 2),
       (6003, '小米路由器 BE7000', 'Wi-Fi 7 · 全屋覆盖', NULL, 'Xiaomi', 599, NULL, 'smarthome', 'black Wi-Fi router with minimalist vertical antenna design, three-quarter view', NULL, 0, 68400, 3),
       (6004, '小爱音箱 Pro', '智能中控 · 红外遥控', NULL, 'Xiaomi', 299, NULL, 'smarthome', 'smart speaker in dark grey fabric mesh with top control panel', NULL, 0, 156000, 4),
       (6005, '米家智能台灯 Pro', '国 AA 级照度 · 无蓝光危害', NULL, '米家', 199, NULL, 'smarthome', 'minimalist white LED desk lamp with slim adjustable arm', NULL, 0, 92700, 5),
       (6006, '米家智能网关 3', '全屋设备中枢 · Zigbee 3.0', NULL, '米家', 199, NULL, 'smarthome', 'small white round smart home hub device', NULL, 0, 38600, 6),
       (6007, '米家电水壶 2', '1.7L 大容量 · 双层防烫', NULL, '米家', 129, NULL, 'smarthome', 'white electric kettle with stainless steel interior', NULL, 0, 184000, 7),
       (6008, '米家体重秤 S400', '双频检测 · 数据同步', NULL, '米家', 199, NULL, 'smarthome', 'white glass bathroom scale with small round display', NULL, 0, 76300, 8),
       (6009, '小米智能门锁 M30 Pro', '全自动锁体 · 指纹密码解锁', '3D 结构光人脸识别 · 全自动锁体', 'Xiaomi', 2199, '新品', 'smarthome', 'premium smart door lock in black with face recognition module and keypad, front view', 'collection of smart home devices including smart speaker, security camera, door lock and router on a dark gradient background with soft orange glow', 1, 32600, 20),
       (6010, '小米路由器 AX3000T', 'Wi-Fi 6 · 3000M 双频', NULL, 'Xiaomi', 299, NULL, 'smarthome', 'white Wi-Fi router with four flat antennas, front view', NULL, 0, 124000, 10),
       (6011, '小米 Mesh 分布式路由', '子母路由 · 无缝漫游', NULL, 'Xiaomi', 899, NULL, 'smarthome', 'set of three white mesh router towers arranged on a shelf', NULL, 0, 32600, 11),
       (6012, '小米智能摄像头 云台版 2K', '全彩夜视 · 双向语音', NULL, 'Xiaomi', 199, NULL, 'smarthome', 'small white pan-tilt indoor security camera with black lens dome', NULL, 0, 268000, 12),
       (6013, '米家智能窗帘电机', '静音轨道 · APP 控制', NULL, '米家', 599, NULL, 'smarthome', 'compact white curtain motor device mounted on rail, close-up product shot', NULL, 0, 18400, 13),
       (6014, '米家智能插座 3', '电量统计 · 小爱语音', NULL, '米家', 49, NULL, 'smarthome', 'white smart plug adapter with three pin socket on plain background', NULL, 0, 386000, 14),
       (6015, '小米人体传感器 2', '光照感知 · 联动触发', NULL, 'Xiaomi', 59, NULL, 'smarthome', 'tiny white round motion sensor device with mounting bracket', NULL, 0, 162000, 15),
       (6016, '米家投影仪 家用版', '1080P · 自动对焦梯形校正', NULL, '米家', 2299, NULL, 'smarthome', 'compact white home projector with lens facing forward on wooden shelf', NULL, 0, 21600, 16),
       (6017, '小米智能门铃 3', '可视对讲 · 夜视广角', NULL, 'Xiaomi', 349, NULL, 'smarthome', 'white video doorbell with camera and button mounted on door frame', NULL, 0, 47300, 17);
