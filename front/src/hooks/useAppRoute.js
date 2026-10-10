import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../utils/productConfig.js'

/**
 * 极轻量视图路由：不引入 react-router，直接用地址栏查询串当状态源。
 *   /                      → 首页（商品栏目）
 *   /?keyword=电视          → 商品搜索列表页
 *   /?category=tv&page=2   → 分类浏览 + 分页
 * 好处：分页 / 筛选结果可分享、浏览器前进后退天然可用，搜索框就是普通表单。
 */

const HOME_QUERY = { keyword: '', category: '', sort: 'default', page: 1, size: DEFAULT_PAGE_SIZE }

/** 从查询串读出搜索条件；没有关键词也没有分类时返回 null（表示首页） */
function readQuery(search) {
  const params = new URLSearchParams(search)
  const keyword = (params.get('keyword') || '').trim()
  const category = (params.get('category') || '').trim()
  if (!keyword && !category) return null
  const size = Number(params.get('size'))
  return {
    keyword,
    category,
    sort: params.get('sort') || 'default',
    page: Math.max(1, Number(params.get('page')) || 1),
    // 非法的 size 直接回到默认值，避免手工改地址把每页条数打飞
    size: PAGE_SIZE_OPTIONS.includes(size) ? size : DEFAULT_PAGE_SIZE,
  }
}

/** 由搜索条件生成查询串（默认值不落进 URL，保持地址简洁；调用前已保证至少有一个条件） */
function buildQuery(query) {
  const params = new URLSearchParams()
  if (query.keyword) params.set('keyword', query.keyword)
  if (query.category) params.set('category', query.category)
  if (query.sort && query.sort !== 'default') params.set('sort', query.sort)
  if (query.page > 1) params.set('page', String(query.page))
  if (query.size !== DEFAULT_PAGE_SIZE) params.set('size', String(query.size))
  return `?${params.toString()}`
}

function readRoute() {
  const query = readQuery(window.location.search)
  return query ? { view: 'search', query } : { view: 'home', query: { ...HOME_QUERY } }
}

/**
 * @returns {{
 *   route: { view: 'home'|'search', query: object },
 *   goSearch: (patch?: object) => void,
 *   goHome: () => void,
 * }}
 *   goSearch 接收「要改的那几个字段」，其余沿用当前地址中的值。
 */
export default function useAppRoute() {
  const [route, setRoute] = useState(readRoute)

  // 浏览器前进 / 后退时同步视图
  useEffect(() => {
    const onPopState = () => setRoute(readRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const goSearch = useCallback((patch = {}) => {
    const current = readQuery(window.location.search) || HOME_QUERY
    const next = { ...current, ...patch }
    const hasCondition = Boolean(next.keyword || next.category)
    const url = window.location.pathname + (hasCondition ? buildQuery(next) : '')
    window.history.pushState({}, '', url)
    setRoute(readRoute())
    // 换条件 / 翻页都回到顶部，避免停在上一页的滚动位置
    window.scrollTo({ top: 0 })
  }, [])

  const goHome = useCallback(() => {
    if (!window.location.search) return
    window.history.pushState({}, '', window.location.pathname)
    setRoute(readRoute())
    window.scrollTo({ top: 0 })
  }, [])

  return { route, goSearch, goHome }
}
