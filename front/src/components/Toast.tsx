import styles from './Toast.module.less'

/** 底部居中的轻提示：纯展示（pointer-events: none），不占文档流 */
export default function Toast({ message }: { message: string }) {
  if (!message) return null

  return (
    <p className={styles.toast} role="status" aria-live="polite">
      {message}
    </p>
  )
}
