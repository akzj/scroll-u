import { Message } from "../components/message/message"

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
]

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          消息列表
        </h1>
        <div className="space-y-2">
          {testMessages.map((message, index) => (
            <Message
              key={index}
              sender={message.sender}
              content={message.content}
              isOwn={message.isOwn}
              status={message.status}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 