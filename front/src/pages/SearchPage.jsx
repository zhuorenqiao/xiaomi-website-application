import { useEffect, useMemo } from 'react'
import { ConfigProvider, Pagination } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import useProductSearch from '../hooks/useProductSearch.js'
import { PAGE_SIZE_OPTIONS } from '../utils/productConfig.js'
import { IconArrowRight } from '../components/Icons.jsx'
import styles from './SearchPage.module.less'

const HOME_TITLE = '小米商城 - 小米手机 | 智能家电 | 官方正品'

/** 排序项：价格档位在激活时再次点击可切换升 / 降序（与小米商城搜索页一致） */
const SORTS = [
  { value: 'default', label: '综合' },
  { value: 'sales', label: '销量' },
  { value: 'price', label: '价格' },
]

/** 销量文案：386000 -> 38.6万，渲染成「已售 38.6万件」 */
function formatSales(sales) {
  const value = Number(sales) || 0
  return value >= 10000 ? `${(value / 10000).toFixed(1)}万` : String(value)
}

/**
 * 商品搜索 / 分类浏览列表页（路由：?keyword= / ?category=）。
 * 查询条件全部来自地址栏（见 useAppRoute），本组件只负责展示与「改哪个条件」。
 * 与首页共用统一的路由入参，各自取用所需字段。
 *
 * @param {{keyword: string, category: string, sort: string, page: number, size: number}} query 当前查询条件
 * @param {(patch: object) => void} goSearch 局部更新查询条件并留在列表页（切换分类/排序/每页条数时一并把 page 归 1）
 * @param {() => void} goHome 返回首页
 */
export default function SearchPage({ query, goSearch, goHome }) {
  const { keyword, category, sort, page, size } = query
  const { result, status, error, retry } = useProductSearch(query)

  const items = result?.items ?? []
  const facets = result?.categories ?? []
  const total = Number(result?.total) || 0
  const facetTotal = useMemo(() => facets.reduce((sum, item) => sum + (Number(item.count) || 0), 0), [facets])
  const loading = status === 'loading'

  const categoryName = facets.find((item) => item.code === category)?.name
  const heading = keyword || categoryName || '全部商品'
  const isPriceSort = sort === 'price_asc' || sort === 'price_desc'

  // 搜索页独立标题，离开时还原，避免首页也挂着关键词
  useEffect(() => {
    document.title = `${heading} - 商品搜索`
    return () => {
      document.title = HOME_TITLE
    }
  }, [heading])

  const handleSort = (value) => {
    if (value === 'price') {
      goSearch({ sort: sort === 'price_asc' ? 'price_desc' : 'price_asc', page: 1 })
      return
    }
    goSearch({ sort: value, page: 1 })
  }

  return (
    <div className={styles.search} id="search-results">
      <div className={`container ${styles.searchInner}`}>
        <div className={styles.searchCrumb}>
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
          <span>商品搜索</span>
        </div>

        <div className={styles.searchHead}>
          <h1 className={styles.searchHeadTitle}>
            {heading}
            {keyword || categoryName ? <span className={styles.searchHeadSub}>搜索结果</span> : null}
          </h1>
          <p className={styles.searchHeadCount} role="status" aria-live="polite">
            {loading && !result ? (
              '正在搜索…'
            ) : (
              <>
                共为你找到 <em>{total}</em> 件相关商品
              </>
            )}
          </p>
        </div>

        <div className={styles.searchFilters}>
          <div className={styles.searchFilterRow}>
            <span className={styles.searchFilterLabel}>分类</span>
            <div className={styles.searchChips}>
              <button
                type="button"
                className={category ? styles.searchChip : styles.searchChipActive}
                onClick={() => goSearch({ category: '', page: 1 })}
              >
                全部
                {facetTotal > 0 ? <i>{facetTotal}</i> : null}
              </button>
              {facets.map((item) => (
                <button
                  type="button"
                  key={item.code}
                  className={item.code === category ? styles.searchChipActive : styles.searchChip}
                  onClick={() => goSearch({ category: item.code, page: 1 })}
                >
                  {item.name}
                  {item.count > 0 ? <i>{item.count}</i> : null}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.searchFilterRow}>
            <span className={styles.searchFilterLabel}>排序</span>
            <div className={styles.searchSorts}>
              {SORTS.map((item) => {
                const active = item.value === 'price' ? isPriceSort : sort === item.value
                return (
                  <button
                    type="button"
                    key={item.value}
                    className={active ? styles.searchSortActive : styles.searchSort}
                    onClick={() => handleSort(item.value)}
                  >
                    {item.label}
                    {item.value === 'price' && active ? (
                      <span className={styles.searchSortArrow}>{sort === 'price_asc' ? '↑' : '↓'}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {status === 'error' ? (
          <div className={styles.searchState}>
            <p>商品列表加载失败：{error?.message || '未知错误'}</p>
            <p className={styles.searchStateTip}>请确认商品服务（端口 8861）与商品库 MySQL 已启动。</p>
            <button type="button" className={styles.searchStateBtn} onClick={retry}>
              重新加载
            </button>
          </div>
        ) : (
          <>
            <div className={`${styles.searchGrid} ${loading ? styles.searchGridLoading : ''}`}>
              {items.map((item) => (
                <a className={styles.searchCard} href="#search-results" key={`${item.category}-${item.name}`}>
                  {item.tag ? <span className={styles.searchCardTag}>{item.tag}</span> : null}
                  <div className={styles.searchCardMedia}>
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <h3 className={styles.searchCardName}>{item.name}</h3>
                  <p className={styles.searchCardDesc}>{item.desc}</p>
                  <p className={styles.searchCardMeta}>
                    <span>{item.brand}</span>
                    {item.sales != null ? <span>已售 {formatSales(item.sales)}件</span> : null}
                  </p>
                  <p className={styles.searchCardPrice}>{item.price}</p>
                </a>
              ))}
              {!loading && items.length === 0 ? (
                <div className={styles.searchEmpty}>
                  <p>
                    没有找到与{keyword ? `“${keyword}”` : '当前条件'}相关的商品
                  </p>
                  <p className={styles.searchEmptyTip}>换个关键词试试，例如：电视、手机、路由器</p>
                  <button type="button" className={styles.searchStateBtn} onClick={goHome}>
                    回到首页
                  </button>
                </div>
              ) : null}
            </div>

            {total > 0 ? (
              <div className={styles.searchPager}>
                <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#ff6700', borderRadius: 4 } }}>
                  <Pagination
                    current={result?.page ?? page}
                    pageSize={result?.size ?? size}
                    total={total}
                    showSizeChanger
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    showQuickJumper
                    showTotal={(count, range) => `第 ${range[0]}-${range[1]} 件 / 共 ${count} 件`}
                    onChange={(nextPage, nextSize) => goSearch({ page: nextPage, size: nextSize })}
                    disabled={loading}
                  />
                </ConfigProvider>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
