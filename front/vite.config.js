import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // 将类名里的分隔符（_ 与 -）折叠为 camelCase，便于 styles.heroMenuItem 这样的点访问
      // 例：hero__menu-item → heroMenuItem，chat-avatar--ai → chatAvatarAi，is-open → isOpen
      localsConvention: (className) =>
        className.replace(/[_-]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase()),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
})