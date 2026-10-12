import { lazy } from 'react'
import type { ComponentType } from 'react'
import HomePage from './pages/HomePage'

// 商品列表页用到 antd 分页组件，懒加载：只有进入 /search 才会拉这一坨代码
const SearchPage = lazy(() => import('./pages/SearchPage'))
// 商品详情页仅在进入 /product/:id 时加载
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
// 购物车页仅在进入 /cart 时加载
const CartPage = lazy(() => import('./pages/CartPage'))

/** 路由表项 */
export interface AppRoute {
  path: string
  element: ComponentType
  /** 懒加载期间的占位文案（null 表示无需占位） */
  fallback: string | null
}

/**
 * 路径式路由表：交给 react-router 的 <Routes> 渲染。
 * 首页直接导入保障首屏，其余页面懒加载做代码分割。
 * fallback 为该路由懒加载期间的占位文案（null 表示无需占位）。
 * 新增页面只需在此登记一项（path + 组件 + 占位），并在页面内用 useAppNav 处理跳转。
 */
export const APP_ROUTES: AppRoute[] = [
  { path: '/', element: HomePage, fallback: null },
  { path: '/search', element: SearchPage, fallback: '商品列表加载中…' },
  { path: '/product/:id', element: ProductDetailPage, fallback: '商品详情加载中…' },
  { path: '/cart', element: CartPage, fallback: '购物车加载中…' },
]

export default APP_ROUTES
