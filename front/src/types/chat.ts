/**
 * 聊天应用的协议与数据结构。
 * 模块化组织：types/ 只存放协议与数据结构，不包含任何逻辑。
 */
import type { MessageInfo } from '@ant-design/x-sdk'

/** 消息角色 */
export type ChatRole = 'assistant' | 'user'

/** 接口返回状态 */
export type ChatChunkStatus = 'success' | 'error'

/** 发送给接口的请求体 */
export interface ChatRequestBody {
  /** 用户输入 */
  query: string
  /** 会话 ID，用于服务端关联上下文 */
  sessionId?: string
}

/** 接口流式响应的单个数据块（SSE data 行反序列化结果） */
export interface ChatResponseChunk {
  /** 增量文本 */
  content: string
  /** 服务端时间 */
  time: string
  /** success 表示正常数据，error 表示服务端异常 */
  status: ChatChunkStatus
  /** 该数据块归属的角色 */
  role: ChatRole
}

/** 渲染气泡用的内部消息结构（协议字段 + 客户端附加字段） */
export interface ChatMessage {
  /** 消息归属角色 */
  role: ChatRole
  /** 消息文本（流式过程中逐步增长） */
  content: string
  /** 时间文本（HH:mm） */
  time?: string
  /** 触发该条 assistant 消息的用户输入（用于「重新生成」） */
  query?: string
  /** 用户可读的错误文案（出现后气泡展示错误态） */
  error?: string
  /** 是否被用户手动停止 */
  aborted?: boolean
}

/** 会话（对应 Ant Design X Conversations 组件的数据项） */
export interface ChatSession {
  /** 会话唯一标识 */
  key: string
  /** 会话标题 */
  label: string
  /** 创建时间戳 */
  createdAt: number
  /** 是否置顶 */
  pinned?: boolean
  /** 置顶时间戳（多个置顶会话之间按此倒序） */
  pinnedAt?: number
}

/** useXChat 产出的一条消息 */
export type ChatMessageInfo = MessageInfo<ChatMessage>

/** localStorage 中持久化的消息（落盘只保留这三个字段） */
export type StoredChatMessage = Pick<ChatMessageInfo, 'id' | 'message' | 'status'>
