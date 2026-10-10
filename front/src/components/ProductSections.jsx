import ProductSection from './ProductSection.jsx'
import useProducts from '../hooks/useProducts.js'
import styles from './ProductSections.module.less'

/**
 * 首页商品栏目容器：从商品微服务拉取列表并渲染，处理加载中 / 失败重试两种状态。
 * 展示逻辑仍由无状态的 ProductSection 负责，本组件只做数据接入与状态编排。
 * @param {(section: object) => void} [onViewAll] 「查看全部」回调，由 App 传入（跳转分类列表页）
 * @param {(id: number) => void} [onOpen] 商品点击回调，传入商品主键跳详情页
 */
export default function ProductSections({ onViewAll, onOpen }) {
  const { sections, status, reload } = useProducts()

  if (status === 'loading') {
    return (
      <div className={styles.state} role="status" aria-live="polite">
        商品加载中…
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={styles.state}>
        <p>商品列表加载失败，请检查商品服务是否已启动。</p>
        <button type="button" className={styles.retry} onClick={reload}>
          重新加载
        </button>
      </div>
    )
  }

  return (
    <>
      {sections.map((section) => (
        <ProductSection key={section.id} section={section} onViewAll={onViewAll} onOpen={onOpen} />
      ))}
    </>
  )
}
