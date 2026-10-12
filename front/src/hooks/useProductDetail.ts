import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchProductDetail } from '../api/products'
import type { LoadStatus } from '../types/api'
import type { ProductDetail } from '../types/product'
import { isAbortError, toError } from '../utils/error'

/**
 * 商品详情 Hook：按商品主键加载详情，id 变化即重新请求，并取消在途请求，
 * 保证快速切换推荐商品时旧响应不会覆盖新结果。
 *
 * @param id 商品主键（来自地址栏 /product/:id）
 * @returns detail / status / error / retry
 */
export default function useProductDetail(id: string | number | null | undefined) {
  const [detail, setDetail] = useState<ProductDetail | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<Error | null>(null)
  const [nonce, setNonce] = useState(0)
  const controllerRef = useRef<AbortController | null>(null)

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
        if (isAbortError(err) || controller.signal.aborted) return
        setError(toError(err))
        setStatus('error')
      })

    return () => controllerRef.current?.abort()
  }, [id, nonce])

  const retry = useCallback(() => setNonce((value) => value + 1), [])

  return { detail, status, error, retry }
}
