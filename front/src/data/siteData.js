const IMG_ENDPOINT = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'

const img = (prompt, size = 'square') =>
  `${IMG_ENDPOINT}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`

/** 商品白底图 */
const prod = (subject) =>
  img(
    `E-commerce studio product photo: ${subject}. Pure white background, centered composition, soft natural shadow, clean catalog photography, photorealistic, 8k`,
    'square',
  )

/** 栏目左侧竖版大图 */
const feature = (subject) =>
  img(
    `Vertical premium advertising poster: ${subject}. Large empty dark space at the bottom for text overlay, premium commercial photography, photorealistic, cinematic lighting, 8k`,
    'portrait_16_9',
  )

/* ---------- 顶部黑色工具条 ---------- */
export const topBarLeft = [
  '小米官网',
  '小米商城',
  '小米澎湃OS',
  '小米汽车',
  '云服务',
  'IoT',
  '有品',
  '小爱开放平台',
]

export const topBarRight = [
  '登录',
  '注册',
  '消息通知',
  '购物车',
  'Select Location',
  '下载 app',
  '协议规则',
  '资质证照',
]

/* ---------- 主导航 ---------- */
export const navLinks = [
  { label: 'Xiaomi手机', href: '#phone' },
  { label: 'REDMI手机', href: '#phone' },
  { label: '电视', href: '#appliance' },
  { label: '笔记本', href: '#laptop' },
  { label: '平板', href: '#laptop' },
  { label: '家电', href: '#appliance' },
  { label: '路由器', href: '#smarthome' },
  { label: '服务中心', href: '#service' },
  { label: '社区', href: '#top' },
]

export const searchPlaceholder = '电池'

/* ---------- 轮播 Banner ---------- */
export const slides = [
  {
    id: 'su7',
    eyebrow: '新品上市',
    title: '小米 SU7 Ultra',
    subtitle: '地表最快四门量产车 · 1.98s 破百',
    price: '52.99 万元起',
    cta: '立即预约',
    image: img(
      'Premium automotive advertising banner: sleek high-performance electric sedan in metallic deep blue, dynamic three-quarter front view on wet asphalt at night, dramatic neon light trails, dark moody background, wide composition with empty dark space on the left, photorealistic, cinematic, 8k',
      'landscape_16_9',
    ),
  },
  {
    id: 'phone15',
    eyebrow: '旗舰影像',
    title: 'Xiaomi 15 Ultra',
    subtitle: '徕卡光学全焦段四摄',
    price: '6499 元起',
    cta: '立即购买',
    image: img(
      'Premium smartphone advertising banner: flagship smartphone with large circular camera module and two-tone leather body floating at an angle, warm rim lighting, deep black background with subtle orange glow, wide composition with empty dark space on the left, photorealistic product photography, 8k',
      'landscape_16_9',
    ),
  },
  {
    id: 'ecosystem',
    eyebrow: '人车家全生态',
    title: '小米澎湃 OS 3',
    subtitle: '万物互联，一句话掌控全场',
    price: '',
    cta: '了解更多',
    image: img(
      'Futuristic smart home banner at dusk: modern living room with large TV, robot vacuum, air purifier and smart speaker, warm ambient lighting, minimal interior, wide composition with empty dark space on the left, photorealistic, cinematic, 8k',
      'landscape_16_9',
    ),
  },
]

/* ---------- 首屏左侧分类菜单（悬停展开） ---------- */
export const categoryMenu = [
  { label: '手机', children: ['Xiaomi 15 Ultra', 'Xiaomi 15 Pro', 'Xiaomi 15', 'REDMI K80 Pro', 'REDMI Turbo 4 Pro', 'Xiaomi Civi 5 Pro', 'REDMI Note 15 Pro+', '手机配件', '以旧换新'] },
  { label: '电视', children: ['Mini LED 电视', 'OLED 电视', '游戏电视', 'REDMI 智能电视', '巨幕影院', '电视配件'] },
  { label: '家电', children: ['空调', '冰箱', '洗衣机', '电视', '空气净化器', '净水器', '扫地机器人', '油烟机'] },
  { label: '笔记本 平板 显示器', children: ['小米笔记本 Pro', 'REDMI Book Pro', '游戏本', '小米平板 7S Pro', 'REDMI 平板', '显示器', '键盘', '鼠标'] },
  { label: '出行 穿戴', children: ['小米 SU7 Ultra', '小米 YU7', '小米手表 S4', '小米手环 10 Pro', '电动滑板车', '骑行装备'] },
  { label: '耳机 音箱', children: ['小米 Buds 5 Pro', 'REDMI Buds 6 Pro', '头戴耳机', '小米音箱 Pro', 'Sound 系列', '耳机配件'] },
  { label: '健康 儿童', children: ['儿童手表', '体重秤', '体脂秤', '血压计', '电动牙刷', '冲牙器'] },
  { label: '生活 箱包', children: ['双肩包', '旅行箱', '腰包', '收纳好物', '雨伞', '水杯'] },
  { label: '智能 路由器', children: ['路由器 BE7000', 'Mesh 组网', '智能摄像头', '智能门锁', '智能网关', '传感器'] },
  { label: '电源 配件', children: ['充电宝', '充电器', '数据线', '无线充电', '插线板', '手机壳膜'] },
]

