# syntax=docker/dockerfile:1

# ---------- 阶段 1：构建前端 ----------
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制依赖清单，利用 Docker 层缓存（依赖不变则跳过安装）
COPY package.json package-lock.json ./
# 执行 npm ci 安装依赖：严格依据 package-lock.json 锁定版本安装，确保依赖版本完全一致；比 npm install 更适合 Docker 构建/CI 场景（速度更快、结果可复现）
RUN npm ci

# 再复制源码并构建
COPY . .
RUN npm run build

# ---------- 阶段 2：nginx 运行时 ----------
FROM nginx:1.27-alpine

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 仅复制构建产物（最终镜像不含 node_modules / 源码，体积小）
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
