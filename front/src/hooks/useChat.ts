/**
 * 聊天全局状态消费 Hook，必须在 <ChatProvider> 内使用。
 *
 * 返回：
 * - sessions / activeId：会话列表与当前会话
 * - messages / isRequesting：当前会话的消息与请求状态
 * - send / stop / retry：发送、停止、重新生成
 * - newConversation / switchSession / removeSession：会话管理
 */
import { useContext } from 'react';
import { ChatContext, type ChatContextValue } from './ChatProvider';

export default function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat 必须在 <ChatProvider> 内部使用');
  }
  return ctx;
}
