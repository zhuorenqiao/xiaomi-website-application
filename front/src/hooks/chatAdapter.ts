/**
 * 自定义 ChatProvider：把小米聊天接口的流式协议适配到 Ant Design X 的数据流。
 *
 * 接口协议：
 * - 请求体：{ query: string, sessionId?: string }
 * - 响应（SSE，每条 data 行为一个 JSON）：
 *   { content: string, time: string, status: 'success' | 'error', role: 'assistant' | 'user' }
 *
 * 实现方式：
 * - XRequest（@ant-design/x-sdk）负责发起 POST、建立 SSE 连接并按块回调；
 * - XiaomiChatProvider（继承 AbstractChatProvider）负责把请求参数 /
 *   本地用户消息 / SSE 数据块转换成 Ant Design X 的消息结构。
 */
import { AbstractChatProvider, XRequest } from '@ant-design/x-sdk'
import type { AbstractXRequestClass, SSEOutput, TransformMessage } from '@ant-design/x-sdk'
import type { ChatMessage, ChatRequestBody, ChatResponseChunk } from '../types/chat'
import {
  CHAT_API_URL,
  EMPTY_REPLY_TEXT,
  REQUEST_TIMEOUT,
  SERVER_ERROR_TEXT,
  STREAM_TIMEOUT,
  nowTimeText,
} from '../utils/chatConfig'

/**
 * 解析 SSE 数据块（data 字段为 JSON 字符串）。
 * 心跳、注释行等非 JSON 内容返回 null，由调用方忽略。
 */
function parseChunk(chunk?: SSEOutput): ChatResponseChunk | null {
  const data = chunk?.data
  if (typeof data !== 'string' || data.trim() === '') return null
  try {
    return JSON.parse(data) as ChatResponseChunk
  } catch {
    return null
  }
}

export class XiaomiChatProvider extends AbstractChatProvider<ChatMessage, ChatRequestBody, SSEOutput> {
  /**
   * onRequest 传入的参数 → 实际请求体 { query, sessionId }
   */
  transformParams(requestParams: Partial<ChatRequestBody>): ChatRequestBody {
    return {
      query: requestParams?.query ?? '',
      sessionId: requestParams?.sessionId || undefined,
    }
  }

  /**
   * 用户输入 → 本地用户消息（立即渲染成用户气泡）
   */
  transformLocalMessage(requestParams: Partial<ChatRequestBody>): ChatMessage {
    return {
      role: 'user',
      content: requestParams?.query ?? '',
      time: nowTimeText(),
    }
  }

  /**
   * SSE 数据块 → 助手消息（增量拼接 content）。
   * 首次更新时 originMessage 是 requestPlaceholder 生成的占位消息（含 query）。
   */
  transformMessage(info: TransformMessage<ChatMessage, SSEOutput>): ChatMessage {
    const prev = info?.originMessage
    const base: ChatMessage = {
      role: 'assistant',
      content: prev?.content ?? '',
      time: prev?.time ?? '',
      query: prev?.query ?? '',
      error: prev?.error,
      aborted: prev?.aborted,
    }

    // 流正常结束：若既无内容也无错误，展示空回复兜底文案
    if (info?.status === 'success') {
      if (base.content || base.error) return base
      return { ...base, content: EMPTY_REPLY_TEXT }
    }

    // 流式更新中：解析当前数据块
    const parsed = parseChunk(info?.chunk)
    if (!parsed) return prev?.role === 'assistant' ? prev : base
    // 忽略服务端回显的 user 角色数据块，只消费 assistant 内容
    if (parsed.role === 'user') return prev?.role === 'assistant' ? prev : base

    // 服务端业务错误：不中断流，把错误文案写入消息（气泡展示错误态 + 重试）
    if (parsed.status === 'error') {
      return {
        ...base,
        time: parsed.time || base.time,
        error: typeof parsed.content === 'string' && parsed.content ? parsed.content : SERVER_ERROR_TEXT,
      }
    }

    return {
      ...base,
      content: base.content + (parsed.content ?? ''),
      time: parsed.time || base.time,
    }
  }
}

/**
 * 创建 XRequest 流式请求实例。
 * 必须是 manual 模式（AbstractChatProvider 强制要求），由 useXChat 在发送时触发 run()；
 * 请求体由 XRequest 自动 JSON.stringify({ ...params })，即 { query, sessionId }。
 */
export function createChatRequest(): AbstractXRequestClass<ChatRequestBody, SSEOutput, ChatMessage> {
  return XRequest<ChatRequestBody, SSEOutput, ChatMessage>(CHAT_API_URL, {
    manual: true,
    headers: { 'Content-Type': 'application/json' },
    timeout: REQUEST_TIMEOUT,
    streamTimeout: STREAM_TIMEOUT,
  })
}
