import { topBarLeft, topBarRight, navLinks, searchPlaceholder } from '../data/siteData.js'
import { IconCart, IconSearch } from './Icons.jsx'
import styles from './Navbar.module.less'

export default function Navbar() {
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
        <a className={styles.navbarLogo} href="#top" aria-label="小米官网">
          <img src="/mi-logo.svg" alt="小米" width="56" height="56" />
        </a>

        <nav className={styles.navbarMenu} aria-label="商品分类">
          {navLinks.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <form className={styles.navbarSearch} onSubmit={(e) => e.preventDefault()}>
          <input type="search" placeholder={searchPlaceholder} aria-label="搜索商品" />
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
