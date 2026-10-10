import { IconArrowRight } from './Icons.jsx'
import styles from './ProductSection.module.less'

/**
 * 首页商品栏目（无状态展示组件）。
 * @param {{ id: string, title: string, feature: object, products: Array[] }} section 栏目数据
 * @param {(section: object) => void} [onViewAll] 「查看全部」回调：进入该分类的商品列表页（分页）
 */
export default function ProductSection({ section, onViewAll }) {
  const { id, title, feature, products } = section

  const handleViewAll = (event) => {
    if (!onViewAll) return
    event.preventDefault()
    onViewAll(section)
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
        <a className={styles.psectionFeature} href="#top">
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
          <a className={styles.pcard} href="#top" key={p.name}>
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
