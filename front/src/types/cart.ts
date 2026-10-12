/**
 * 购物车接口（GET/POST/PUT/DELETE /api/cart）的数据结构。
 * 后端以游客会话 id 归组，每次写操作都返回最新的全量视图。
 */

/** 购物车条目：下单时的 SKU 快照，不随商品改价回写 */
export interface CartItem {
  id: number
  productId: number
  skuId: number
  name: string
  version: string
  color: string
  /** 色值快照，历史数据可能为空 */
  colorHex?: string
  price: number
  quantity: number
  image: string
}

/** 购物车视图 */
export interface CartView {
  items: CartItem[]
  count: number
  totalAmount: number
}

/** 加购 / 改数量请求体（quantity < 1 时后端按删除处理） */
export interface CartItemRequest {
  sessionId: string
  skuId: number
  quantity: number
}
