import { PRODUCT_API_URL } from '../utils/productConfig.js'

/**
 * 拉取首页商品栏目列表（商品列表接口化：数据来自商品微服务而非本地 siteData）。
 * @param {AbortSignal} [signal] 可选的中止信号，用于组件卸载 / 重新加载时取消请求
 * @returns {Promise<Array>} 商品栏目数组
 */
export async function fetchProductSections(signal) {
  const res = await fetch(PRODUCT_API_URL, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`商品接口返回错误：${res.status}`)
  }
  return res.json()
}
