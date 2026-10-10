import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../utils/productConfig.js'

/**
 * 基于 react-router 的导航操作封装：把「改搜索条件」的局部更新收敛成一个 goSearch(patch)，
 * 未提及的字段沿用当前地址中的值；跳详情 / 购物车 / 首页各走自己的路径。
 * 滚动到顶部交给 <ScrollToTop> 在路由变化时统一处理，这里只负责改地址。
 *
 * 路径约定：
 *   /                    首页（商品栏目）
 *   /search?keyword=电视  商品搜索列表页
 *   /search?category=tv&page=2  分类浏览 + 分页
 *   /product/1001        商品详情页
 *   /cart                购物车页
 */
export default function useAppNav() {
  const navigate = useNavigate()
  const { search } = useLocation()

  // 局部更新查询条件：与当前查询串合并后写入 /search（默认值不落进 URL，保持地址简洁）
  const goSearch = useCallback(
    (patch = {}) => {
      const current = new URLSearchParams(search)
      const read = (key, fallbackValue) => {
        if (patch[key] !== undefined) return patch[key]
        const raw = current.get(key)
        return raw === null || raw === '' ? fallbackValue : raw
      }
      const keyword = String(read('keyword', '')).trim()
      const category = String(read('category', '')).trim()
      const sort = String(read('sort', 'default'))
      const page = Math.max(1, Number(read('page', 1)) || 1)
      // 非法的 size 直接回到默认值，避免手工改地址把每页条数打飞
      const sizeNum = Number(read('size', DEFAULT_PAGE_SIZE))
      const size = PAGE_SIZE_OPTIONS.includes(sizeNum) ? sizeNum : DEFAULT_PAGE_SIZE

      // 没有任何条件时等价于回首页浏览栏目（沿用旧 goSearch 的兜底语义）
      if (!keyword && !category) {
        navigate('/')
        return
      }
      const params = new URLSearchParams()
      if (keyword) params.set('keyword', keyword)
      if (category) params.set('category', category)
      if (sort && sort !== 'default') params.set('sort', sort)
      if (page > 1) params.set('page', String(page))
      if (size !== DEFAULT_PAGE_SIZE) params.set('size', String(size))
      navigate(`/search?${params.toString()}`)
    },
    [navigate, search],
  )

  // 跳详情页：/product/<id>（参考 mi.com 的 product_id）
  const goDetail = useCallback(
    (id) => {
      if (id == null || id === '') return
      navigate(`/product/${id}`)
    },
    [navigate],
  )

  const goCart = useCallback(() => navigate('/cart'), [navigate])
  const goHome = useCallback(() => navigate('/'), [navigate])

  return { goSearch, goDetail, goCart, goHome }
}
