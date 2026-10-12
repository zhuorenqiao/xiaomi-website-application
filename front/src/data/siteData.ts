/**
 * 站点静态文案数据（导航、轮播、分类菜单、页脚）。
 * 商品栏目数据已迁移到后端商品微服务，见 types/product.ts 与 api/products.ts。
 */

/** 页脚服务图标 key，与 components/Icons.tsx 的导出一一对应 */
export type ServiceIconKey = 'wrench' | 'return' | 'swap' | 'truck' | 'pin'

const IMG_ENDPOINT = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'

const img = (prompt: string, size = 'square') =>
  `${IMG_ENDPOINT}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`

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
  { label: '电视', href: '#tv' },
  { label: '笔记本', href: '#laptop' },
  { label: '平板', href: '#laptop' },
  { label: '家电', href: '#appliance' },
  { label: '路由器', href: '#smarthome' },
  { label: '服务中心', href: '#service' },
  { label: '社区', href: '#top' },
]

export const searchPlaceholder = '电视'

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

/* ---------- 产品栏目（商品列表）已迁移至后端商品微服务 xiaomi-product-service（MySQL 商品库）：
   首页栏目 GET /api/products/sections（useProducts.ts）
   商品搜索 GET /api/products/search（useProductSearch.ts，见 SearchPage.tsx） ---------- */

/* ---------- 页脚 ---------- */
export const serviceItems: { icon: ServiceIconKey; text: string }[] = [
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
