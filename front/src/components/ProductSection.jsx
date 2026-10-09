import { IconArrowRight } from './Icons.jsx'
import './ProductSection.css'

export default function ProductSection({ section }) {
  const { id, title, feature, products } = section

  return (
    <section className="psection container" id={id}>
      <div className="psection__head">
        <h2>{title}</h2>
        <a className="psection__more" href="#top">
          查看全部 <IconArrowRight width={15} height={15} />
        </a>
      </div>

      <div className="psection__row">
        <a className="psection__feature" href="#top">
          <img src={feature.image} alt={feature.name} loading="lazy" />
          <div className="psection__feature-copy">
            <h3>{feature.name}</h3>
            <p>{feature.desc}</p>
            <p className="psection__feature-price">{feature.price}</p>
            <span className="psection__feature-cta">
              {feature.cta} <IconArrowRight width={14} height={14} />
            </span>
          </div>
        </a>

        {products.map((p) => (
          <a className="pcard" href="#top" key={p.name}>
            {p.tag && <span className="pcard__tag">{p.tag}</span>}
            <div className="pcard__media">
              <img src={p.image} alt={p.name} loading="lazy" />
            </div>
            <h3 className="pcard__name">{p.name}</h3>
            <p className="pcard__desc">{p.desc}</p>
            <p className="pcard__price">{p.price}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
