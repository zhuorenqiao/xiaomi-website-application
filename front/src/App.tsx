import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartProvider from './hooks/CartProvider'
import ChatProvider from './hooks/ChatProvider'
import { APP_ROUTES } from './routes'

// 聊天浮窗（含 antd / Ant Design X）体积较大，懒加载避免拖慢主页首屏
const ChatWidget = lazy(() => import('./components/chat/ChatWidget'))

/** 路由变化（含翻页改查询串）后回到顶部，沿用原 goSearch / goDetail 的滚动行为 */
function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname, search])
  return null
}

export default function App() {
  return (
    <div className="app">
      {/* 路由变化后回顶部：翻页 / 换条件 / 跳详情都会触发 */}
      <ScrollToTop />
      {/* 购物车：导航栏角标与详情/购物车页共享同一份状态，故包裹主体区域 */}
      <CartProvider>
        <Navbar />
        <main>
          <Routes>
            {APP_ROUTES.map(({ path, element: Page, fallback }) => (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense
                    fallback={fallback ? <div className="page-loading container">{fallback}</div> : null}
                  >
                    <Page />
                  </Suspense>
                }
              />
            ))}
            {/* 未知路径兜底回首页（等价原「未知 view → home」策略） */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
      <ChatProvider>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </ChatProvider>
    </div>
  )
}
