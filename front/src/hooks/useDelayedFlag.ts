import { useEffect, useState } from 'react'

/**
 * 把瞬时布尔量（如请求 in-flight）延迟置真：持续超过 delay 才返回 true，转假时立刻返回 false。
 * 用于「处理中…」这类只在慢请求下才该露面的反馈——几十毫秒的状态往返会被看成闪烁。
 */
export default function useDelayedFlag(active: boolean, delay = 200): boolean {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!active) {
      setShown(false)
      return undefined
    }
    const timer = setTimeout(() => setShown(true), delay)
    return () => clearTimeout(timer)
  }, [active, delay])

  return shown
}
