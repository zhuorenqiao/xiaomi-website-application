import type { ApiResponse } from '../types/api'
import type { ProductDetail, ProductQuery, ProductSearchResult, ProductSection } from '../types/product'
import { DEFAULT_PAGE_SIZE, PRODUCT_DETAIL_URL, PRODUCT_SEARCH_URL, PRODUCT_SECTIONS_URL } from '../utils/productConfig'

/**
 * 统一请求 + 解包：后端商品接口一律返回 { success, message?, data }，
 * 本函数负责校验 HTTP 状态与业务 success，只向上层交出 data。
 * @param url 完整请求地址（含查询串）
 * @param signal 可选的中止信号
 * @returns payload.data
 */
async function getData<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`商品接口返回错误：${res.status}`)
  }
  const payload = (await res.json()) as ApiResponse<T> | null
  // 统一外层：success 非 true 视为业务失败，抛出后端 message
  if (!payload || payload.success !== true) {
    throw new Error(payload?.message || '商品接口返回失败')
  }
  // 只把包装后的 data 交给上层（hook / 组件不感知外层）
  return payload.data as T
}

/**
 * 拉取首页商品栏目列表（数据来自商品微服务的 MySQL 商品库）。
 * @param signal 可选的中止信号，用于组件卸载 / 重新加载时取消请求
 */
export function fetchProductSections(signal?: AbortSignal): Promise<ProductSection[]> {
  return getData<ProductSection[]>(PRODUCT_SECTIONS_URL, signal)
}

/**
 * 搜索商品列表（关键词 + 分类筛选 + 排序 + 分页）。
 * @param query 查询条件
 * @param signal 可选的中止信号
 * @returns 分页结果
 */
export function searchProducts(query: ProductQuery = {}, signal?: AbortSignal): Promise<ProductSearchResult> {
  const { keyword = '', category = '', sort = 'default', page = 1, size = DEFAULT_PAGE_SIZE } = query
  const params = new URLSearchParams()
  if (keyword) params.set('keyword', keyword)
  if (category) params.set('category', category)
  // default 是后端默认值，不写进 URL，保持地址简洁
  if (sort && sort !== 'default') params.set('sort', sort)
  params.set('page', String(page))
  params.set('size', String(size))
  return getData<ProductSearchResult>(`${PRODUCT_SEARCH_URL}?${params.toString()}`, signal)
}

/**
 * 获取商品详情（画廊 / 卖点 / 规格参数 / 同类推荐）。
 * @param id 商品主键（来自列表项 item.id）
 * @param signal 可选的中止信号
 */
export function fetchProductDetail(id: number | string, signal?: AbortSignal): Promise<ProductDetail> {
  const params = new URLSearchParams()
  params.set('id', String(id))
  return getData<ProductDetail>(`${PRODUCT_DETAIL_URL}?${params.toString()}`, signal)
}
