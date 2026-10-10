/**
 * 商品服务配置。
 * 与聊天接口一致：地址可通过 .env.local 的 VITE_PRODUCT_API_URL 覆盖（本地联调用），
 * 兜底值指向本地后端 back/xiaomi-product-service（application.yml 端口 8861，接口 GET /api/products/sections）。
 */
export const PRODUCT_API_URL =
  import.meta.env?.VITE_PRODUCT_API_URL || 'http://localhost:8861/api/products/sections'