/* ---------- 首屏下方通栏 Banner ---------- */
export const promoBanner = {
  title: '小米澎湃 OS 3 · 人车家全生态',
  desc: '跨端互联 智享生活，全场新品热门抢先购',
  cta: '立即了解',
  image: img(
    'Wide horizontal advertising banner: modern smart device lineup including smartphone, smartwatch, TV and electric car silhouette on a soft light grey gradient with warm orange accent glow, large empty space on the left, clean commercial advertising photography, photorealistic, 8k',
    'landscape_16_9',
  ),
}

/* ---------- 产品栏目（左大图 + 右 4×2 卡片） ---------- */
export const sections = [
  {
    id: 'phone',
    title: '手机',
    feature: {
      name: 'Xiaomi 15 Ultra',
      desc: '徕卡光学 · 一英寸主摄',
      price: '6499 元起',
      cta: '了解更多',
      image: feature(
        'flagship smartphone with huge circular quad camera module floating above a reflective surface, deep blue-black gradient background with orange rim light',
      ),
    },
    products: [
      { name: 'Xiaomi 15 Ultra', desc: '徕卡四摄 · 2K 全等深微曲屏', price: '6499 元', tag: '新品', image: prod('flagship smartphone with huge circular quad camera module, two-tone titanium and black leather back, front and back angled view') },
      { name: 'REDMI K80 Pro', desc: '骁龙 8 至尊版 · 2K 直屏', price: '3699 元', tag: '热卖', image: prod('gaming smartphone with glossy blue gradient back and triple camera strip, angled back view') },
      { name: 'Xiaomi 15', desc: '徕卡光学 Summilux 镜头', price: '4499 元', image: prod('compact flagship smartphone in pastel lavender with square triple camera module, angled back view') },
      { name: 'REDMI Turbo 4 Pro', desc: '天玑旗舰芯 · 1.5K 护眼屏', price: '1999 元', image: prod('slim smartphone in frosted mint green with dual camera rings, angled back view') },
      { name: 'Xiaomi Civi 5 Pro', desc: '轻薄人像 · 6.55 英寸好屏', price: '2999 元', image: prod('ultra-thin fashion smartphone in peach pink with small round camera module, angled back view') },
      { name: 'REDMI Note 15 Pro+', desc: '1.5K 直屏 · 6200mAh 大电量', price: '1499 元', image: prod('mid-range smartphone in graphite black with large circular camera module, angled back view') },
      { name: 'Xiaomi 15 Pro', desc: '徕卡三摄 · 骁龙 8 至尊版', price: '5299 元', tag: '热卖', image: prod('flagship smartphone in ceramic white with square quad camera, angled front view showing curved display with colorful wallpaper') },
      { name: 'REDMI K80', desc: '2K 护眼屏 · 6550mAh', price: '2499 元', image: prod('smartphone in dark grey matte finish with vertical camera lenses, angled back view') },
    ],
  },
  {
    id: 'wear',
    title: '智能穿戴',
    feature: {
      name: '小米手表 S4',
      desc: 'eSIM 独立通话 · 血氧监测',
      price: '999 元起',
      cta: '了解更多',
      image: feature(
        'smartwatch with bright round AMOLED display surrounded by floating glowing fitness rings graphics, dark teal gradient background',
      ),
    },
    products: [
      { name: '小米手表 S4', desc: 'eSIM 独立通话 · 150+ 运动模式', price: '999 元', tag: '新品', image: prod('smartwatch with bright round AMOLED screen showing colorful watch face, silver case and orange sport band, angled view') },
      { name: '小米手环 10 Pro', desc: '大屏金属机身 · 21 天续航', price: '499 元', image: prod('fitness band with large rectangular AMOLED screen and metal frame, black silicone strap') },
      { name: '小米手表 Color 3', desc: '潮流外观 · 全天候监测', price: '699 元', image: prod('colorful smartwatch with fabric strap and round dial showing pastel watch face') },
      { name: 'REDMI Buds 6 Pro', desc: '55dB 主动降噪 · Hi-Res', price: '499 元', image: prod('pair of white wireless earbuds beside an open charging case') },
      { name: '小米儿童手表 S3', desc: '4G 视频 · 家长守护', price: '799 元', image: prod('kids smartwatch in bright yellow with protective bumper and round screen') },
      { name: '小米 Buds 5 Pro', desc: '旗舰降噪 · 空间音频', price: '1299 元', tag: '热卖', image: prod('black wireless in-ear earbuds with glossy touch panels beside charging case') },
      { name: '小米手环 10', desc: '超大视野 AMOLED 屏', price: '399 元', image: prod('slim fitness band with curved edge display and coral red strap') },
      { name: '小米开放式耳机 Pro', desc: '不入耳佩戴 · 长续航', price: '1999 元', image: prod('open-ear hook style wireless earphone in white, single unit angled view') },
    ],
  },
  {
    id: 'laptop',
    title: '笔记本 | 平板',
    feature: {
      name: '小米笔记本 Pro 16',
      desc: '旗舰性能 · 专业创作',
      price: '8999 元起',
      cta: '了解更多',
      image: feature(
        'ultra-thin aluminum laptop half open with tablet and stylus beside it, soft gradient studio background with cool light',
      ),
    },
    products: [
      { name: '小米笔记本 Pro 16', desc: '3.1K 大师屏 · 酷睿 Ultra', price: '8999 元', tag: '新品', image: prod('premium thin aluminum laptop open at 100 degrees with blank bright screen, slight side angle') },
      { name: 'REDMI Book Pro 16 2025', desc: '2.8K 高刷屏 · 大容量电池', price: '5299 元', image: prod('grey aluminum laptop open showing colorful abstract wallpaper on screen, three-quarter view') },
      { name: '小米平板 7S Pro', desc: '3.2K 144Hz · 澎湃 OS', price: '3299 元', tag: '热卖', image: prod('large tablet with slim bezels and stylus magnetically attached, standing with kickstand') },
      { name: '小米平板 7 Pro', desc: '骁龙旗舰芯 · 生产力套装', price: '2599 元', image: prod('tablet showing colorful abstract wallpaper with detachable keyboard cover, angled view') },
      { name: 'REDMI Book 14 2025', desc: '轻薄金属机身 · 长续航', price: '3999 元', image: prod('silver compact laptop open with bright screen, three-quarter front view') },
      { name: '小米游戏本 16 Ultra', desc: '旗舰显卡 · 冰川散热', price: '10999 元', image: prod('gaming laptop with RGB backlit keyboard open, aggressive cooling vents design') },
      { name: '小米显示器 27 英寸', desc: '4K 专业色彩 · Type-C 90W', price: '1999 元', image: prod('27-inch desktop monitor with thin bezels on minimalist stand showing colorful gradient screen') },
      { name: '小米无线键鼠套装', desc: '静音按键 · 双模连接', price: '199 元', image: prod('slim wireless keyboard and matching mouse set in white, top-down angle') },
    ],
  },
  {
    id: 'appliance',
    title: '家电',
    feature: {
      name: '小米电视 S Pro 85',
      desc: 'Mini LED 千级分区 · 高刷旗舰',
      price: '9999 元起',
      cta: '了解更多',
      image: feature(
        'ultra-thin 85-inch smart TV glowing in an elegant dark living room at dusk with city lights outside the window',
      ),
    },
    products: [
      { name: '小米电视 S Pro 65', desc: 'Mini LED · 144Hz 高刷', price: '4299 元', tag: '直降', image: prod('ultra-thin bezel-less 4K smart TV showing vivid colorful gradient, slight angle') },
      { name: '米家空调 Pro 1.5 匹', desc: '全屋互联 · 超一级能效', price: '3299 元', image: prod('white wall-mounted split air conditioner, front three-quarter view') },
      { name: '米家冰箱 610L', desc: '风冷无霜 · 智能互联屏', price: '3999 元', image: prod('large French-door refrigerator in brushed grey steel, front view') },
      { name: '米家滚筒洗衣机 1S', desc: '10kg 大容量 · 除菌洗', price: '2299 元', image: prod('white front-loading washing machine with round glass door and touch display') },
      { name: '米家空气净化器 5', desc: '除醛除菌 · 全屋净化', price: '899 元', tag: '热卖', image: prod('minimalist white cylindrical air purifier with round air quality display') },
      { name: '米家净水器 1600G', desc: '大通量 · 一秒一杯水', price: '2999 元', image: prod('white water purifier unit with round digital display, front view') },
      { name: '米家扫地机器人 5 Pro', desc: '激光导航 · 自动集尘', price: '2299 元', image: prod('round white robot vacuum cleaner with LiDAR tower, three-quarter view') },
      { name: '米家除湿机', desc: '静音除湿 · 40L/天', price: '1499 元', image: prod('white portable dehumidifier with water tank and carry handle') },
    ],
  },
  {
    id: 'smarthome',
    title: '智能家居',
    feature: {
      name: '小米智能门锁 M30 Pro',
      desc: '3D 结构光人脸识别 · 全自动锁体',
      price: '2199 元起',
      cta: '了解更多',
      image: feature(
        'collection of smart home devices including smart speaker, security camera, door lock and router on a dark gradient background with soft orange glow',
      ),
    },
    products: [
      { name: '小米智能摄像头 5 Pro', desc: '2.5K 云台 · AI 智能看家', price: '349 元', tag: '热卖', image: prod('white smart security camera with pan-tilt base and lens, three-quarter view') },
      { name: '小米智能门锁 E30', desc: '指纹锁 · 可视猫眼', price: '1299 元', image: prod('black smart door lock with keypad and fingerprint reader, front view') },
      { name: '小米路由器 BE7000', desc: 'Wi-Fi 7 · 全屋覆盖', price: '599 元', image: prod('black Wi-Fi router with minimalist vertical antenna design, three-quarter view') },
      { name: '小爱音箱 Pro', desc: '智能中控 · 红外遥控', price: '299 元', image: prod('smart speaker in dark grey fabric mesh with top control panel') },
      { name: '米家智能台灯 Pro', desc: '国AA级照度 · 无蓝光危害', price: '199 元', image: prod('minimalist white LED desk lamp with slim adjustable arm') },
      { name: '米家智能网关 3', desc: '全屋设备中枢 · Zigbee 3.0', price: '199 元', image: prod('small white round smart home hub device') },
      { name: '米家电水壶 2', desc: '1.7L 大容量 · 双层防烫', price: '129 元', image: prod('white electric kettle with stainless steel interior') },
      { name: '米家体重秤 S400', desc: '双频检测 · 数据同步', price: '199 元', image: prod('white glass bathroom scale with small round display') },
    ],
  },
]

