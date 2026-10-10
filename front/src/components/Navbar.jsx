import { useEffect, useState } from 'react'
import { topBarLeft, topBarRight, navLinks, searchPlaceholder } from '../data/siteData.js'
import { IconCart, IconSearch } from './Icons.jsx'
import styles from './Navbar.module.less'

/**
 * 顶部导航。
 * @param {{keyword?: string, onSearch?: (keyword: string) => void, onHome?: () => void}} props
 *   keyword       当前地址栏里的搜索词，用于回填搜索框
 *   onSearch      提交搜索（进入商品列表页）
 *   onHome        点 logo 回到首页
 */
export default function Navbar({ keyword = '', onSearch, onHome }) {
  const [value, setValue] = useState(keyword)

  // 外部条件变化（如浏览器前进后退）时同步输入框，避免显示与地址栏不一致
  useEffect(() => {
    setValue(keyword)
  }, [keyword])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSearch?.(trimmed)
  }

  return (
    <header>
      <div className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          <ul className={styles.topbarLinks}>
            {topBarLeft.map((label) => (
              <li key={label}>
                <a href="#top">{label}</a>
              </li>
            ))}
          </ul>
          <ul className={styles.topbarLinks}>
            {topBarRight.map((label, i) => (
              <li key={label}>
                <a href="#top">
                  {i === 3 && <IconCart width={13} height={13} />}
                  {label}
                  {i === 3 && '（0）'}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.navbar}`}>
        <a
          className={styles.navbarLogo}
          href="#top"
          aria-label="小米官网"
          onClick={(event) => {
            if (!onHome) return
            event.preventDefault()
            onHome()
          }}
        >
          <img src="/mi-logo.svg" alt="小米" width="56" height="56" />
        </a>

        <nav className={styles.navbarMenu} aria-label="商品分类">
          {navLinks.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <form className={styles.navbarSearch} onSubmit={handleSubmit} role="search">
          <input
            type="search"
            placeholder={searchPlaceholder}
            aria-label="搜索商品"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <button type="submit" aria-label="搜索">
            <IconSearch width={20} height={20} />
          </button>
        </form>

        <a className={styles.navbarCart} href="#top">
          <IconCart width={16} height={16} />
          购物车
          <span>（0）</span>
        </a>
      </div>
    </header>
  )
}
