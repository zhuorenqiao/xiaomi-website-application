import { promoBanner } from '../data/siteData.js'
import { IconArrowRight } from './Icons.jsx'
import './PromoBanner.css'

export default function PromoBanner() {
  return (
    <section className="container promo">
      <a className="promo__card" href="#top">
        <img src={promoBanner.image} alt={promoBanner.title} loading="lazy" />
        <div className="promo__copy">
          <h2 className="promo__title">{promoBanner.title}</h2>
          <p className="promo__desc">{promoBanner.desc}</p>
          <span className="promo__cta">
            {promoBanner.cta}
            <IconArrowRight width={15} height={15} />
          </span>
        </div>
      </a>
    </section>
  )
}
