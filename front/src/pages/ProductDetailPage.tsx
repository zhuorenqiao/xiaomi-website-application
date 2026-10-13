import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductDetail } from '../api/products'
import type { SearchProductItem } from '../types/product'
import { IconArrowRight, IconChevronLeft, IconChevronRight } from '../components/Icons'
import Toast from '../components/Toast'
import useAppNav from '../hooks/useAppNav'
import useCart from '../hooks/useCart'
import useDelayedFlag from '../hooks/useDelayedFlag'
import useProductDetail from '../hooks/useProductDetail'
import useToast from '../hooks/useToast'
import { errorMessage } from '../utils/error'
import styles from './ProductDetailPage.module.less'

const HOME_TITLE = '小米商城 - 小米手机 | 智能家电 | 官方正品'

/** 详情标签页：概述 / 规格参数 / 服务与配送（与小米商城详情页一致的信息分组） */
type DetailTab = 'overview' | 'specs' | 'service'

const TABS: { key: DetailTab; label: string }[] = [
  { key: 'overview', label: '概述' },
  { key: 'specs', label: '规格参数' },
  { key: 'service', label: '服务与配送' },
]

/** 服务与保障：演示级固定文案 */
const SERVICE_ITEMS = [
  '全国联保 · 官方正品保障',
  '7 天无理由退货 · 15 天免费换货',
  '满 69 元包邮 · 支持小米之家到店自提',
  '1100 余家售后网点 · 可提供上门安装',
]

/** 销量文案：386000 -> 38.6万 */
function formatSales(sales: number): string {
  const value = Number(sales) || 0
  return value >= 10000 ? `${(value / 10000).toFixed(1)}万` : String(value)
}

/** 从「6499 元」价格文案中取出纯数字串（用于大字号价格与合计计算） */
function priceNumber(text?: string): string {
  const match = String(text ?? '').match(/[\d.]+/)
  return match ? match[0] : ''
}

/** 金额格式化：去掉浮点尾数，6499.00 -> 6499，99.9 -> 99.9 */
function formatMoney(value: number | string): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'
  return String(Number(n.toFixed(2)))
}

/**
 * 商品详情页（路由：/product/:id，参考 mi.com/shop/buy/detail）。
 * 上部左画廊右购买信息（版本/颜色选择、价格随 SKU 联动），中部概述 / 规格 / 服务标签页，底部同类推荐。
 * 加入购物车 / 立即购买写入后端持久化购物车（CartProvider），立即购买后跳转购物车页。
 */
