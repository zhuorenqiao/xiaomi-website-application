# syntax=docker/dockerfile:1

# ---------- 阶段 1：Maven 构建（.mvn/settings.xml 使用阿里云镜像加速依赖下载） ----------
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /build

# 先复制 POM 清单，利用 Docker 层缓存（依赖不变则跳过下载）
COPY pom.xml ./
COPY .mvn .mvn
COPY xiaomi-chat-api/pom.xml xiaomi-chat-api/
COPY xiaomi-chat-service/pom.xml xiaomi-chat-service/
RUN mvn -q -DskipTests dependency:go-offline || true

# 再复制源码并打包
COPY xiaomi-chat-api/src xiaomi-chat-api/src
COPY xiaomi-chat-service/src xiaomi-chat-service/src
RUN mvn -q -DskipTests package

# ---------- 阶段 2：JRE 运行时 ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# 仅复制可执行 jar（最终镜像不含 Maven / 源码，体积小）
COPY --from=builder /build/xiaomi-chat-service/target/xiaomi-chat-service-*.jar app.jar

EXPOSE 8860

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
