import { useCallback, useEffect, useState } from 'react'

/** 提示自动收起时长（毫秒） */
const TOAST_DURATION = 2600

/**
 * 底部轻提示的文本状态：showToast(text) 弹一条，若干秒后自动收起。
 * 与 Toast 组件配套（fixed 定位、不占文档流），避免提示插入把下方内容顶开。
 */
export default function useToast() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(() => setMessage(''), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [message])

  const dismiss = useCallback(() => setMessage(''), [])

  return { message, showToast: setMessage, dismiss }
}
