import HeroCarousel from '../components/HeroCarousel'
import PromoBanner from '../components/PromoBanner'
import ProductSections from '../components/ProductSections'
import useAppNav from '../hooks/useAppNav'

/**
 * 首页（路由：/）：轮播 + 促销横幅 + 商品栏目。
 * 跳转改由 useAppNav 提供，本组件只需要 goSearch 用于「查看全部」跳分类、goDetail 跳详情。
 */
export default function HomePage() {
  const { goSearch, goDetail } = useAppNav()
  return (
    <>
      <HeroCarousel />
      <PromoBanner />
      <ProductSections
        onViewAll={(section) => goSearch({ keyword: '', category: section.id, page: 1 })}
        onOpen={goDetail}
      />
    </>
  )
}
