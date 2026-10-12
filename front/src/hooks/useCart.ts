/**
 * 购物车全局状态消费 Hook，必须在 <CartProvider> 内使用。
 *
 * 返回：sessionId / items / count / totalAmount / status / error / pending，
 * 以及 reload / addItem / setQuantity / removeItem / clear 动作。
 */
import { useContext } from 'react'
import { CartContext, type CartContextValue } from './CartProvider'

export default function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart 必须在 <CartProvider> 内部使用')
  }
  return ctx
}
