import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { navLinks, searchPlaceholder, topBarLeft, topBarRight } from '../data/siteData'
import useCart from '../hooks/useCart'
import { IconCart, IconSearch } from './Icons'
import styles from './Navbar.module.less'

/**
 * 顶部导航。
 * 路由改由 react-router 接管：搜索框回填读当前 /search 的 keyword，
 * 提交跳 /search、点 logo 回 /、点购物车去 /cart，均用 useNavigate / <Link>。
 */
export default function Navbar() {
  const { count } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const [value, setValue] = useState(keyword)

  // 地址栏关键词变化（如浏览器前进后退 / 跳转分类）时同步输入框
  useEffect(() => {
    setValue(keyword)
  }, [keyword])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`)
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
                {i === 3 ? (
                  <Link to="/cart">
                    <IconCart width={13} height={13} />
                    {label}
                    {`（${count}）`}
                  </Link>
                ) : (
                  <a href="#top">{label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.navbar}`}>
        <Link className={styles.navbarLogo} to="/" aria-label="小米官网">
          <img src="/mi-logo.svg" alt="小米" width="56" height="56" />
        </Link>

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

        <Link className={styles.navbarCart} to="/cart">
          <IconCart width={16} height={16} />
          购物车
          <span>（{count}）</span>
        </Link>
      </div>
    </header>
  )
}
