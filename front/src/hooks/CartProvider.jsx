import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getCartSessionId } from '../utils/cartStorage.js'
import { addToCart, clearCart, fetchCart, removeCartItem, updateCartItem } from '../api/cart.js'

export const CartContext = createContext(null)

/** 把后端 CartView 归一成组件内状态（items 保证为数组，金额转数字） */
function toState(view) {
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
export default function CartProvider({ children }) {
  const [sessionId] = useState(() => getCartSessionId())
  const [cart, setCart] = useState({ items: [], count: 0, totalAmount: 0 })
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)
  const loadRef = useRef(null)

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
      if (err?.name === 'AbortError' || controller.signal.aborted) return
      setError(err)
      setStatus('error')
    }
  }, [sessionId])

  // 挂载即拉取一次（StrictMode 双挂载由 abort 兜底）
  useEffect(() => {
    reload()
    return () => loadRef.current?.abort()
  }, [reload])

  // 写操作统一封装：置 pending → 调接口 → 用返回视图刷新 → 出错上抛供调用方提示
  const mutate = useCallback(
    async (fn) => {
      setPending(true)
      try {
        const view = await fn()
        setCart(toState(view))
        setStatus('ready')
        setError(null)
        return view
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setPending(false)
      }
    },
    [],
  )

  const addItem = useCallback((skuId, quantity = 1) => mutate(() => addToCart({ sessionId, skuId, quantity })), [mutate, sessionId])
  const setQuantity = useCallback((skuId, quantity) => mutate(() => updateCartItem({ sessionId, skuId, quantity })), [mutate, sessionId])
  const removeItem = useCallback((skuId) => mutate(() => removeCartItem({ sessionId, skuId })), [mutate, sessionId])
  const clear = useCallback(() => mutate(() => clearCart(sessionId)), [mutate, sessionId])

  const value = useMemo(
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
