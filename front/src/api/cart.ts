import type { ApiResponse } from '../types/api'
import type { CartItemRequest, CartView } from '../types/cart'
import { PRODUCT_CART_URL } from '../utils/productConfig'

/**
 * 解包购物车响应：后端一律返回 { success, message?, data }，成功交出 data，
 * 失败（含 400 业务错误）抛出后端 message，供上层提示。非 JSON / 网络错误回退通用文案。
 */
async function unwrap<T>(res: Response): Promise<T> {
  let payload: ApiResponse<T> | null = null
  try {
    payload = (await res.json()) as ApiResponse<T>
  } catch {
    // 响应体不是 JSON（如网关错误页）
  }
  if (payload && payload.success === true) return payload.data as T
  throw new Error(payload?.message || `购物车接口返回错误：${res.status}`)
}

/** 购物车写操作入参：sessionId + skuId（quantity 可缺省，删除 / 清空时不需要） */
type CartAction = Omit<CartItemRequest, 'quantity'>

/** GET /api/cart?sessionId= —— 拉取购物车视图 { items, count, totalAmount } */
export async function fetchCart(sessionId: string, signal?: AbortSignal): Promise<CartView> {
  const params = new URLSearchParams({ sessionId })
  const res = await fetch(`${PRODUCT_CART_URL}?${params.toString()}`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  return unwrap<CartView>(res)
}

/** POST /api/cart/items —— 加入购物车（命中同 SKU 累加），返回最新视图 */
export async function addToCart({ sessionId, skuId, quantity }: CartItemRequest, signal?: AbortSignal): Promise<CartView> {
  const res = await fetch(`${PRODUCT_CART_URL}/items`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ sessionId, skuId, quantity }),
  })
  return unwrap<CartView>(res)
}

/** PUT /api/cart/items —— 设为指定数量（<1 删除），返回最新视图 */
export async function updateCartItem({ sessionId, skuId, quantity }: CartItemRequest, signal?: AbortSignal): Promise<CartView> {
  const res = await fetch(`${PRODUCT_CART_URL}/items`, {
    method: 'PUT',
    signal,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ sessionId, skuId, quantity }),
  })
  return unwrap<CartView>(res)
}

/** DELETE /api/cart/items?sessionId=&skuId= —— 删除单个条目，返回最新视图 */
export async function removeCartItem({ sessionId, skuId }: CartAction, signal?: AbortSignal): Promise<CartView> {
  const params = new URLSearchParams({ sessionId, skuId: String(skuId) })
  const res = await fetch(`${PRODUCT_CART_URL}/items?${params.toString()}`, {
    method: 'DELETE',
    signal,
    headers: { Accept: 'application/json' },
  })
  return unwrap<CartView>(res)
}

/** DELETE /api/cart?sessionId= —— 清空购物车，返回最新视图 */
export async function clearCart(sessionId: string, signal?: AbortSignal): Promise<CartView> {
  const params = new URLSearchParams({ sessionId })
  const res = await fetch(`${PRODUCT_CART_URL}?${params.toString()}`, {
    method: 'DELETE',
    signal,
    headers: { Accept: 'application/json' },
  })
  return unwrap<CartView>(res)
}
