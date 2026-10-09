import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import HeroCarousel from './components/HeroCarousel.jsx'
import PromoBanner from './components/PromoBanner.jsx'
import ProductSection from './components/ProductSection.jsx'
import Footer from './components/Footer.jsx'
import ChatProvider from './hooks/ChatProvider.jsx'
import { sections } from './data/siteData.js'

// 聊天浮窗（含 antd / Ant Design X）体积较大，懒加载避免拖慢主页首屏
const ChatWidget = lazy(() => import('./components/chat/ChatWidget.jsx'))

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <HeroCarousel />
        <PromoBanner />
        {sections.map((section) => (
          <ProductSection key={section.id} section={section} />
        ))}
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
