import { cn } from "@/lib/utils"

interface MessageProps {
  sender: string;
  content: string;
  time: string;
  isOwn?: boolean; // 是否是自己的消息
  avatar?: string; // 头像URL
  status?: 'sent' | 'delivered' | 'read'; // 消息状态
  msgId?: number;
}

export function Message({ 
  sender, 
  content, 
  time, 
  isOwn = false, 
  avatar, 
  status = 'sent',
  msgId,
}: MessageProps) {
  return (
    <div className={cn(
      "flex w-full max-w-md mb-4",
      isOwn ? "justify-end" : "justify-start"
    )} style={{
      border: '1px solid green'
    }}>
      <div className={cn(
        "relative rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 p-4",
        isOwn 
          ? "bg-blue-50 border-blue-200" 
          : "bg-white border-gray-200",
        "max-w-xs"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-600">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "text-sm font-medium truncate",
              isOwn ? "text-blue-700" : "text-gray-700"
            )}>
              {sender}
            </h4>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{msgId}</span>
              {isOwn && (
                <span className={cn(
                  "ml-1 text-xs px-1 py-0.5 rounded-full border",
                  status === 'read' && "bg-green-100 text-green-700 border-green-300",
                  status === 'delivered' && "bg-blue-100 text-blue-700 border-blue-300",
                  status === 'sent' && "bg-gray-100 text-gray-700 border-gray-300"
                )}>
                  {status === 'read' && '已读'}
                  {status === 'delivered' && '已送达'}
                  {status === 'sent' && '已发送'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="pt-0">
          <p className={cn(
            "text-sm leading-relaxed break-words",
            isOwn ? "text-gray-800" : "text-gray-700"
          )}>
            {content}
          </p>
        </div>
      </div>
    </div>
  )
}
