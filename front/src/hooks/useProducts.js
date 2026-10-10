import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchProductSections } from '../api/products.js'

/**
 * 首页商品栏目数据 Hook：从商品微服务加载列表，暴露加载态与重试方法。
 * @returns {{
 *   sections: Array,
 *   status: 'loading' | 'ready' | 'error',
 *   error: Error | null,
 *   reload: () => Promise<void>,
 * }}
 */
export default function useProducts() {
  const [sections, setSections] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const controllerRef = useRef(null)

  const load = useCallback(async () => {
    // 重新加载时取消上一次在途请求，避免 StrictMode 双挂载 / 快速重试导致状态错乱
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setStatus('loading')
    setError(null)
    try {
      const data = await fetchProductSections(controller.signal)
      if (controller.signal.aborted) return
      setSections(Array.isArray(data) ? data : [])
      setStatus('ready')
    } catch (err) {
      if (err?.name === 'AbortError' || controller.signal.aborted) return
      setError(err)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
    return () => controllerRef.current?.abort()
  }, [load])

  return { sections, status, error, reload: load }
}