/* ---------- 页脚 ---------- */
export const serviceItems = [
  { icon: 'wrench', text: '预约维修服务' },
  { icon: 'return', text: '7 天无理由退货' },
  { icon: 'swap', text: '15 天免费换货' },
  { icon: 'truck', text: '满 69 元包邮' },
  { icon: 'pin', text: '1100 余家售后网点' },
]

export const footerColumns = [
  { title: '选购指南', links: ['小米手机', 'REDMI 手机', '电视', '笔记本', '平板', '家电', '路由器', '智能硬件'] },
  { title: '服务中心', links: ['申请售后', '售后政策', '维修服务价格', '服务网点', '预约服务', '自助服务'] },
  { title: '线下门店', links: ['小米之家', '服务网点', '零售网点', '小米直供点', '小米专营店', '小米体验店'] },
  { title: '关于小米', links: ['了解小米', '加入小米', '投资者关系', '企业社会责任', '联系我们'] },
  { title: '关注我们', links: ['新浪微博', '官方微信', '小米抖音', '小米 B 站', '小米贴吧'] },
]

export const hotline = {
  phone: '950816',
  hours: '8:00 - 18:00（仅收市话费）',
  sub: '950818 家庭用户服务专线',
  buttons: ['人工客服', '在线客服'],
}

export const icpLinks = [
  '京ICP证110507号',
  '京ICP备10046444号',
  '京公网安备11010802020134号',
  '京网文[2026]0015-006号',
  '（京）网械平台备字（2018）第00005号',
]
