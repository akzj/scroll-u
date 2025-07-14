
'use client';

import React, { useRef } from 'react';
import { ScrollU, ScrollURef, ReactNodes } from 'scroll-u';
import { Message, MessageProps } from '../components/message/message';
import { ReactNode } from "react";

export default function Home() {
  const updateMessageLikeStatus = (msg: MessageProps) => {
    if (!scrollRef.current) return;
    scrollRef.current.updateNodes((nodes: ReactNodes): ReactNodes => {
      return nodes.map(node => {
        const props = getMessageProps(node)!;
        if (props.msgId === msg.msgId) {
          return <Message key={props.msgId} {...props} liked={!props.liked} />;
        }
        return node;
      });
    });
  };

  function getMessageProps(node: ReactNode): MessageProps | undefined {
    if (node && React.isValidElement(node)) {
      // 这里可以用类型断言
      return node.props as MessageProps;
    }
    return undefined;
  }

  const reloadMore = async (direction: 'pre' | 'next', node: React.ReactNode) => {
    //  await new Promise(resolve => setTimeout(resolve, 10));
    const { msgId } = getMessageProps(node)!;
    const count = 10;
    const messages = Array.from({ length: count }).map((_, i) => {
      const realId = direction === 'pre' ? msgId - (i + 1) : msgId + (i + 1);
      return (
        <Message
          key={realId}
          msgId={realId}
          liked={false}
          sender={`动态用户 ${direction}`}
          content={`动态消息 ${Date.now()} (${direction})`}
          isOwn={Math.random() > 0.5}
          status="read"
          onLike={updateMessageLikeStatus}
          onDelete={handleDelete}
        />
      );
    }
    )
    // pre 方向需要倒序插入，next 方向顺序插入
    return direction === 'pre' ? messages.reverse() : messages;
  }

  // 删除消息
  const handleDelete = (msg: MessageProps) => {
    if (!scrollRef.current) return;
    scrollRef.current.updateNodes((nodes: ReactNodes) =>
      nodes.filter((node) => {
        const props = getMessageProps(node);
        return props?.msgId !== msg.msgId;
      })
    );
  };

  const initMessage = [
    <Message
      key={0}
      msgId={0}
      sender="系统"
      content="初始消息 1"
      liked={false}
      isOwn={false}
      status="read"
      onLike={updateMessageLikeStatus}
      onDelete={handleDelete}
    />,
    <Message
      key={1}
      msgId={1}
      liked={false}
      sender="系统"
      content="初始消息 2"
      isOwn={false}
      status="read"
      onLike={updateMessageLikeStatus}
      onDelete={handleDelete}
    />,
    <Message
      key={2}
      msgId={2}
      liked={true}
      sender="系统"
      content="初始消息 3"
      isOwn={false}
      status="read"
      onLike={updateMessageLikeStatus}
      onDelete={handleDelete}
    />
  ]

  const scrollRef = useRef<ScrollURef>(null)


  return (
    <div className="h-[600px] flex flex-col bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">自定义滚动列表</h2>
      <div className="flex-1 min-h-0">
        <ScrollU
          className="h-full"
          ref={scrollRef}
          initialItems={initMessage}
          renderItem={reloadMore}
        />
      </div>
    </div>
  )
}