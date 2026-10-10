import { promoBanner } from '../data/siteData.js'
import { IconArrowRight } from './Icons.jsx'
import styles from './PromoBanner.module.less'

export default function PromoBanner() {
  return (
    <section className={`container ${styles.promo}`}>
      <a className={styles.promoCard} href="#top">
        <img src={promoBanner.image} alt={promoBanner.title} loading="lazy" />
        <div className={styles.promoCopy}>
          <h2 className={styles.promoTitle}>{promoBanner.title}</h2>
          <p className={styles.promoDesc}>{promoBanner.desc}</p>
          <span className={styles.promoCta}>
            {promoBanner.cta}
            <IconArrowRight width={15} height={15} />
          </span>
        </div>
      </a>
    </section>
  )
}
