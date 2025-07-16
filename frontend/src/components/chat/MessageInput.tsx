import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X } from 'lucide-react';
import { Message } from '@/types/chat.type';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string, replyTo?: Message['replyTo']) => void;
  onTyping: (isTyping: boolean) => void;
  replyingTo?: Message;
  onCancelReply: () => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  replyingTo,
  onCancelReply,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    
    const replyToData = replyingTo ? {
      messageId: replyingTo.id,
      content: replyingTo.content,
      senderName: replyingTo.senderName,
    } : undefined;
    
    onSendMessage(message.trim(), replyToData);
    setMessage('');
    onCancelReply();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  return (
    <div className="fixed bottom-0 right-0 w-[76rem] backdrop-blur-xl bg-chat-input border-t border-chat-border p-4">
      {/* Reply indicator */}
      {replyingTo && (
        <div className="mb-3 p-3 bg-chat-message-bg backdrop-blur-xl rounded-lg border-l-4 border-primary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-chat-text mb-1">
                Replying to {replyingTo.senderName}
              </p>
              <p className="text-sm text-chat-text-muted line-clamp-2">
                {replyingTo.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancelReply}
              className="h-6 w-6 text-chat-text-muted hover:bg-chat-message-bg shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex justify-center items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-chat-text-muted hover:bg-chat-message-bg shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              onTyping(e.target.value !== '');
            }}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className={cn(
              "min-h-[35px] max-h-32 resize-none border-chat-border text-chat-text placeholder:text-[#73b0d0b3] pr-12",
              "focus:ring-0 focus:border-none"
            )}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-1 h-8 w-8 text-chat-text-muted hover:bg-chat-input"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="bg-sky-600 hover:bg-primary/90 text-white shrink-0"
          size="icon"
        >
          <Send className="h-5 w-5 " />
        </Button>
      </div>
    </div>
  );
};