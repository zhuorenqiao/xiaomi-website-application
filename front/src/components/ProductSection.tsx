import type { MouseEvent } from 'react'
import type { ProductSection as SectionData } from '../types/product'
import { IconArrowRight } from './Icons'
import styles from './ProductSection.module.less'

export interface ProductSectionProps {
  /** 栏目数据 */
  section: SectionData
  /** 「查看全部」回调：进入该分类的商品列表页（分页） */
  onViewAll?: (section: SectionData) => void
  /** 商品点击回调：传入商品主键跳详情页（主推位与网格卡片共用） */
  onOpen?: (id: number) => void
}

/**
 * 首页商品栏目（无状态展示组件）。
 */
export default function ProductSection({ section, onViewAll, onOpen }: ProductSectionProps) {
  const { id, title, feature, products } = section

  const handleViewAll = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onViewAll) return
    event.preventDefault()
    onViewAll(section)
  }

  // 卡片 / 主推位点击：拦截默认的 #top 锚点跳转，改走详情路由（未接 onOpen 时保留占位行为）
  const handleOpen = (productId: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onOpen) return
    event.preventDefault()
    onOpen(productId)
  }

  return (
    <section className={`${styles.psection} container`} id={id}>
      <div className={styles.psectionHead}>
        <h2>{title}</h2>
        <a className={styles.psectionMore} href="#top" onClick={handleViewAll}>
          查看全部 <IconArrowRight width={15} height={15} />
        </a>
      </div>

      <div className={styles.psectionRow}>
        <a className={styles.psectionFeature} href="#top" onClick={handleOpen(feature.id)}>
          <img src={feature.image} alt={feature.name} loading="lazy" />
          <div className={styles.psectionFeatureCopy}>
            <h3>{feature.name}</h3>
            <p>{feature.desc}</p>
            <p className={styles.psectionFeaturePrice}>{feature.price}</p>
            <span className={styles.psectionFeatureCta}>
              {feature.cta} <IconArrowRight width={14} height={14} />
            </span>
          </div>
        </a>

        {products.map((p) => (
          <a className={styles.pcard} href="#top" key={p.id} onClick={handleOpen(p.id)}>
            {p.tag && <span className={styles.pcardTag}>{p.tag}</span>}
            <div className={styles.pcardMedia}>
              <img src={p.image} alt={p.name} loading="lazy" />
            </div>
            <h3 className={styles.pcardName}>{p.name}</h3>
            <p className={styles.pcardDesc}>{p.desc}</p>
            <p className={styles.pcardPrice}>{p.price}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
