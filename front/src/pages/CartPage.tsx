import { useEffect } from 'react'
import { ConfigProvider, Modal } from 'antd'
import { IconArrowRight } from '../components/Icons'
import Toast from '../components/Toast'
import useAppNav from '../hooks/useAppNav'
import useCart from '../hooks/useCart'
import useToast from '../hooks/useToast'
import type { CartItem } from '../types/cart'
import { errorMessage } from '../utils/error'
import styles from './CartPage.module.less'

const HOME_TITLE = '小米商城 - 小米手机 | 智能家电 | 官方正品'

/** 金额格式化：去掉浮点尾数，6499.00 -> 6499，99.9 -> 99.9 */
function money(value: number | string): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'
  return String(Number(n.toFixed(2)))
}

/**
 * 购物车页（路由：/cart，参考 mi.com/shop/buy/cart）。
 * 数据来自全局 CartProvider（后端持久化），本组件负责列表展示与增减/删除/清空/结算交互；
 * 继续购物 / 去逛逛 / 回首页交给 useAppNav。
 */
export default function CartPage() {
  const { goDetail, goSearch, goHome } = useAppNav()
  const { items, count, totalAmount, status, error, pending, reload, setQuantity, removeItem, clear } = useCart()
  const { message: toast, showToast } = useToast()
  // useModal 的实例跟随页面上下文（静态 Modal.confirm 会吃不到主题配置并告警）
  const [modal, modalContextHolder] = Modal.useModal()

  // 购物车页独立标题，离开时还原
  useEffect(() => {
    document.title = '我的购物车'
    return () => {
      document.title = HOME_TITLE
    }
  }, [])

  const changeQty = (item: CartItem, next: number) => {
    if (pending) return
    setQuantity(item.skuId, next).catch((e) => showToast(`操作失败：${errorMessage(e)}`))
  }

  const handleRemove = (item: CartItem) => {
    if (pending) return
    // 删除是不可撤销的写操作，先二次确认；onOk 返回 Promise，确认框在请求期间自带 loading
    modal.confirm({
      title: '从购物车移除',
      content: `确定移除「${item.name}」吗？`,
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => removeItem(item.skuId).catch((e) => showToast(`删除失败：${errorMessage(e)}`)),
    })
  }

  const handleClear = () => {
    if (pending || items.length === 0) return
    modal.confirm({
      title: '清空购物车',
      content: `确定移除全部 ${count} 件商品吗？`,
      okText: '清空',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => clear().catch((e) => showToast(`清空失败：${errorMessage(e)}`)),
    })
  }

  const handleCheckout = () => {
    showToast('结算 / 支付为演示功能，暂未接入真实下单流程')
  }

  const openItem = (item: CartItem) => {
    if (item.productId) goDetail(item.productId)
  }

  if (status === 'error' && items.length === 0) {
    return (
      <div className={`${styles.state} container`} role="alert">
        <p>购物车加载失败：{error?.message || '未知错误'}</p>
        <p className={styles.stateTip}>请确认商品服务（端口 8861）与商品库 MySQL 已启动。</p>
        <div className={styles.stateActions}>
          <button type="button" className={styles.stateBtn} onClick={reload}>
            重新加载
          </button>
          <button type="button" className={styles.stateBtnGhost} onClick={goHome}>
            回到首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cart}>
      <div className={`container ${styles.inner}`}>
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
          <span>购物车</span>
        </nav>

        <div className={styles.head}>
          <h1 className={styles.headTitle}>我的购物车</h1>
          <p className={styles.headCount} role="status">
            共 <em>{count}</em> 件商品
          </p>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>购物车还是空的，去挑几件心动好物吧～</p>
            <div className={styles.stateActions}>
              <button type="button" className={styles.stateBtn} onClick={() => goSearch({ keyword: '', category: '', page: 1 })}>
                去逛逛
              </button>
              <button type="button" className={styles.stateBtnGhost} onClick={goHome}>
                回到首页
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 仅初次加载 / 手动重载时整块置灰；改数量等写操作只禁用按钮，避免列表瞬间变暗闪动 */}
            <div className={`${styles.list} ${status === 'loading' ? styles.listBusy : ''}`}>
              <div className={`${styles.rowHead} ${styles.grid}`}>
                <span>商品</span>
                <span>单价</span>
                <span>数量</span>
                <span>小计</span>
                <span>操作</span>
              </div>
              {items.map((item) => (
                <div className={styles.row} key={item.id}>
                  <div className={`${styles.grid} ${styles.rowBody}`}>
                    <div className={styles.product}>
                      <a className={styles.productMedia} href="#top" onClick={(e) => { e.preventDefault(); openItem(item) }}>
                        <img src={item.image} alt={item.name} loading="lazy" />
                      </a>
                      <div className={styles.productInfo}>
                        <a className={styles.productName} href="#top" onClick={(e) => { e.preventDefault(); openItem(item) }}>
                          {item.name}
                        </a>
                        <p className={styles.productSku}>
                          {[item.version, item.color].filter(Boolean).join(' / ')}
                          {item.colorHex ? (
                            <span className={styles.skuDot} style={{ background: item.colorHex }} aria-hidden />
                          ) : null}
                        </p>
                      </div>
                    </div>

                    <div className={styles.price}>¥{money(item.price)}</div>

                    <div className={styles.qty}>
                      <div className={styles.stepper}>
                        <button type="button" className={styles.stepBtn} disabled={pending} onClick={() => changeQty(item, item.quantity - 1)} aria-label="减少数量">
                          −
                        </button>
                        <span className={styles.stepValue}>{item.quantity}</span>
                        <button type="button" className={styles.stepBtn} disabled={pending} onClick={() => changeQty(item, item.quantity + 1)} aria-label="增加数量">
                          +
                        </button>
                      </div>
                    </div>

                    <div className={styles.subtotal}>¥{money(Number(item.price) * item.quantity)}</div>

                    <div className={styles.ops}>
                      <button type="button" className={styles.removeBtn} disabled={pending} onClick={() => handleRemove(item)}>
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.checkout}>
              <button type="button" className={styles.clearBtn} disabled={pending} onClick={handleClear}>
                清空购物车
              </button>
              <div className={styles.summary}>
                <span>
                  合计（不含运费）：<em>¥{money(totalAmount)}</em>
                </span>
                <button type="button" className={styles.settleBtn} disabled={pending} onClick={handleCheckout}>
                  去结算
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 确认框主题跟站点一致（小米橙），只包住 contextHolder */}
      <ConfigProvider theme={{ token: { colorPrimary: '#ff6700', borderRadius: 4 } }}>
        {modalContextHolder}
      </ConfigProvider>
      <Toast message={toast} />
    </div>
  )
}
