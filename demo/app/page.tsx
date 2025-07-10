
'use client';

import React from 'react';
import { ScrollU } from '../../src/index';
import { Message } from '../components/message/message';

export default function Home() {
  const testMessages = [
    {
      sender: "张三",
      content: "你好！今天天气真不错，要不要一起出去走走？",
      time: "10:30",
      isOwn: false,
      avatar: "",
      status: "read" as const
    },
    {
      sender: "我",
      content: "好啊！去哪里呢？",
      time: "10:32",
      isOwn: true,
      avatar: "",
      status: "read" as const
    },
    {
      sender: "李四",
      content: "大家下午有空吗？我们团队有个会议需要讨论新项目的进展。",
      time: "11:15",
      isOwn: false,
      avatar: "",
      status: "delivered" as const
    },
    {
      sender: "我",
      content: "我有空，下午2点可以吗？",
      time: "11:18",
      isOwn: true,
      avatar: "",
      status: "sent" as const
    },
    {
      sender: "王五",
      content: "刚刚看了你发的代码，有几个地方需要优化一下，我整理了一个文档发给你了。",
      time: "12:45",
      isOwn: false,
      avatar: "",
      status: "read" as const
    },
    {
      sender: "我",
      content: "收到！我马上看看，谢谢你的建议。",
      time: "12:50",
      isOwn: true,
      avatar: "",
      status: "delivered" as const
    },
    {
      sender: "赵六",
      content: "周末要不要一起去看电影？新上映的科幻片听说很不错。",
      time: "14:20",
      isOwn: false,
      avatar: "",
      status: "read" as const
    },
    {
      sender: "我",
      content: "好啊！什么时间？我周六下午有空。",
      time: "14:25",
      isOwn: true,
      avatar: "",
      status: "sent" as const
    },
    {
      sender: "孙七",
      content: "项目进度怎么样了？客户那边催得比较紧，我们需要加快一下节奏。",
      time: "16:10",
      isOwn: false,
      avatar: "",
      status: "read" as const
    },
    {
      sender: "我",
      content: "好的，我会优先处理这个项目，预计明天就能完成第一阶段的开发。",
      time: "16:15",
      isOwn: true,
      avatar: "",
      status: "sent" as const
    }
  ];

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
                  msgId={0}
                  sender="系统"
                  content="初始消息 1"
                  time="10:00"
                  isOwn={false}
                  avatar=""
                  status="read"
                />,
                <Message
                  msgId={1}
                  sender="系统"
                  content="初始消息 2"
                  time="10:01"
                  isOwn={false}
                  avatar=""
                  status="read"
                />,
                <Message
                  msgId={2}
                  sender="系统"
                  content="初始消息 3"
                  time="10:02"
                  isOwn={false}
                  avatar=""
                  status="read"
                />
              ]}
              renderItem={async (direction, contextData) => {
              //  await new Promise(resolve => setTimeout(resolve, 10));

                // 获取当前 msgId
                let msgId: number;
                if (contextData && React.isValidElement(contextData)) {
                  const currentMsgId = (contextData as any).props?.msgId;
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
                      time={new Date().toLocaleTimeString()}
                      isOwn={Math.random() > 0.5}
                      avatar=""
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


