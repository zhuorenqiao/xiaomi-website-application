import { DEFAULT_PAGE_SIZE, PRODUCT_SEARCH_URL, PRODUCT_SECTIONS_URL } from '../utils/productConfig.js'

/**
 * 统一请求 + 解包：后端商品接口一律返回 { success, message?, data }，
 * 本函数负责校验 HTTP 状态与业务 success，只向上层交出 data。
 * @param {string} url 完整请求地址（含查询串）
 * @param {AbortSignal} [signal] 可选的中止信号
 * @returns {Promise<any>} payload.data
 */
async function getData(url, signal) {
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`商品接口返回错误：${res.status}`)
  }
  const payload = await res.json()
  // 统一外层：success 非 true 视为业务失败，抛出后端 message
  if (!payload || payload.success !== true) {
    throw new Error(payload?.message || '商品接口返回失败')
  }
  // 只把包装后的 data 交给上层（hook / 组件不感知外层）
  return payload.data
}

/**
 * 拉取首页商品栏目列表（数据来自商品微服务的 MySQL 商品库）。
 * @param {AbortSignal} [signal] 可选的中止信号，用于组件卸载 / 重新加载时取消请求
 * @returns {Promise<Array>} 商品栏目数组
 */
export function fetchProductSections(signal) {
  return getData(PRODUCT_SECTIONS_URL, signal)
}

/**
 * 搜索商品列表（关键词 + 分类筛选 + 排序 + 分页）。
 * @param {{keyword?: string, category?: string, sort?: string, page?: number, size?: number}} query 查询条件
 * @param {AbortSignal} [signal] 可选的中止信号
 * @returns {Promise<{keyword: string, category: string, sort: string, page: number, size: number,
 *   total: number, totalPages: number, hasPrev: boolean, hasNext: boolean,
 *   items: Array, categories: Array}>} 分页结果
 */
export function searchProducts(query = {}, signal) {
  const { keyword = '', category = '', sort = 'default', page = 1, size = DEFAULT_PAGE_SIZE } = query
  const params = new URLSearchParams()
  if (keyword) params.set('keyword', keyword)
  if (category) params.set('category', category)
  // default 是后端默认值，不写进 URL，保持地址简洁
  if (sort && sort !== 'default') params.set('sort', sort)
  params.set('page', String(page))
  params.set('size', String(size))
  return getData(`${PRODUCT_SEARCH_URL}?${params.toString()}`, signal)
}
