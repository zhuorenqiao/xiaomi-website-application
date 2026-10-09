/**
 * 聊天服务配置、错误文案与通用工具。
 * utils/ 只存放无副作用的基础能力，不包含 React 逻辑。
 */

// 聊天接口地址：可通过 .env.local 的 VITE_CHAT_API_URL 覆盖（本地联调用）
export const CHAT_API_URL = import.meta.env?.VITE_CHAT_API_URL || 'https://api.example.com/chat';

/** 请求建立超时（毫秒） */
export const REQUEST_TIMEOUT = 15000;

/** 流式空闲超时（毫秒）：超过该时长没有收到新数据视为流中断 */
export const STREAM_TIMEOUT = 30000;

/** localStorage 键名前缀，避免与站点其他存储冲突 */
export const STORAGE_KEYS = {
  sessions: 'xiaomi-chat:sessions',
  activeId: 'xiaomi-chat:active-id',
  messages: 'xiaomi-chat:messages',
};

/** 新会话默认标题 */
export const DEFAULT_SESSION_LABEL = '新会话';

/** 服务端返回 status:"error" 时的兜底文案 */
export const SERVER_ERROR_TEXT = '抱歉，服务出现了一点问题，请稍后重试';

/** 流结束但没有任何内容时的兜底文案 */
export const EMPTY_REPLY_TEXT = '（服务返回了空内容，请重试）';

/**
 * 请求级错误 → 用户可读文案
 * @param {Error} [error] XRequest 回调抛出的错误
 * @returns {string}
 */
export function mapRequestError(error) {
  switch (error?.name) {
    case 'TimeoutError':
      return '请求超时了，请检查网络后重试';
    case 'StreamTimeoutError':
      return '回复中断了，可能是网络不稳定，请重试';
    case 'TypeError':
    case 'NetworkError':
      return '网络连接失败，请检查网络后重试';
    case 'ServerError':
      return error?.message ? `服务暂时不可用：${error.message}` : '服务暂时不可用，请稍后重试';
    default:
      return '服务暂时不可用，请稍后重试';
  }
}

/**
 * 当前时间文本（HH:mm）
 * @returns {string}
 */
export function nowTimeText() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
