# 前后端拆分 + 后端 Maven 多模块化（微服务就绪）

## Context

当前 Spring Boot 后端（聊天服务，端口 8860）以 `xiaomi-chat-server/` 子目录嵌在前端 React 仓库 `d:\web-in-action\front\react\xiaomi-website` 内（git 未跟踪）。用户要求前后端拆分，且后端需具备后续微服务拆分能力。

已确认决策：
- 新位置：`d:\web-in-action\back\java\xiaomi-backend`（与 `front\react` 目录约定对称）
- 结构：Maven 多模块（父 POM + chat-api + chat-service）
- Git：后端 git init + 初始提交

耦合点已排查（代码零引用，仅 3 处工程级耦合）：目录嵌套、`.gitignore` Java 段、`.dockerignore` 未排除后端目录。

## 目标结构

```
d:\web-in-action\back\java\xiaomi-backend\
├── pom.xml                  # 父 POM：packaging=pom，继承 spring-boot-starter-parent 3.5.0，modules 声明
├── .mvn\                    # 整体迁自 xiaomi-chat-server/.mvn（settings.xml 阿里云镜像 + maven.config）
├── .gitignore               # 新建：target/、*.class、.idea/ 等 Java 忽略项
├── Dockerfile               # 新建：多阶段构建（maven:3.9-temurin-17 → eclipse-temurin:17-jre），服务独立部署
├── xiaomi-chat-api\         # 接口契约模块（纯 jar，无 Spring 依赖）
│   ├── pom.xml              # 依赖：jackson-annotations + jakarta.validation-api（版本由 BOM 管理）
│   └── src\main\java\com\xiaomi\chat\api\   # ChatRequest / ChatChunk / ChatRole / ChatStatus（包名改为 com.xiaomi.chat.api）
└── xiaomi-chat-service\     # 可运行服务（Spring Boot）
    ├── pom.xml              # 原 starter 依赖 + 新增 com.xiaomi:xiaomi-chat-api + spring-boot-maven-plugin
    └── src\                 # 原 src 原样迁入，包结构不变（config/llm/service/session/web + ChatServerApplication）
                            # resources/application.yml 原样迁入（8860 端口、CORS、LLM 配置均不动）
```

微服务演进路径：后续新增服务 = 新增兄弟模块（如 xiaomi-order-service），共享契约直接依赖对应 api 模块。

## 实施步骤

1. **创建后端骨架**：`xiaomi-backend` 根 + 两个模块目录；迁移 `.mvn\`。
2. **迁移源码**：
   - `model/` 4 个类 → `xiaomi-chat-api/src/main/java/com/xiaomi/chat/api/`，包声明 `com.xiaomi.chat.model` → `com.xiaomi.chat.api`
   - 其余 `src/` + `application.yml` → `xiaomi-chat-service/`，原样不动
3. **三个 POM**（如上目标结构所述；子模块 parent 指向 xiaomi-backend）。
4. **修 import**（仅 3 文件 4 行，已 grep 确认无遗漏）：
   - `ChatController.java`：ChatRequest
   - `ChatService.java`：ChatChunk、ChatRequest
   - `session/ChatMessage.java`：ChatRole
   - 统一改为 `com.xiaomi.chat.api.*`
5. **后端 .gitignore + Dockerfile**。
6. **前端清理**：
   - 删除 `xiaomi-chat-server/` 残留目录
   - [.gitignore](file:///d:/web-in-action/front/react/xiaomi-website/.gitignore) 删除 Java 段（第 9-11 行：注释 + `target/` + `*.class`）
   - `.dockerignore` 无需改（后端移走后自然不在构建上下文）
   - 前端仓库**不做提交**（用户未要求；已有未提交改动保持原状）
7. **后端 git init + 初始提交**，提交信息风格沿用现有约定：`feat: 从前端仓库迁出并重构为 Maven 多模块工程（chat-api + chat-service）`

## 验证

1. **构建**：backend 根目录执行 `& C:\Users\Administrator\tools\apache-maven-3.9.9\bin\mvn.cmd -q -DskipTests package`（`.mvn/maven.config` 自动带 `-s`），确认 api jar + service 可执行 jar 均产出。
2. **运行 + 接口回归**：
   - 先检查 8860 端口占用：若旧实例仍在跑（即被迁移的原服务），停止后从新目录启动（`java -jar xiaomi-chat-service\target\*.jar`）——该进程就是本次迁移对象，重启属预期
   - 回归脚本（%TEMP% 下，来自上轮联调）：`java-chat-test.cjs`（兜底模式 7 项）、`mock-openai-llm.cjs`（8872 mock LLM）+ `java-chat-llm-test.cjs`（LLM 模式，用 `SPRING_APPLICATION_JSON` 覆盖 base-url/api-key）、`java-chat-401-test.cjs`
3. **前端**：`npm run build` 确认无破坏（前端代码本就零引用后端目录）。

## 注意事项（来自项目记忆）

- 起服务前必须杀 8860 残留进程，否则旧进程截胡导致测试打到旧服务
- LLM 配置覆盖用 `$env:SPRING_APPLICATION_JSON`（env 松散绑定 base-url 不可靠）
- 迁移源码时保持原样（历史坑：文本块 `\` 续行、lambda 自引用等），不做顺手重构
