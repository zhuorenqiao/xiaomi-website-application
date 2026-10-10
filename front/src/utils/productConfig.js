/**
 * 商品服务配置。
 * 与聊天接口一致：地址可通过 .env.local 的 VITE_PRODUCT_API_BASE 覆盖（本地联调用），
 * 兜底值指向本地后端 back/xiaomi-product-service（application.yml 端口 8861）。
 *
 * 注意：这里配置的是「接口基址」，具体接口由基址拼接：
 *   首页栏目  GET {base}/sections
 *   商品搜索  GET {base}/search?keyword=&category=&sort=&page=&size=
 *   商品详情  GET {base}/detail?id=
 *   购物车    {host}/api/cart（基址里的 /products 换成 /cart）
 */
const API_BASE = import.meta.env?.VITE_PRODUCT_API_BASE || 'http://localhost:8861/api/products'

export const PRODUCT_SECTIONS_URL = `${API_BASE}/sections`
export const PRODUCT_SEARCH_URL = `${API_BASE}/search`
export const PRODUCT_DETAIL_URL = `${API_BASE}/detail`
// 购物车与商品同服务不同路径：把基址尾部的 /products 换成 /cart
export const PRODUCT_CART_URL = API_BASE.replace(/\/products\/?$/, '/cart')

/** 分页默认值，与后端 ProductQuery 的默认值保持一致 */
export const DEFAULT_PAGE_SIZE = 20
/** 每页条数可选项，上限 60 与后端 MAX_PAGE_SIZE 对齐 */
export const PAGE_SIZE_OPTIONS = [20, 40, 60]
