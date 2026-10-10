import HeroCarousel from '../components/HeroCarousel.jsx'
import PromoBanner from '../components/PromoBanner.jsx'
import ProductSections from '../components/ProductSections.jsx'

/**
 * 首页（路由：/）：轮播 + 促销横幅 + 商品栏目。
 * 与列表页共用统一的路由入参，本组件只需要 goSearch 用于「查看全部」跳转分类。
 * @param {(patch: object) => void} goSearch 跳转商品列表页并带上查询条件
 */
export default function HomePage({ goSearch }) {
  return (
    <>
      <HeroCarousel />
      <PromoBanner />
      <ProductSections onViewAll={(section) => goSearch({ keyword: '', category: section.id, page: 1 })} />
    </>
  )
}
