
'use client';

import React from 'react';
import { ScrollU } from 'scroll-u';
import { Message } from '../components/message/message';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4" >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 滚动列表示例 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">自定义滚动列表</h2>
          <div style={{ width: '500px', height: '600px' }}>
            <ScrollU
              className={'g-red-500 border p-4'}
              initialItems={[
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
              ]}
              renderItem={async (direction: 'pre' | 'next', contextData: React.ReactElement<{msgId:number}> | null | undefined) => {
                //  await new Promise(resolve => setTimeout(resolve, 10));

                // 获取当前 msgId
                let msgId: number;
                if (contextData && React.isValidElement(contextData)) {
                  const currentMsgId = contextData.props?.msgId;
                  if (typeof currentMsgId === 'number') {
                    msgId = currentMsgId;
                  } else {
                    msgId = direction === 'pre' ? -1 : 100;
                  }
                } else {
                  msgId = direction === 'pre' ? -1 : 100;
                }

                // 批量生成 3 条消息
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
                });

                // pre 方向需要倒序插入，next 方向顺序插入
                return direction === 'pre' ? messages.reverse() : messages;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


