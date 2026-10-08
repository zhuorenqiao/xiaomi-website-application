import { useEffect, useState } from 'react'
import { slides, categoryMenu } from '../data/siteData.js'
import { IconChevronLeft, IconChevronRight } from './Icons.jsx'
import './HeroCarousel.css'

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [openMenu, setOpenMenu] = useState(-1)

  useEffect(() => {
    if (
      paused ||
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined
    }
    const timer = setTimeout(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearTimeout(timer)
  }, [index, paused])

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)

  return (
    <section className="hero container" id="top">
      <aside
        className="hero__menu"
        onMouseLeave={() => setOpenMenu(-1)}
        aria-label="全部商品分类"
      >
        {categoryMenu.map((item, i) => (
          <div
            key={item.label}
            className={`hero__menu-item${openMenu === i ? ' is-open' : ''}`}
            onMouseEnter={() => setOpenMenu(i)}
          >
            <a href="#top">{item.label}</a>
            <IconChevronRight width={12} height={12} />
            {openMenu === i && (
              <div className="hero__flyout">
                {item.children.map((child) => (
                  <a key={child} href="#top">
                    {child}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      <div
        className="hero__banner"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, i) => (
          <a
            key={slide.id}
            href="#top"
            className={`hero__slide${i === index ? ' is-active' : ''}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <img src={slide.image} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="hero__copy">
              {slide.eyebrow && <p className="hero__eyebrow">{slide.eyebrow}</p>}
              <h2 className="hero__title">{slide.title}</h2>
              <p className="hero__subtitle">{slide.subtitle}</p>
              {slide.price && <p className="hero__price">{slide.price}</p>}
              <span className="hero__cta">{slide.cta}</span>
            </div>
          </a>
        ))}

        <button className="hero__arrow hero__arrow--prev" type="button" onClick={prev} aria-label="上一张">
          <IconChevronLeft />
        </button>
        <button className="hero__arrow hero__arrow--next" type="button" onClick={next} aria-label="下一张">
          <IconChevronRight width={18} height={18} />
        </button>

        <div className="hero__dots" role="tablist" aria-label="轮播导航">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`第 ${i + 1} 张`}
              className={i === index ? 'is-active' : ''}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
