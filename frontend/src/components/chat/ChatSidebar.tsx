import React from 'react';
import { Search, Plus, MoreVertical, Users } from 'lucide-react';
import { ChatRoom, User } from '@/types/chat.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  chatRooms: ChatRoom[];
  selectedRoomId?: string;
  currentUser: User;
  onRoomSelect: (roomId: string) => void;
  onNewChat: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatRooms,
  selectedRoomId,
  currentUser,
  onRoomSelect,
  onNewChat,
  searchQuery,
  onSearchChange,
}) => {
  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOtherParticipant = (room: ChatRoom) => {
    if (room.type === 'direct') {
      return room.participants.find(p => p._id !== currentUser._id);
    }
    return null;
  };

  const formatLastMessageTime = (timestamp?: Date) => {
    if (!timestamp) return '';
    return formatDistanceToNow(timestamp, { addSuffix: false });
  };

  return (
    <div className="w-80 border border-[#081f3d8f] bg-gradient-to-br from-[#081f3d8f]  to-transparent backdrop-blur-3xl  border-chat-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-chat-header border-chat-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-chat-text">Chats</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewChat}
              className="text-chat-text hover:bg-chat-message-bg"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-chat-text hover:bg-chat-message-bg"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-chat-text-muted" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-chat-input border-chat-border text-chat-text placeholder:text-chat-text-muted"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.map((room) => {
          const otherParticipant = getOtherParticipant(room);
          const isSelected = room._id === selectedRoomId;
          
          return (
            <div
              key={room._id}
              onClick={() => onRoomSelect(room._id)}
              className={`p-4  cursor-pointer rounded-tr-2xl transition-colors ${
                isSelected 
                  ? 'bg-[#082a568f] border-t-2' 
                  : 'hover:bg-[#081f3d5a] hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={room.type === 'direct' ? otherParticipant?.avatar : undefined} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {room.type === 'direct' 
                        ? otherParticipant?.name?.[0]?.toUpperCase() || 'U'
                        : <Users className="h-6 w-6" />
                      }
                    </AvatarFallback>
                  </Avatar>
                  {room.type === 'direct' && otherParticipant && (
                    <div 
                      className={`absolute -bottom-0 -right-1 w-2.5 h-2.5 rounded-full rounded-bl-none rounded-tr-none  ${
                        otherParticipant.onlineStatus ? 'bg-chat-online' : 'bg-chat-offline'
                      }`}
                    />
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex relative items-center justify-between mb-1">
                    <h3 className="font-medium text-chat-text truncate">
                      {room.type === 'direct' ? otherParticipant?.name : room.name}
                    </h3>
                    {room.lastMessage && (
                      <span className={`absolute -top-2 -right-2 text-[10px] ${isSelected ? 'bg-sky-900' : 'bg-sky-900/30'} px-2 rounded-xl rounded-tl-none rounded-br-none text-chat-text-muted`}>
                        {formatLastMessageTime(room.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  {room.courseName && (
                    <p className="text-xs text-chat-text-muted mb-1">
                      Course: {room.courseName}
                    </p>
                  )}
                  
                  <div className="relative flex items-center justify-between">
                    <p className="text-sm text-chat-text-muted truncate">
                      {room.lastMessage?.content || 'No messages yet'}
                    </p>
                    {room.unreadCount > 0 && (
                      <Badge className="shadow-[0px_0px_6px_1px] shadow-[#090c12] border-0 bg-gradient-to-br from-sky-200 to-sky-400 rounded-full rounded-br-none absolute -bottom-2 -right-2  w-4.5 h-4 text-xs">
                        {room.unreadCount > 99 ? '99+' : room.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredRooms.length === 0 && (
          <div className="p-8 text-center text-chat-text-muted">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </div>
        )}
      </div>
    </div>
  );
};