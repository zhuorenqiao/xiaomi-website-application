/**
 * 聊天记录本地持久化（localStorage）。
 * 会话列表、激活会话、各会话消息分别存储，读写均做异常兜底。
 */
import type { ChatSession, StoredChatMessage } from '../types/chat';
import { STORAGE_KEYS } from './chatConfig';

/** 各会话消息的存储形态：{ [会话 id]: 消息数组 } */
export type MessagesBySession = Record<string, StoredChatMessage[]>;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 隐私模式 / 存储空间不足时直接忽略，不影响聊天功能
  }
}

export const loadSessions = (): ChatSession[] => readJson<ChatSession[]>(STORAGE_KEYS.sessions, []);

export const saveSessions = (sessions: ChatSession[]): void => writeJson(STORAGE_KEYS.sessions, sessions);

export const loadActiveId = (): string => readJson<string>(STORAGE_KEYS.activeId, '');

export const saveActiveId = (id: string): void => writeJson(STORAGE_KEYS.activeId, id);

export const loadAllMessages = (): MessagesBySession => readJson<MessagesBySession>(STORAGE_KEYS.messages, {});

/** 按会话保存消息（useXChat 的 MessageInfo 数组） */
export const saveMessages = (sessionId: string, messages: StoredChatMessage[]): void => {
  const all = loadAllMessages();
  all[sessionId] = messages;
  writeJson(STORAGE_KEYS.messages, all);
};

/** 删除会话时清理对应消息 */
export const dropSessionMessages = (sessionId: string): void => {
  const all = loadAllMessages();
  if (sessionId in all) {
    delete all[sessionId];
    writeJson(STORAGE_KEYS.messages, all);
  }
};
