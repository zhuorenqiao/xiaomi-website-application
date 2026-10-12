/**
 * 后端接口的通用协议与前端加载态。
 * 商品 / 购物车接口一律返回 { success, message?, data }，由 api 层解包后只向上层交出 data。
 */

/** 统一响应外层 */
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

/** 数据类 Hook 的加载状态机 */
export type LoadStatus = 'loading' | 'ready' | 'error'
