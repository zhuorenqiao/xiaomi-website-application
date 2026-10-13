import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { navLinks, searchPlaceholder, topBarLeft, topBarRight } from '../data/siteData'
import useCart from '../hooks/useCart'
import useSuggestions from '../hooks/useSuggestions'
import { IconCart, IconSearch } from './Icons'
import styles from './Navbar.module.less'

/** 联想下拉的 DOM id 前缀（aria-controls / aria-activedescendant 共用） */
const LIST_ID = 'navbar-suggest'

/**
 * 命中片段标橙：把候选词里与已输入内容重合的一段包成 <mark>，
 * 与小米商城搜索下拉「小米 手环11」那种显示一致。
 */
function highlight(name: string, query: string): ReactNode {
  const text = query.trim()
  if (!text) return name
  const at = name.toLowerCase().indexOf(text.toLowerCase())
  if (at < 0) return name
  return (
    <>
      {name.slice(0, at)}
      <mark className={styles.navbarSuggestHit}>{name.slice(at, at + text.length)}</mark>
      {name.slice(at + text.length)}
    </>
  )
}

/**
 * 顶部导航。
 * 路由改由 react-router 接管：搜索框回填读当前 /search 的 keyword，
 * 提交跳 /search、点 logo 回 /、点购物车去 /cart，均用 useNavigate / <Link>。
 * 输入时按下拉联想（useSuggestions 做防抖），支持鼠标点击与方向键 + Enter 选择。
 */
export default function Navbar() {
  const { count } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const [value, setValue] = useState(keyword)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const boxRef = useRef<HTMLFormElement>(null)
  const suggestions = useSuggestions(value)
  const showList = open && suggestions.length > 0

  // 地址栏关键词变化（如浏览器前进后退 / 跳转分类）时同步输入框
  useEffect(() => {
    setValue(keyword)
  }, [keyword])

  // 候选集变了就回到「无高亮项」，避免方向键停在已被替换的下标上
  useEffect(() => {
    setActive(-1)
  }, [suggestions])

  // 点到搜索框外面时收起下拉（框内点击交给 option 自己的 onClick）
  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event: PointerEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const runSearch = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setValue(trimmed)
    setOpen(false)
    setActive(-1)
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // 方向键选中了候选词就按候选词搜，否则按输入框内容搜
    runSearch(active >= 0 ? suggestions[active] : value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      setActive(-1)
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (suggestions.length === 0) return
      event.preventDefault() // 阻止光标跳到文本首尾
      const step = event.key === 'ArrowDown' ? 1 : -1
      setOpen(true)
      setActive((prev) => {
        // 未选中时：向下从第一条开始，向上从最后一条开始
        const from = prev < 0 ? (step > 0 ? -1 : suggestions.length) : prev
        return (from + step + suggestions.length) % suggestions.length
      })
      return
    }
    if (event.key === 'Enter' && active >= 0) {
      event.preventDefault() // 选中候选词时不再触发表单提交
      runSearch(suggestions[active])
    }
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

        <form className={styles.navbarSearch} role="search" ref={boxRef} onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder={searchPlaceholder}
            aria-label="搜索商品"
            role="combobox"
            aria-expanded={showList}
            aria-controls={LIST_ID}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${LIST_ID}-${active}` : undefined}
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" aria-label="搜索">
            <IconSearch width={20} height={20} />
          </button>

          {showList ? (
            <ul className={styles.navbarSuggest} id={LIST_ID} role="listbox" aria-label="搜索联想">
              {suggestions.map((item, index) => (
                <li
                  key={item}
                  id={`${LIST_ID}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  className={index === active ? styles.navbarSuggestItemActive : styles.navbarSuggestItem}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => runSearch(item)}
                >
                  {highlight(item, value)}
                </li>
              ))}
            </ul>
          ) : null}
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
