import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchProductDetail } from '../api/products.js'

/**
 * 商品详情 Hook：按商品主键加载详情，id 变化即重新请求，并取消在途请求，
 * 保证快速切换推荐商品时旧响应不会覆盖新结果。
 *
 * @param {number|string|null} id 商品主键（来自地址栏 ?product=）
 * @returns {{detail: object|null, status: 'loading'|'ready'|'error', error: Error|null, retry: () => void}}
 */
export default function useProductDetail(id) {
  const [detail, setDetail] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [nonce, setNonce] = useState(0)
  const controllerRef = useRef(null)

  useEffect(() => {
    // id 缺失（手改地址等）直接判定为错误，不发无谓请求
    if (id == null || id === '') {
      setStatus('error')
      setError(new Error('缺少商品编号'))
      return undefined
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setStatus('loading')
    setError(null)
    fetchProductDetail(id, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setDetail(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || controller.signal.aborted) return
        setError(err)
        setStatus('error')
      })

    return () => controllerRef.current?.abort()
  }, [id, nonce])

  const retry = useCallback(() => setNonce((value) => value + 1), [])

  return { detail, status, error, retry }
}
