/**
 * 聊天记录本地持久化（localStorage）。
 * 会话列表、激活会话、各会话消息分别存储，读写均做异常兜底。
 */
import { STORAGE_KEYS } from './chatConfig.js';

/**
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * @param {string} key
 * @param {*} value
 */
function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 隐私模式 / 存储空间不足时直接忽略，不影响聊天功能
  }
}

/** @returns {import('../types/chat.js').ChatSession[]} */
export const loadSessions = () => readJson(STORAGE_KEYS.sessions, []);

/** @param {import('../types/chat.js').ChatSession[]} sessions */
export const saveSessions = (sessions) => writeJson(STORAGE_KEYS.sessions, sessions);

/** @returns {string} */
export const loadActiveId = () => readJson(STORAGE_KEYS.activeId, '');

/** @param {string} id */
export const saveActiveId = (id) => writeJson(STORAGE_KEYS.activeId, id);

/** @returns {Record<string, Array<{ id: string, message: *, status: string }>>} */
export const loadAllMessages = () => readJson(STORAGE_KEYS.messages, {});

/**
 * 按会话保存消息（useXChat 的 MessageInfo 数组）
 * @param {string} sessionId
 * @param {Array<{ id: string, message: *, status: string }>} messages
 */
export const saveMessages = (sessionId, messages) => {
  const all = loadAllMessages();
  all[sessionId] = messages;
  writeJson(STORAGE_KEYS.messages, all);
};

/**
 * 删除会话时清理对应消息
 * @param {string} sessionId
 */
export const dropSessionMessages = (sessionId) => {
  const all = loadAllMessages();
  if (sessionId in all) {
    delete all[sessionId];
    writeJson(STORAGE_KEYS.messages, all);
  }
};
