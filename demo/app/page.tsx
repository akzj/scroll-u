
'use client';

import React, { useRef } from 'react';
import { ScrollU, ScrollURef, ReactNodes } from 'scroll-u';
import { UpdateNodeHandle } from 'scroll-u'
import { Message, MessageProps } from '../components/message/message';

export default function Home() {
  const initMessage = [
    <Message
      key={0}
      msgId={0}
      sender="系统"
      content="初始消息 1"
      isOwn={false}
      status="read"
    />,
    <Message
      key={1}
      msgId={1}
      sender="系统"
      content="初始消息 2"
      isOwn={false}
      status="read"
    />,
    <Message
      key={2}
      msgId={2}
      sender="系统"
      content="初始消息 3"
      isOwn={false}
      status="read"
    />
  ]

  const getMessageId = (node: React.ReactNode): number | undefined => {
    if (
      node &&
      React.isValidElement(node) &&
      'msgId' in (node.props as any)
    ) {
      const currentMsgId = (node.props as any).msgId;
      if (typeof currentMsgId === 'number') {
        return currentMsgId;
      }
      return undefined
    }
  }

  const reloadMore = async (direction: 'pre' | 'next', node: React.ReactNode) => {
    //  await new Promise(resolve => setTimeout(resolve, 10));
    let msgId: number = getMessageId(node)!;
    const count = 10;
    const messages = Array.from({ length: count }).map((_, i) => {
      const realId = direction === 'pre' ? msgId - (i + 1) : msgId + (i + 1);
      return (
        <Message
          key={realId}
          msgId={realId}
          sender={`动态用户 ${direction}`}
          content={`动态消息 ${Date.now()} (${direction})`}
          isOwn={Math.random() > 0.5}
          status="read"
        />
      );
    }
    )
    // pre 方向需要倒序插入，next 方向顺序插入
    return direction === 'pre' ? messages.reverse() : messages;
  }


  const scrollRef = useRef<ScrollURef>(null)


  const updateMessages = (msg: MessageProps) => {
    if (!scrollRef.current) return;
    scrollRef.current.updateNodes((nodes: ReactNodes): ReactNodes => {
      nodes.map(node => {
        const msgId = getMessageId(node);
        if (msgId && msgId === msg.msgId) {
          return (
            // update message
            Message(msg)
          )
        }
      })
      return nodes;
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4" >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 滚动列表示例 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">自定义滚动列表</h2>
          <div style={{ width: '500px', height: '600px' }}>
            <ScrollU
              ref={scrollRef}
              className={'g-red-500 border p-4'}
              initialItems={initMessage}
              renderItem={reloadMore}
            />
          </div>
        </div>
      </div>
    </div>
  )
}