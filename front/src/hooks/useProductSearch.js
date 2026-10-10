import { useCallback, useEffect, useRef, useState } from 'react'
import { searchProducts } from '../api/products.js'

/**
 * 商品搜索分页 Hook：查询条件（关键词 / 分类 / 排序 / 页码 / 每页条数）任一变化即重新请求，
 * 并保证在途请求被取消，避免快速翻页时旧响应覆盖新结果。
 *
 * 保留上一次结果（result）用于翻页时的骨架过渡，翻页过程不会出现「整块内容闪空」。
 *
 * @param {{keyword?: string, category?: string, sort?: string, page?: number, size?: number}} query
 * @returns {{result: object|null, status: 'loading'|'ready'|'error', error: Error|null, retry: () => void}}
 */
export default function useProductSearch(query) {
  const { keyword = '', category = '', sort = 'default', page = 1, size = 20 } = query || {}
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [nonce, setNonce] = useState(0)
  const controllerRef = useRef(null)

  useEffect(() => {
    // 重新加载时取消上一次在途请求（StrictMode 双挂载 / 快速翻页都会走到这里）
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setStatus('loading')
    setError(null)
    searchProducts({ keyword, category, sort, page, size }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setResult(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || controller.signal.aborted) return
        setError(err)
        setStatus('error')
      })
  }, [keyword, category, sort, page, size, nonce])

  useEffect(() => () => controllerRef.current?.abort(), [])

  const retry = useCallback(() => setNonce((value) => value + 1), [])

  return { result, status, error, retry }
}
