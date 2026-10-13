import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { searchProducts } from '../api/products'
import type { SearchProductItem } from '../types/product'
import type { CartItem } from '../types/cart'
import { errorMessage } from '../utils/error'
import { navLinks, searchPlaceholder, topBarLeft, topBarRight } from '../data/siteData'
import type { NavLink } from '../data/siteData'
import useCart from '../hooks/useCart'
import useSuggestions from '../hooks/useSuggestions'
import useToast from '../hooks/useToast'
import Toast from './Toast'
import { IconCart, IconClose, IconSearch } from './Icons'
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

/** 浮层展示商品数量上限 */
const DROPDOWN_SIZE = 6

/**
 * 顶部导航。
 * 路由改由 react-router 接管：搜索框回填读当前 /search 的 keyword，
 * 提交跳 /search、点 logo 回 /、点购物车去 /cart，均用 useNavigate / <Link>。
 * 输入时按下拉联想（useSuggestions 做防抖），支持鼠标点击与方向键 + Enter 选择。
 * 主导航菜单 hover 展示浮层子菜单（服务中心、社区除外）。
 */
export default function Navbar() {
  const { count, items: cartItems, totalAmount, pending, removeItem } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const [value, setValue] = useState(keyword)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const boxRef = useRef<HTMLFormElement>(null)
  const suggestions = useSuggestions(value)
  const { message: toast, showToast } = useToast()
  const showList = open && suggestions.length > 0

  /* ---------- 购物车浮层状态 ---------- */
  const [cartHovered, setCartHovered] = useState(false)
  const cartTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cartOpen = cartHovered && count > 0

  // 移入购物车入口或浮层都取消收起，移出统一延迟 120ms 收起，双向过渡都不闪断
  const cancelCartClose = useCallback(() => {
    if (cartTimer.current) clearTimeout(cartTimer.current)
  }, [])

  const handleCartEnter = useCallback(() => {
    cancelCartClose()
    setCartHovered(true)
  }, [cancelCartClose])

  const handleCartLeave = useCallback(() => {
    cartTimer.current = setTimeout(() => setCartHovered(false), 120)
  }, [])

  const handleCartDropdownLeave = useCallback(() => {
    cartTimer.current = setTimeout(() => setCartHovered(false), 120)
  }, [])

  // 卸载时清掉未触发的收起定时器
  useEffect(() => () => {
    if (cartTimer.current) clearTimeout(cartTimer.current)
  }, [])

  /** 浮层内直接移除一行；写操作进行中忽略点击，失败回显到底部提示 */
  const handleCartRemove = useCallback(
    (item: CartItem) => {
      if (pending) return
      removeItem(item.skuId).catch((e) => showToast(`移除失败：${errorMessage(e)}`))
    },
    [pending, removeItem, showToast],
  )

  /* ---------- 浮层子菜单状态 ---------- */
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [dropdownProducts, setDropdownProducts] = useState<SearchProductItem[]>([])
  const [dropdownLoading, setDropdownLoading] = useState(false)
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownAbort = useRef<AbortController | null>(null)

  /** 加载浮层商品 */
  const loadDropdown = useCallback((category: string) => {
    dropdownAbort.current?.abort()
    const controller = new AbortController()
    dropdownAbort.current = controller
    setDropdownLoading(true)
    searchProducts({ category, size: DROPDOWN_SIZE }, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        setDropdownProducts(res.items)
      })
      .catch(() => {
        /* 静默失败，浮层显示空 */
      })
      .finally(() => {
        if (!controller.signal.aborted) setDropdownLoading(false)
      })
  }, [])

  /** 鼠标移入菜单项 */
  const handleMenuEnter = useCallback((index: number, item: NavLink) => {
    if (!item.hasDropdown) {
      setHoveredIndex(null)
      return
    }
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    setHoveredIndex(index)
    if (item.category) loadDropdown(item.category)
  }, [loadDropdown])

  /** 鼠标移出菜单项（给予小延迟避免移向浮层时闪断） */
  const handleMenuLeave = useCallback(() => {
    dropdownTimer.current = setTimeout(() => setHoveredIndex(null), 120)
  }, [])

  /** 鼠标移入浮层本身时取消收起 */
  const handleDropdownEnter = useCallback(() => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
  }, [])

  /** 鼠标移出浮层时收起 */
  const handleDropdownLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  /** 点击浮层商品卡片跳详情 */
  const handleDropdownClick = useCallback((id: number) => {
    setHoveredIndex(null)
    navigate(`/product/${id}`)
  }, [navigate])

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
              <li key={label} className={i === 3 ? styles.topbarCartWrap : undefined}>
                {i === 3 ? (
                  <>
                    <Link
                      to="/cart"
                      className={cartOpen ? `${styles.topbarCart} ${styles.topbarCartOpen}` : styles.topbarCart}
                      onMouseEnter={handleCartEnter}
                      onMouseLeave={handleCartLeave}
                    >
                      <IconCart width={13} height={13} />
                      {label}
                      {` （${count}）`}
                    </Link>
                    {cartHovered && count > 0 ? (
                      <div
                        className={styles.topbarCartDropdown}
                        onMouseEnter={cancelCartClose}
                        onMouseLeave={handleCartDropdownLeave}
                      >
                        <div className={styles.topbarCartList}>
                          {cartItems.slice(0, 5).map((item) => (
                            <div key={item.id} className={styles.topbarCartItem}>
                              <a
                                className={styles.topbarCartItemMain}
                                href="#top"
                                onClick={(e) => { e.preventDefault(); navigate(`/product/${item.productId}`) }}
                              >
                                <div className={styles.topbarCartItemMedia}>
                                  <img src={item.image} alt={item.name} loading="lazy" />
                                </div>
                                <div className={styles.topbarCartItemInfo}>
                                  <p className={styles.topbarCartItemName}>{item.name}</p>
                                  <p className={styles.topbarCartItemSpec}>{item.version} {item.color}</p>
                                </div>
                                <span className={styles.topbarCartItemPrice}>{item.price}元 × {item.quantity}</span>
                              </a>
                              <button
                                type="button"
                                className={styles.topbarCartItemRemove}
                                aria-label={`移除 ${item.name}`}
                                title="移除"
                                disabled={pending}
                                onClick={() => handleCartRemove(item)}
                              >
                                <IconClose width={12} height={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className={styles.topbarCartFooter}>
                          <div className={styles.topbarCartSummary}>
                            <span>共 {count} 件商品</span>
                            <strong>{totalAmount}元</strong>
                          </div>
                          <button
                            type="button"
                            className={styles.topbarCartBtn}
                            onClick={() => { setCartHovered(false); navigate('/cart') }}
                          >
                            去购物车结算
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </>
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
          {navLinks.map((item, index) => (
            <a
              key={item.label}
              href="#top"
              className={hoveredIndex === index && item.hasDropdown ? styles.navbarMenuItemActive : undefined}
              onMouseEnter={() => handleMenuEnter(index, item)}
              onMouseLeave={handleMenuLeave}
              onClick={(e) => { if (item.hasDropdown) e.preventDefault() }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* 浮层子菜单 */}
        {hoveredIndex !== null && navLinks[hoveredIndex]?.hasDropdown ? (
          <div
            className={styles.navbarDropdown}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className={`container ${styles.navbarDropdownInner}`}>
              {dropdownLoading ? (
                <p className={styles.navbarDropdownLoading}>加载中…</p>
              ) : (
                dropdownProducts.map((p) => (
                  <a
                    key={p.id}
                    className={styles.navbarDropdownCard}
                    href="#top"
                    onClick={(e) => { e.preventDefault(); handleDropdownClick(p.id) }}
                  >
                    <div className={styles.navbarDropdownMedia}>
                      <img src={p.image} alt={p.name} loading="lazy" />
                    </div>
                    <h4 className={styles.navbarDropdownName}>{p.name}</h4>
                    <p className={styles.navbarDropdownPrice}>{p.price}</p>
                  </a>
                ))
              )}
            </div>
          </div>
        ) : null}

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
      </div>
      <Toast message={toast} />
    </header>
  )
}
