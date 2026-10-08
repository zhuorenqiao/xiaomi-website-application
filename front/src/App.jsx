import Navbar from './components/Navbar.jsx'
import HeroCarousel from './components/HeroCarousel.jsx'
import PromoBanner from './components/PromoBanner.jsx'
import ProductSection from './components/ProductSection.jsx'
import Footer from './components/Footer.jsx'
import { sections } from './data/siteData.js'

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
    </div>
  )
}
