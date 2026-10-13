import { useEffect, useMemo, useRef, useState } from 'react'
import { debounce } from 'lodash-es'
import { suggestProducts } from '../api/products'

/** 输入停止多久后才发联想请求（毫秒） */
const DEBOUNCE_MS = 300

/**
 * 搜索框联想词 Hook：用 lodash-es 的 debounce 收拢输入，连续输入只在停止 DEBOUNCE_MS 后
 * 请求一次；每次真正发请求前取消上一次的在途请求，避免慢响应覆盖新结果。
 *
 * 联想失败按「没有候选」处理（不打断输入，也不弹错误提示）。
 */
export default function useSuggestions(keyword: string): string[] {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const controllerRef = useRef<AbortController | null>(null)

  // 依赖为空的 useMemo：整个挂载期只建一个防抖函数，卸载时 cancel()
  const fetchSuggestions = useMemo(
    () =>
      debounce((text: string) => {
        controllerRef.current?.abort()
        const controller = new AbortController()
        controllerRef.current = controller
        suggestProducts(text, controller.signal)
          .then((list) => {
            if (!controller.signal.aborted) setSuggestions(Array.isArray(list) ? list : [])
          })
          .catch(() => {
            if (!controller.signal.aborted) setSuggestions([])
          })
      }, DEBOUNCE_MS),
    [],
  )

  useEffect(() => {
    const text = keyword.trim()
    if (!text) {
      // 清空输入时立刻收起下拉，不等防抖窗口
      fetchSuggestions.cancel()
      setSuggestions([])
      return
    }
    fetchSuggestions(text)
  }, [keyword, fetchSuggestions])

  useEffect(
    () => () => {
      fetchSuggestions.cancel()
      controllerRef.current?.abort()
    },
    [fetchSuggestions],
  )

  return suggestions
}
