/**
 * 异常归一化：fetch / AbortController 抛出的值在 TS 下是 unknown，
 * 这里集中提供「是否被用户中止」判断与可读文案提取，避免各处重复写 instanceof。
 */

/** 是否为中止信号触发的异常（用于忽略主动取消的请求） */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

/** 任意抛出值 → Error（写入状态位 / 重新抛出时用，非 Error 值转成消息文本） */
export function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error))
}

/** 任意抛出值 → 用户可读文案 */
export function errorMessage(error: unknown, fallback = '未知错误'): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
