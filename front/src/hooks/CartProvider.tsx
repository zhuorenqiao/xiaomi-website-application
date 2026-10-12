import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { addToCart, clearCart, fetchCart, removeCartItem, updateCartItem } from '../api/cart'
import type { LoadStatus } from '../types/api'
import type { CartItem, CartView } from '../types/cart'
import { isAbortError, toError } from '../utils/error'
import { getCartSessionId } from '../utils/cartStorage'

/** CartProvider 注入 context 的购物车状态与动作 */
export interface CartContextValue {
  sessionId: string
  items: CartItem[]
  count: number
  totalAmount: number
  status: LoadStatus
  error: Error | null
  /** 写操作（加购 / 改数量 / 删除 / 清空）进行中标记 */
  pending: boolean
  reload: () => Promise<void>
  addItem: (skuId: number, quantity?: number) => Promise<CartView>
  setQuantity: (skuId: number, quantity: number) => Promise<CartView>
  removeItem: (skuId: number) => Promise<CartView>
  clear: () => Promise<CartView>
}

export const CartContext = createContext<CartContextValue | null>(null)

/** 组件内持有的购物车状态 */
type CartState = Pick<CartView, 'items' | 'count' | 'totalAmount'>

/** 把后端 CartView 归一成组件内状态（items 保证为数组，金额转数字） */
function toState(view?: CartView | null): CartState {
  return {
    items: view?.items ?? [],
    count: Number(view?.count) || 0,
    totalAmount: Number(view?.totalAmount) || 0,
  }
}

/**
 * 购物车全局状态：以游客会话 id 归组，后端为准，写操作后用返回的最新视图刷新本地状态。
 * 必须在 App 顶层包裹，供导航栏角标、详情页加购、购物车页共享同一份数据。
 */
export default function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(() => getCartSessionId())
  const [cart, setCart] = useState<CartState>({ items: [], count: 0, totalAmount: 0 })
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<Error | null>(null)
  const [pending, setPending] = useState(false)
  const loadRef = useRef<AbortController | null>(null)

  const reload = useCallback(async () => {
    loadRef.current?.abort()
    const controller = new AbortController()
    loadRef.current = controller
    setStatus('loading')
    setError(null)
    try {
      const view = await fetchCart(sessionId, controller.signal)
      if (controller.signal.aborted) return
      setCart(toState(view))
      setStatus('ready')
    } catch (err) {
      if (isAbortError(err) || controller.signal.aborted) return
      setError(toError(err))
      setStatus('error')
    }
  }, [sessionId])

  // 挂载即拉取一次（StrictMode 双挂载由 abort 兜底）
  useEffect(() => {
    reload()
    return () => loadRef.current?.abort()
  }, [reload])

  // 写操作统一封装：置 pending → 调接口 → 用返回视图刷新 → 出错上抛供调用方提示
  const mutate = useCallback(async (fn: () => Promise<CartView>) => {
    setPending(true)
    try {
      const view = await fn()
      setCart(toState(view))
      setStatus('ready')
      setError(null)
      return view
    } catch (err) {
      setError(toError(err))
      throw err
    } finally {
      setPending(false)
    }
  }, [])

  const addItem = useCallback((skuId: number, quantity = 1) => mutate(() => addToCart({ sessionId, skuId, quantity })), [mutate, sessionId])
  const setQuantity = useCallback((skuId: number, quantity: number) => mutate(() => updateCartItem({ sessionId, skuId, quantity })), [mutate, sessionId])
  const removeItem = useCallback((skuId: number) => mutate(() => removeCartItem({ sessionId, skuId })), [mutate, sessionId])
  const clear = useCallback(() => mutate(() => clearCart(sessionId)), [mutate, sessionId])

  const value = useMemo<CartContextValue>(
    () => ({
      sessionId,
      items: cart.items,
      count: cart.count,
      totalAmount: cart.totalAmount,
      status,
      error,
      pending,
      reload,
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [sessionId, cart, status, error, pending, reload, addItem, setQuantity, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
