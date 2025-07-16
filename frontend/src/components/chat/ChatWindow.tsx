import React, { useState, useEffect, useRef } from 'react';
import { ChatRoom, Message, User } from '@/types/chat.type';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocket } from '../hooks/useSocket';
import { env } from '@/config/env.config';

interface ChatWindowProps {
  room: ChatRoom;
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, replyTo?: Message['replyTo']) => void;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  room,
  setChatRooms,
  messages,
  currentUser,
  onSendMessage,
  onBack,
}) => {
  const [replyingTo, setReplyingTo] = useState<Message | undefined>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {on, emit} = useSocket(env.API_URL, currentUser._id);

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(undefined);
  };

  const handleIsTypingFlag = (isTyping: boolean) => {
    emit('user_typing', { userId: currentUser._id, roomId: room._id, isTyping });
  }

  const handleSendMessage = (content: string, replyTo?: Message['replyTo']) => {
    console.log(replyTo);
    onSendMessage(content, replyTo);
    setReplyingTo(undefined);
  };

  useEffect(()=>{
    const otherUserTyping = (data: { userId: string; roomId: string; isTyping: boolean }) => {
      if (data.roomId === room._id) {
        setChatRooms(prev => prev.map(room => 
          room._id === data.roomId 
            ? { ...room, isTyping: data.isTyping }
            : room
        ));
        if (data.isTyping) {
          setTimeout(() => {
            setChatRooms(prev => prev.map(room => 
              room._id === data.roomId 
                ? { ...room, isTyping: false }
                : room
            ));
          }, 2000);
        }
      }
    }
  
      on('user_typing', otherUserTyping);

  },[on,setChatRooms,room._id]);


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (dateString === today) return 'Today';
    if (dateString === yesterday) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className=" w-full flex flex-col h-full pb-52 bg-chat-background">
      <ChatHeader room={room} currentUser={currentUser} onBack={onBack} />
      
      {/* Messages */}
      <ScrollArea className="flex-1 h-full" ref={scrollAreaRef}>
        <div className="p-4 space-y-6">
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-chat-message-bg px-3 py-1 rounded-full">
                  <span className="text-xs text-chat-text-muted">
                    {formatDateHeader(date)}
                  </span>
                </div>
              </div>
              
              {/* Messages for this date */}
              <div className="space-y-4">
                {dateMessages.map((message, index) => {
                  const prevMessage = dateMessages[index - 1];
                  const showAvatar = !prevMessage || 
                    prevMessage.senderId !== message.senderId ||
                    new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60 * 1000; // 5 minutes
                  
                  return (
                    <MessageBubble
                      key={message._id}
                      message={message}
                      currentUser={currentUser}
                      onReply={handleReply}
                      showAvatar={showAvatar}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleIsTypingFlag}
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
      />
    </div>
  );
};