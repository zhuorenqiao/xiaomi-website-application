/**
 * 聊天面板：左侧会话列表（Conversations）+ 右侧消息流（Bubble.List）与输入区（Sender）。
 * 消息数据全部来自 useChat（ChatProvider），本组件只做渲染与交互。
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App as AntdApp, Avatar, Button } from 'antd';
import {
  CustomerServiceOutlined,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
  ShoppingOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Bubble, Conversations, Prompts, Sender, Welcome } from '@ant-design/x';
import useChat from '../../hooks/useChat.js';
import './Chat.css';

/** 空状态展示的快捷提问 */
const QUICK_PROMPTS = [
  { key: 'order', icon: <ShoppingOutlined />, label: '查询订单物流', data: '帮我查询最近的订单物流信息' },
  { key: 'recommend', icon: <CustomerServiceOutlined />, label: '产品咨询', data: '推荐一款适合送父母的手机' },
  { key: 'after-sale', icon: <ToolOutlined />, label: '申请售后', data: '我的手机屏幕碎了，如何申请售后维修' },
  { key: 'other', icon: <QuestionCircleOutlined />, label: '其他问题', data: '人工客服的在线时间是什么时候' },
];

export default function ChatPanel() {
  const {
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
  } = useChat();
  const [inputValue, setInputValue] = useState('');
  const { message: antdMessage } = AntdApp.useApp();

  // 错误提示：气泡内已展示错误态，全局 toast 提醒一次
  const toastedRef = useRef(new Set());
  useEffect(() => {
    messages.forEach((info) => {
      const text = info.message?.error;
      if (!text) return;
      const toastKey = `${info.id}:${text}`;
      if (toastedRef.current.has(toastKey)) return;
      toastedRef.current.add(toastKey);
      antdMessage.error(text);
    });
  }, [messages, antdMessage]);

  // 会话列表数据（附删除菜单）
  const conversationItems = useMemo(
    () => sessions.map(({ key, label }) => ({ key, label })),
    [sessions],
  );

  // useXChat 消息 → Bubble.List 数据项
  // error/aborted 通过 extraInfo 传给 footer；重试用的 query 取“最近一条用户消息”，
  // 不依赖消息自身字段（流式首块会替换占位气泡，query 不可靠），历史恢复同样适用
  const bubbleItems = useMemo(() => {
    let lastQuery = '';
    return messages.map((info) => {
      const msg = info.message ?? {};
      if (msg.role === 'user') {
        lastQuery = msg.content ?? '';
        return {
          key: info.id,
          role: 'user',
          content: msg.content ?? '',
          loading: info.status === 'loading',
          status: info.status,
        };
      }
      return {
        key: info.id,
        role: 'ai',
        content: msg.content ?? '',
        loading: info.status === 'loading',
        status: info.status,
        // 出错/停止且没有任何部分内容时，隐藏空气泡主体，只留错误提示行
        className: (msg.error || msg.aborted) && !msg.content ? 'chat-bubble--empty' : undefined,
        extraInfo: { time: msg.time, error: msg.error, aborted: msg.aborted, query: lastQuery },
      };
    });
  }, [messages]);

  // 气泡角色配置：位置 / 头像 / 底部（时间、错误重试、停止态）
  const roles = useMemo(
    () => ({
      ai: {
        placement: 'start',
        variant: 'filled',
        avatar: <Avatar className="chat-avatar chat-avatar--ai" icon={<RobotOutlined />} />,
        footer: (content, info) => {
          const { time, error, aborted, query } = info.extraInfo ?? {};
          if (error) {
            return (
              <div className="chat-msg-meta chat-msg-meta--error">
                <span>{error}</span>
                {query ? (
                  <Button type="link" size="small" onClick={() => retry(info.key, query)}>
                    重新生成
                  </Button>
                ) : null}
              </div>
            );
          }
          if (aborted) {
            return (
              <div className="chat-msg-meta">
                <span className="chat-msg-stopped">已停止生成</span>
                {query ? (
                  <Button type="link" size="small" onClick={() => retry(info.key, query)}>
                    重新生成
                  </Button>
                ) : null}
              </div>
            );
          }
          if (time) {
            return (
              <div className="chat-msg-meta">
                <span className="chat-msg-time">{time}</span>
              </div>
            );
          }
          return null;
        },
      },
      user: {
        placement: 'end',
        variant: 'filled',
        avatar: <Avatar className="chat-avatar chat-avatar--user" icon={<UserOutlined />} />,
      },
    }),
    [retry],
  );

  const handleSend = () => {
    send(inputValue);
    setInputValue('');
  };

  return (
    <div className="chat-panel">
      <aside className="chat-panel__side">
        <Button type="primary" block icon={<PlusOutlined />} onClick={newConversation}>
          开启新会话
        </Button>
        <Conversations
          className="chat-panel__conversations"
          items={conversationItems}
          activeKey={activeId}
          onActiveChange={switchSession}
          menu={(conversation) => ({
            items: [{ key: 'delete', danger: true, icon: <DeleteOutlined />, label: '删除会话' }],
            onClick: ({ key }) => {
              if (key === 'delete') removeSession(conversation.key);
            },
          })}
        />
      </aside>

      <section className="chat-panel__main">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <Welcome
              className="chat-empty__welcome"
              variant="borderless"
              icon={<RobotOutlined className="chat-empty__icon" />}
              title="你好，我是小米智能助手"
              description="订单查询、产品咨询、售后申请都可以找我，随便问点什么吧"
            />
            <Prompts
              className="chat-empty__prompts"
              wrap
              items={QUICK_PROMPTS}
              onItemClick={({ data }) => {
                if (data?.data) send(data.data);
              }}
            />
          </div>
        ) : (
          <Bubble.List className="chat-panel__list" autoScroll items={bubbleItems} role={roles} />
        )}

        <div className="chat-panel__sender">
          <Sender
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSend}
            loading={isRequesting}
            onCancel={stop}
            placeholder="输入你的问题，Enter 发送，Shift + Enter 换行"
            submitType="enter"
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
          <p className="chat-panel__hint">内容由 AI 生成，仅供参考</p>
        </div>
      </section>
    </div>
  );
}
