/**
 * 游客购物车会话标识的本地持久化（localStorage）。
 * 后端购物车以该 id 归组，本工具负责「首次生成、之后稳定复用」，读写做异常兜底。
 */
const SESSION_KEY = 'mi-cart-session-id'

function generateId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 取得当前购物车会话 id：没有则生成并写入 localStorage。
 * 隐私模式 / 存储不可用时返回内存态 id（不落盘，刷新后会换人，属可接受的降级）。
 */
export function getCartSessionId(): string {
  try {
    const saved = window.localStorage.getItem(SESSION_KEY)
    if (saved) return saved
    const fresh = generateId()
    window.localStorage.setItem(SESSION_KEY, fresh)
    return fresh
  } catch {
    return generateId()
  }
}
