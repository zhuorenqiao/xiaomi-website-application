/**
 * 聊天全局状态 Provider。
 *
 * 职责：
 * - 会话（Conversations）的创建 / 切换 / 删除 + localStorage 持久化；
 * - 通过 useXChat + 自定义 XiaomiChatProvider 发送流式请求（XRequest 处理 SSE）；
 * - 统一错误处理：网络 / 超时 / 服务端错误 → 用户可读文案，气泡内展示并可重试。
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { createChatRequest, XiaomiChatProvider } from './chatAdapter.js';
import { DEFAULT_SESSION_LABEL, mapRequestError } from '../utils/chatConfig.js';
import {
  dropSessionMessages,
  loadActiveId,
  loadAllMessages,
  loadSessions,
  saveActiveId,
  saveMessages,
  saveSessions,
} from '../utils/chatStorage.js';

const ChatContext = React.createContext(null);

/** @returns {import('../types/chat.js').ChatSession} */
function createSession() {
  return {
    key: `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    label: DEFAULT_SESSION_LABEL,
    createdAt: Date.now(),
  };
}

export default function ChatProvider({ children }) {
  // ---------------- 会话状态（初始化时保证至少有一个会话） ----------------
  const [sessions, setSessions] = useState(() => {
    const saved = loadSessions();
    if (saved.length > 0) return saved;
    const first = createSession();
    saveSessions([first]);
    return [first];
  });
  const [activeId, setActiveId] = useState(() => {
    const saved = loadSessions();
    const stored = loadActiveId();
    if (stored && saved.some((item) => item.key === stored)) return stored;
    return saved[0].key;
  });

  // 自定义 ChatProvider + XRequest 实例（manual 模式，发送时由 useXChat 触发）
  const provider = useMemo(() => new XiaomiChatProvider({ request: createChatRequest() }), []);

  // ---------------- useXChat：消息状态 + 流式请求调度 ----------------
  const { messages, onRequest, onReload, abort, isRequesting } = useXChat({
    provider,
    conversationKey: activeId,
    // 请求期间展示“加载中”占位气泡（带 query，失败后可用于重试）
    requestPlaceholder: (params) => ({
      role: 'assistant',
      content: '',
      query: params?.query ?? '',
    }),
    // 请求失败（网络 / 超时 / 手动停止）→ 兜底消息：保留已收到的部分内容 + 用户可读错误文案
    requestFallback: (params, { error, messageInfo }) => ({
      ...(messageInfo?.message ?? {}),
      role: 'assistant',
      query: messageInfo?.message?.query ?? params?.query ?? '',
      aborted: error?.name === 'AbortError',
      error: error?.name === 'AbortError' ? undefined : mapRequestError(error),
    }),
    // 恢复历史消息：每个会话各自存储；重排 id 避免与自增 msg_N 冲突
    defaultMessages: useCallback(({ conversationKey }) => {
      const stored = loadAllMessages()[conversationKey] ?? [];
      return stored.map((info, index) => ({ ...info, id: `history_${index}` }));
    }, []),
  });

  // ---------------- 持久化 ----------------
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    if (activeId) saveActiveId(activeId);
  }, [activeId]);

  // 持久化当前会话消息。注意：切换会话后的第一个 render 中 messages 仍属于
  // 旧会话（消息 store 在 effect 中才切换），此时只记录不落盘，避免串会话
  const savedForRef = useRef({ key: null, messages: null });
  useEffect(() => {
    const prev = savedForRef.current;
    if (prev.key !== activeId) {
      savedForRef.current = { key: activeId, messages };
      return;
    }
    if (prev.messages === messages) return;
    savedForRef.current = { key: activeId, messages };
    // 过滤 loading/updating 中间态，避免刷新后出现孤儿加载气泡
    const stable = messages.filter((item) => item.status !== 'loading' && item.status !== 'updating');
    if (stable.length > 0) saveMessages(activeId, stable);
  }, [messages, activeId]);

  // ---------------- 对外动作 ----------------
  const send = useCallback(
    (query) => {
      const text = (query ?? '').trim();
      if (!text || !activeId) return;
      // 首条消息自动作为会话标题
      setSessions((prev) =>
        prev.map((item) =>
          item.key === activeId && item.label === DEFAULT_SESSION_LABEL
            ? { ...item, label: text.length > 16 ? `${text.slice(0, 16)}…` : text }
            : item,
        ),
      );
      onRequest({ query: text, sessionId: activeId });
    },
    [activeId, onRequest],
  );

  const stop = useCallback(() => abort(), [abort]);

  /** 重新生成某条 assistant 消息（复用触发它的 query） */
  const retry = useCallback(
    (messageId, query) => {
      if (!messageId || !query) return;
      onReload(messageId, { query, sessionId: activeId });
    },
    [activeId, onReload],
  );

  const newConversation = useCallback(() => {
    const session = createSession();
    setSessions((prev) => [session, ...prev]);
    setActiveId(session.key);
  }, []);

  const switchSession = useCallback(
    (key) => {
      if (key && key !== activeId) setActiveId(key);
    },
    [activeId],
  );

  const removeSession = useCallback(
    (key) => {
      if (!key) return;
      if (key === activeId && isRequesting) abort(); // 中断被删除会话的进行中请求
      setSessions((prev) => {
        const next = prev.filter((item) => item.key !== key);
        const list = next.length > 0 ? next : [createSession()];
        if (key === activeId) setActiveId(list[0].key);
        return list;
      });
      dropSessionMessages(key);
    },
    [abort, activeId, isRequesting],
  );

  const value = useMemo(
    () => ({
      sessions,
      activeId,
      messages,
      isRequesting,
      send,
      stop,
      retry,
      newConversation,
      switchSession,
      removeSession,
    }),
    [sessions, activeId, messages, isRequesting, send, stop, retry, newConversation, switchSession, removeSession],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export { ChatContext };
