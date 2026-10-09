/**
 * 聊天应用的类型定义（JSDoc）。
 * 模块化组织：types/ 只存放协议与数据结构，不包含任何逻辑。
 */

/**
 * 消息角色
 * @typedef {'assistant' | 'user'} ChatRole
 */

/**
 * 接口返回状态
 * @typedef {'success' | 'error'} ChatChunkStatus
 */

/**
 * 发送给接口的请求体
 * @typedef {Object} ChatRequestBody
 * @property {string} query 用户输入
 * @property {string} [sessionId] 会话 ID，用于服务端关联上下文
 */

/**
 * 接口流式响应的单个数据块（SSE data 行反序列化结果）
 * @typedef {Object} ChatResponseChunk
 * @property {string} content 增量文本
 * @property {string} time 服务端时间
 * @property {ChatChunkStatus} status success 表示正常数据，error 表示服务端异常
 * @property {ChatRole} role 该数据块归属的角色
 */

/**
 * 渲染气泡用的内部消息结构（协议字段 + 客户端附加字段）
 * @typedef {Object} ChatMessage
 * @property {ChatRole} role 消息归属角色
 * @property {string} content 消息文本（流式过程中逐步增长）
 * @property {string} [time] 时间文本（HH:mm）
 * @property {string} [query] 触发该条 assistant 消息的用户输入（用于“重新生成”）
 * @property {string} [error] 用户可读的错误文案（出现后气泡展示错误态）
 * @property {boolean} [aborted] 是否被用户手动停止
 */

/**
 * 会话（对应 Ant Design X Conversations 组件的数据项）
 * @typedef {Object} ChatSession
 * @property {string} key 会话唯一标识
 * @property {string} label 会话标题
 * @property {number} createdAt 创建时间戳
 * @property {boolean} [pinned] 是否置顶
 * @property {number} [pinnedAt] 置顶时间戳（多个置顶会话之间按此倒序）
 */

export {};
