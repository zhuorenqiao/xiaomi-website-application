import { lazy } from 'react'
import HomePage from './pages/HomePage.jsx'

// 商品列表页用到 antd 分页组件，懒加载：只有进入搜索路由才会拉这一坨代码
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'))

/**
 * 路由配置表：视图名 -> 页面组件 + 懒加载占位文案。
 * useAppRoute 依据地址栏解析出 view，App 再按本表挑选要渲染的页面，
 * 新增页面只需在此登记一项并在 useAppRoute 里补对应的 view 判定。
 * 每个页面统一接收 { query, goSearch, goHome }，各自取用所需字段。
 */
export const ROUTES = {
  home: { component: HomePage, fallback: null },
  search: { component: SearchPage, fallback: '商品列表加载中…' },
}

export default ROUTES
