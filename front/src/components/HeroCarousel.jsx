import { useEffect, useState } from 'react'
import { slides, categoryMenu } from '../data/siteData.js'
import { IconChevronLeft, IconChevronRight } from './Icons.jsx'
import styles from './HeroCarousel.module.less'

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
    <section className={`${styles.hero} container`} id="top">
      <aside
        className={styles.heroMenu}
        onMouseLeave={() => setOpenMenu(-1)}
        aria-label="全部商品分类"
      >
        {categoryMenu.map((item, i) => (
          <div
            key={item.label}
            className={`${styles.heroMenuItem}${openMenu === i ? ` ${styles.isOpen}` : ''}`}
            onMouseEnter={() => setOpenMenu(i)}
          >
            <a href="#top">{item.label}</a>
            <IconChevronRight width={12} height={12} />
            {openMenu === i && (
              <div className={styles.heroFlyout}>
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
        className={styles.heroBanner}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, i) => (
          <a
            key={slide.id}
            href="#top"
            className={`${styles.heroSlide}${i === index ? ` ${styles.isActive}` : ''}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <img src={slide.image} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className={styles.heroCopy}>
              {slide.eyebrow && <p className={styles.heroEyebrow}>{slide.eyebrow}</p>}
              <h2 className={styles.heroTitle}>{slide.title}</h2>
              <p className={styles.heroSubtitle}>{slide.subtitle}</p>
              {slide.price && <p className={styles.heroPrice}>{slide.price}</p>}
              <span className={styles.heroCta}>{slide.cta}</span>
            </div>
          </a>
        ))}

        <button className={`${styles.heroArrow} ${styles.heroArrowPrev}`} type="button" onClick={prev} aria-label="上一张">
          <IconChevronLeft />
        </button>
        <button className={`${styles.heroArrow} ${styles.heroArrowNext}`} type="button" onClick={next} aria-label="下一张">
          <IconChevronRight width={18} height={18} />
        </button>

        <div className={styles.heroDots} role="tablist" aria-label="轮播导航">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`第 ${i + 1} 张`}
              className={i === index ? styles.isActive : ''}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
