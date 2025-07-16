import React from 'react';
import { Reply, MoreVertical, CheckCheck } from 'lucide-react';
import { Message, User } from '@/types/chat.type';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
  onReply: (message: Message) => void;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUser,
  onReply,
  showAvatar = true,
}) => {
  const isOwn = message.senderId === currentUser._id;
  const timestamp = formatDistanceToNow(message.timestamp, { addSuffix: true });

  return (
    <div className={cn(
      "flex gap-2 max-w-[80%] group",
      isOwn ? "ml-auto flex-row-reverse" : ""
    )}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
          {message.senderName[0]?.toUpperCase()}
        </div>
      )}
      
      <div className={cn(
        "flex flex-col gap-1",
        isOwn ? "items-end" : "items-start"
      )}>
        {/* Sender name for group chats */}
        {!isOwn && (
          <span className="text-xs text-chat-text-muted px-3">
            {message.senderName}
          </span>
        )}
        
        {/* Reply indicator */}
        {message.replyTo && (
          <div className={cn(
            "text-xs p-2 rounded-lg border-l-4 border-primary bg-chat-message-bg grayscale-50 max-w-full",
            isOwn ? "bg-chat-message-own grayscale-50" : ""
          )}>
            <p className="text-chat-text-muted font-medium">
              {message.replyTo.senderName}
            </p>
            <p className="text-chat-text truncate">
              {message.replyTo.content}
            </p>
          </div>
        )}
        
        {/* Message bubble */}
        <div className="relative">
          <div className={cn(
            "px-4 py-2 rounded-2xl text-sm relative",
            isOwn 
              ? "bg-chat-message-own text-white rounded-br-md" 
              : "bg-chat-message-bg text-chat-text rounded-bl-md"
          )}>
            <p className="whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className={cn(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
            isOwn ? "-left-20" : "-right-20"
          )}>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-chat-text-muted hover:bg-chat-message-bg"
                onClick={() => onReply(message)}
              >
                <Reply className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-chat-text-muted hover:bg-chat-message-bg"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Timestamp */}
        <span className={cn(
          "text-xs text-chat-text-muted px-3 flex items-center",
          isOwn ? "text-right" : ""
        )}>
          {timestamp}
          {isOwn && message.isRead && (
            <CheckCheck className="ml-1 h-3 w-3 text-green-500"/>
          )}
        </span>
      </div>
    </div>
  );
};