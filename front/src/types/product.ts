/**
 * 商品微服务（back/xiaomi-product-service）的接口数据结构。
 * 字段与 xiaomi-product-api 的 Java record 一一对应；标注可选的字段在后端可为 NULL
 * （见 resources/db/schema.sql 中允许 DEFAULT NULL 的列）。
 */

/** 首页栏目主推位（分类下 is_feature = 1 的商品） */
export interface ProductFeature {
  id: number
  name: string
  desc: string
  price: string
  cta: string
  image: string
}

/** 首页栏目网格里的商品卡片 */
export interface ProductItem {
  id: number
  name: string
  desc: string
  price: string
  /** 角标文案（新品 / 热卖 / 直降），无角标时为空 */
  tag?: string
  image: string
}

/** 首页商品栏目：id 即分类编码，可直接作为 /search?category= 的取值 */
export interface ProductSection {
  id: string
  title: string
  feature: ProductFeature
  products: ProductItem[]
}

/** 排序编码，与后端 ProductSort 白名单一致 */
export type ProductSortValue = 'default' | 'sales' | 'price_asc' | 'price_desc'

/** 商品搜索条件（关键词 + 分类 + 排序 + 分页） */
export interface ProductQuery {
  keyword?: string
  category?: string
  sort?: ProductSortValue
  page?: number
  size?: number
}

/** 分类筛选项 */
export interface SearchFacet {
  code: string
  name: string
  count: number
}

/** 列表页 / 详情页推荐位的商品 */
export interface SearchProductItem {
  id: number
  name: string
  desc: string
  price: string
  tag?: string
  image: string
  brand?: string
  sales?: number
  category?: string
}

/** 搜索分页结果（回显查询条件 + 数据 + 分类聚合） */
export interface ProductSearchResult {
  keyword: string
  category: string
  sort: ProductSortValue
  page: number
  size: number
  total: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
  items: SearchProductItem[]
  categories: SearchFacet[]
}

/** 规格参数表的一行 */
export interface ProductSpec {
  label: string
  value: string
}

/** 可购 SKU：版本 + 颜色两级选择的最小单位，价格随 SKU 浮动 */
export interface ProductSku {
  id: number
  version: string
  color: string
  colorHex: string
  price: number
  /** 库存，0 表示无货 */
  stock: number
  image: string
}

/** 商品详情聚合（画廊 / 卖点 / 规格参数 / SKU / 同类推荐） */
export interface ProductDetail {
  id: number
  name: string
  subtitle?: string
  brand?: string
  price: string
  tag?: string
  category?: string
  categoryName?: string
  sales?: number
  gallery: string[]
  highlights: string[]
  /** 概述页横幅大图，未配置主推海报时为空 */
  poster?: string
  specs: ProductSpec[]
  skus: ProductSku[]
  related: SearchProductItem[]
}
