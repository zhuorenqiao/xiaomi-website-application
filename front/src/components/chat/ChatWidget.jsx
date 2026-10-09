/**
 * 在线客服聊天浮窗：主页右下角悬浮按钮 + 右侧抽屉面板。
 * 抽屉内通过 ConfigProvider 注入小米主题色（#ff6700）与中文文案。
 */
import React, { useState } from 'react';
import { App as AntdApp, ConfigProvider, Drawer } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { CommentOutlined, RobotOutlined } from '@ant-design/icons';
import ChatPanel from './ChatPanel.jsx';
import useChat from '../../hooks/useChat.js';
import './Chat.css';

const chatTheme = {
  token: {
    colorPrimary: '#ff6700',
    borderRadius: 8,
  },
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { sessions, newConversation } = useChat();

  const handleOpen = () => {
    // 兜底：没有任何会话时先创建一个
    if (sessions.length === 0) newConversation();
    setOpen(true);
  };

  return (
    <>
      <button type="button" className="chat-fab" onClick={handleOpen} aria-label="打开在线客服">
        <CommentOutlined />
      </button>

      <Drawer
        className="chat-drawer"
        open={open}
        onClose={() => setOpen(false)}
        size={780}
        styles={{ body: { padding: 0 }, wrapper: { maxWidth: '100vw' } }}
        title={
          <div className="chat-drawer__title">
            <span className="chat-drawer__logo">
              <RobotOutlined />
            </span>
            <div>
              <div className="chat-drawer__name">小米在线客服</div>
              <div className="chat-drawer__status">
                <span className="chat-dot" />
                在线 · 智能助手为您服务
              </div>
            </div>
          </div>
        }
      >
        <ConfigProvider locale={zhCN} theme={chatTheme}>
          <AntdApp component={false}>
            <ChatPanel />
          </AntdApp>
        </ConfigProvider>
      </Drawer>
    </>
  );
}
