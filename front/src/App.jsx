import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ChatProvider from './hooks/ChatProvider.jsx'
import useAppRoute from './hooks/useAppRoute.js'
import { ROUTES } from './routes.jsx'

// 聊天浮窗（含 antd / Ant Design X）体积较大，懒加载避免拖慢主页首屏
const ChatWidget = lazy(() => import('./components/chat/ChatWidget.jsx'))

export default function App() {
  const { route, goSearch, goHome } = useAppRoute()
  const { view, query } = route
  // 按路由配置挑选页面；未知视图兜底回首页
  const { component: Page, fallback } = ROUTES[view] ?? ROUTES.home

  return (
    <div className="app">
      <Navbar
        keyword={query.keyword}
        onSearch={(keyword) => goSearch({ keyword, category: '', page: 1 })}
        onHome={goHome}
      />
      <main>
        <Suspense fallback={fallback ? <div className="page-loading container">{fallback}</div> : null}>
          <Page query={query} goSearch={goSearch} goHome={goHome} />
        </Suspense>
      </main>
      <Footer />
      <ChatProvider>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </ChatProvider>
    </div>
  )
}
