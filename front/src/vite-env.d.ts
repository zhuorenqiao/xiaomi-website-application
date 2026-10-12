/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 聊天接口地址覆盖（本地联调），见 utils/chatConfig.ts */
  readonly VITE_CHAT_API_URL?: string
  /** 商品接口基址覆盖（本地联调），见 utils/productConfig.ts */
  readonly VITE_PRODUCT_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