export default function ProductDetailPage() {
  const { id } = useParams()
  const { goDetail, goSearch, goCart, goHome } = useAppNav()
  const { detail, status, error, retry } = useProductDetail(id)
  const cart = useCart()

  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<DetailTab>('overview')
  const { message: toast, showToast, dismiss: dismissToast } = useToast()
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  // 推荐位正在加购的商品 id：同时只允许一行在写，用于按钮文案与防重复提交
  const [addingRelated, setAddingRelated] = useState<number | null>(null)

  const gallery = detail?.gallery ?? []
  const skus = detail?.skus ?? []
  const highlights = detail?.highlights ?? []
  const specs = detail?.specs ?? []
  const related = detail?.related ?? []

  // 版本 / 颜色两级选择：先选版本，再在该版本的 SKU 里选颜色；未手动选时回落到首个可用 SKU
  const versions = useMemo(() => Array.from(new Set(skus.map((s) => s.version))), [skus])
  const activeVersion = selectedVersion && versions.includes(selectedVersion) ? selectedVersion : versions[0] ?? ''
  const versionSkus = useMemo(() => skus.filter((s) => s.version === activeVersion), [skus, activeVersion])
  const activeColor =
    selectedColor && versionSkus.some((s) => s.color === selectedColor)
      ? selectedColor
      : versionSkus[0]?.color ?? ''
  const selectedSku = versionSkus.find((s) => s.color === activeColor) ?? versionSkus[0] ?? null

  // 展示价 / 合计：优先取选中 SKU 价（随版本浮动），无 SKU 时回落到商品价
  const skuPrice = selectedSku ? Number(selectedSku.price) : NaN
  const price = Number.isFinite(skuPrice) ? formatMoney(skuPrice) : priceNumber(detail?.price)
  const unit = Number(price)
  const total = Number.isFinite(unit) ? formatMoney(unit * quantity) : price

  const inStock = selectedSku ? Number(selectedSku.stock) > 0 : true
  const canAdd = selectedSku != null && selectedSku.id > 0 && inStock && !cart.pending
  // 按钮文案只在写操作真的慢了时才切「处理中…」，禁用判定仍走实时的 cart.pending
  const adding = useDelayedFlag(cart.pending)

  // 画廊视图：选中 SKU 的颜色图排到首位（切颜色即换主图），其后是商品多视角
  const skuViews = selectedSku?.image ? [selectedSku.image, ...gallery] : gallery

  // 缩略图条：一排放不下时改用左右箭头翻页。箭头只在真的溢出时出现——出现后容器更窄、
  // 只会更溢出，不会出现「出现/消失」来回抖动；到边的箭头只是禁用，不影响布局。
  const thumbsRef = useRef<HTMLDivElement>(null)
  const [thumbsPaging, setThumbsPaging] = useState({ overflowing: false, canPrev: false, canNext: false })

  const measureThumbs = useCallback(() => {
    const box = thumbsRef.current
    if (!box) return
    const max = box.scrollWidth - box.clientWidth
    setThumbsPaging({
      overflowing: max > 1,
      canPrev: box.scrollLeft > 1,
      canNext: box.scrollLeft < max - 1,
    })
  }, [])

  const pageThumbs = (dir: 1 | -1) => {
    const box = thumbsRef.current
    if (!box) return
    // 留一张缩略图做视觉衔接，翻页后能看出没翻到同一批
    box.scrollBy({ left: dir * Math.max(box.clientWidth - 74, 64), behavior: 'smooth' })
  }

  useEffect(() => {
    measureThumbs()
    window.addEventListener('resize', measureThumbs)
    return () => window.removeEventListener('resize', measureThumbs)
  }, [measureThumbs, skuViews.length])

  // 换颜色后 activeImage 复位到 0，把当前选中的缩略图滚回可视范围
  useEffect(() => {
    const box = thumbsRef.current
    const thumb = box?.children[activeImage]
    thumb?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
  }, [activeImage, skuViews.length])

  // 切换商品（点推荐进新详情）时复位局部交互态，避免沿用上一个商品的选择
  useEffect(() => {
    setActiveImage(0)
    setQuantity(1)
    setTab('overview')
    dismissToast()
    setSelectedVersion(null)
    setSelectedColor(null)
    setAddingRelated(null)
  }, [id, dismissToast])

  // 详情页独立标题，离开时还原，避免污染其它页面标题
  useEffect(() => {
    document.title = detail?.name ? `${detail.name} - 商品详情` : '商品详情'
    return () => {
      document.title = HOME_TITLE
    }
  }, [detail?.name])

  const backToCategory = () => {
    if (detail?.category) goSearch({ keyword: '', category: detail.category, page: 1 })
    else goHome()
  }

  // 加入购物车 / 立即购买：写入后端购物车，失败时把后端文案回显到底部提示
  const handleAddToCart = async () => {
    if (!selectedSku || !canAdd) {
      showToast(inStock ? '暂不可加入购物车' : '该颜色/版本暂无货')
      return
    }
    try {
      await cart.addItem(selectedSku.id, quantity)
      showToast('已加入购物车')
    } catch (e) {
      showToast(`加入购物车失败：${errorMessage(e)}`)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedSku || !canAdd) {
      showToast(inStock ? '暂不可购买' : '该颜色/版本暂无货')
      return
    }
    try {
      await cart.addItem(selectedSku.id, quantity)
      goCart()
    } catch (e) {
      showToast(`加入购物车失败：${errorMessage(e)}`)
    }
  }

  /**
   * 推荐位 hover 按钮直接加购：列表项不带 SKU，先拉详情取首个有货规格写入购物车，
   * 避免为了加一件商品把用户整页跳走。
   */
  const handleRelatedAdd = async (item: SearchProductItem) => {
    if (addingRelated != null || cart.pending) return
    setAddingRelated(item.id)
    try {
      const full = await fetchProductDetail(item.id)
      const sku = full.skus.find((s) => Number(s.stock) > 0)
      if (!sku) {
        showToast('该商品暂无可购规格')
        return
      }
      await cart.addItem(sku.id, 1)
      showToast(`已加入购物车：${item.name}`)
    } catch (e) {
      showToast(`加入购物车失败：${errorMessage(e)}`)
    } finally {
      setAddingRelated(null)
    }
  }

  if (status === 'loading') {
    return <div className={`${styles.loading} container`}>商品详情加载中…</div>
  }

  if (status === 'error') {
    return (
      <div className={`${styles.state} container`} role="alert">
        <p>详情加载失败：{error?.message || '未知错误'}</p>
        <p className={styles.stateTip}>请确认商品服务（端口 8861）与商品库 MySQL 已启动，且该商品编号有效。</p>
        <div className={styles.stateActions}>
          <button type="button" className={styles.stateBtn} onClick={retry}>
            重新加载
          </button>
          <button type="button" className={styles.stateBtnGhost} onClick={goHome}>
            回到首页
          </button>
        </div>
      </div>
    )
  }

  // 后端商品不存在时返回 success=false（走上面的错误态），ready 态下 detail 必有值，此处只为 TS 收窄
  if (!detail) return null

  const mainImage = skuViews[Math.min(activeImage, skuViews.length - 1)] ?? skuViews[0]

  return (
    <div className={styles.detail}>
      <div className={`container ${styles.inner}`}>
        {/* 面包屑 */}
        <nav className={styles.crumb}>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              goHome()
            }}
          >
            首页
          </a>
          <IconArrowRight width={12} height={12} />
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              backToCategory()
            }}
          >
            {detail.categoryName || '商品'}
          </a>
          <IconArrowRight width={12} height={12} />
          <span className={styles.crumbCurrent}>{detail.name}</span>
        </nav>

        {/* 上部：画廊 + 购买信息 */}
        <div className={styles.top}>
          <div className={styles.gallery}>
            <div className={styles.stage}>
              {detail.tag ? <span className={styles.stageTag}>{detail.tag}</span> : null}
              <img src={mainImage} alt={detail.name} />
            </div>
            {skuViews.length > 1 ? (
              <div className={styles.thumbsRow}>
                {thumbsPaging.overflowing ? (
                  <button
                    type="button"
                    className={`${styles.thumbsArrow} ${styles.thumbsArrowPrev}`}
                    onClick={() => pageThumbs(-1)}
                    disabled={!thumbsPaging.canPrev}
                    aria-label="上一批图片"
                  >
                    <IconChevronLeft width={14} height={14} />
                  </button>
                ) : null}
                <div className={styles.thumbs} ref={thumbsRef} onScroll={measureThumbs}>
                  {skuViews.map((src, index) => (
                    <button
                      type="button"
                      key={`${src}-${index}`}
                      className={index === activeImage ? styles.thumbActive : styles.thumb}
                      onClick={() => setActiveImage(index)}
                      aria-label={`查看第 ${index + 1} 张图`}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
                {thumbsPaging.overflowing ? (
                  <button
                    type="button"
                    className={`${styles.thumbsArrow} ${styles.thumbsArrowNext}`}
                    onClick={() => pageThumbs(1)}
                    disabled={!thumbsPaging.canNext}
                    aria-label="下一批图片"
                  >
                    <IconChevronRight width={14} height={14} />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className={styles.info}>
            <h1 className={styles.name}>{detail.name}</h1>
            {detail.subtitle ? <p className={styles.subtitle}>{detail.subtitle}</p> : null}

            <div className={styles.priceBox}>
              <div className={styles.priceWrap}>
                <span className={styles.priceSymbol}>¥</span>
                <span className={styles.priceValue}>{price}</span>
                {detail.tag ? <span className={styles.priceTag}>{detail.tag}</span> : null}
              </div>
              {detail.sales != null ? <p className={styles.sales}>已售 {formatSales(detail.sales)} 件</p> : null}
            </div>

            {highlights.length ? (
              <ul className={styles.highlights}>
                {highlights.map((h, i) => (
                  <li key={`${h}-${i}`}>{h}</li>
                ))}
              </ul>
            ) : null}

            {versions.length > 1 ? (
              <div className={styles.option}>
                <span className={styles.selectedLabel}>选择版本</span>
                <div className={styles.optionChips}>
                  {versions.map((v) => (
                    <button
                      type="button"
                      key={v}
                      className={v === activeVersion ? styles.chipActive : styles.chip}
                      onClick={() => {
                        setSelectedVersion(v)
                        setSelectedColor(null)
                        setActiveImage(0)
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {versionSkus.length > 1 ? (
              <div className={styles.option}>
                <span className={styles.selectedLabel}>选择颜色</span>
                <div className={styles.swatches}>
                  {versionSkus.map((s) => (
                    <button
                      type="button"
                      key={s.color}
                      title={s.stock > 0 ? s.color : `${s.color}（无货）`}
                      className={s.color === activeColor ? styles.swatchActive : styles.swatch}
                      onClick={() => {
                        setSelectedColor(s.color)
                        setActiveImage(0)
                      }}
                    >
                      <span className={styles.swatchDot} style={{ background: s.colorHex || '#eee' }} />
                      <em>{s.color}</em>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={styles.selected}>
              <span className={styles.selectedLabel}>已选</span>
              <span className={styles.selectedValue}>
                {detail.name}
                {activeVersion ? ` · ${activeVersion}` : ''}
                {activeColor ? ` · ${activeColor}` : ''} · ¥{price} · {quantity} 件
              </span>
            </div>

            <div className={styles.qtyRow}>
              <span className={styles.selectedLabel}>数量</span>
              <div className={styles.stepper}>
                <button
                  type="button"
                  className={styles.stepBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="减少数量"
                >
                  −
                </button>
                <span className={styles.stepValue}>{quantity}</span>
                <button
                  type="button"
                  className={styles.stepBtn}
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="增加数量"
                >
                  +
                </button>
              </div>
            </div>

            <p className={styles.total}>
              合计：<em>¥{total}</em>
            </p>

            <div className={styles.ctas}>
              <button type="button" className={styles.cartBtn} disabled={!canAdd} onClick={handleAddToCart}>
                {adding ? '处理中…' : '加入购物车'}
              </button>
              <button type="button" className={styles.buyBtn} disabled={!canAdd} onClick={handleBuyNow}>
                立即购买
              </button>
            </div>

            <ul className={styles.services}>
              {SERVICE_ITEMS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 中部：标签页 */}
        <div className={styles.tabs} role="tablist">
          {TABS.map((t) => (
            <button
              type="button"
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={tab === t.key ? styles.tabActive : styles.tab}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          {tab === 'overview' ? (
            <div className={styles.overview}>
              {highlights.length ? (
                <div className={styles.leader}>
                  {highlights.map((h, i) => (
                    <span key={`${h}-${i}`} className={styles.leaderChip}>
                      {h}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className={styles.leadText}>{detail.subtitle || detail.name}</p>
              {detail.poster ? <img className={styles.banner} src={detail.poster} alt={detail.name} loading="lazy" /> : null}
            </div>
          ) : null}

          {tab === 'specs' ? (
            <table className={styles.specs}>
              <tbody>
                {specs.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {tab === 'service' ? (
            <ul className={styles.serviceList}>
              {SERVICE_ITEMS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* 底部：同类推荐 */}
        {related.length ? (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>购买过的用户还喜欢</h2>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <div className={styles.relatedCard} key={item.id}>
                  <a
                    className={styles.relatedCardLink}
                    href="#top"
                    onClick={(e) => {
                      e.preventDefault()
                      goDetail(item.id)
                    }}
                  >
                    <div className={styles.relatedMedia}>
                      <img src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <h3 className={styles.relatedName}>{item.name}</h3>
                    <p className={styles.relatedDesc}>{item.desc}</p>
                    <p className={styles.relatedPrice}>{item.price}</p>
                  </a>
                  {/* hover / 键盘聚焦时从底部推进来，正好盖住价格行 */}
                  <button
                    type="button"
                    className={styles.relatedAdd}
                    disabled={addingRelated != null || cart.pending}
                    onClick={() => handleRelatedAdd(item)}
                  >
                    {addingRelated === item.id ? '处理中…' : '加入购物车'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <Toast message={toast} />
    </div>
  )
}
