import React from 'react';
import { Video, MoreVertical, ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatRoom, User } from '@/types/chat.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCallContext } from '@/contexts/CallContext';

interface ChatHeaderProps {
  room: ChatRoom;
  currentUser: User;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  room,
  currentUser,
  onBack,
}) => {
  const navigate = useNavigate();
  const { incomingCall } = useCallContext();

  const otherParticipant = room.type === 'direct' 
    ? room.participants.find(p => p._id !== currentUser._id)
    : null;

  const handleVideoCall = () => {

    if (incomingCall) {
      toast.info('Please handle the incoming call first');
      return;
    }


    if (room.type === 'direct' && otherParticipant) {
      // Navigate to video call with required parameters
      navigate(`/video-call/${room._id}?target=${otherParticipant._id}&callName=${otherParticipant.name}`);
    } else if (room.type === 'group') {
      // Handle group video call - you might want to show a participant selection modal
      // or implement group calling differently
      console.log('Group video calls not implemented yet');
    }
  };

  const getStatusText = () => {
    if (room.type === 'group') {
      return `${room.participants.length} participants`;
    }
    
    if (!otherParticipant) return '';
    
    if (otherParticipant.onlineStatus) {
      return 'Online';
    }
    
    return `Last seen ${new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(new Date(otherParticipant.lastSeen))}`;
  };

  return (
    <div className="bg-chat-header border-b border-chat-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-chat-text hover:bg-chat-message-bg md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={room.type === 'direct' ? otherParticipant?.profileImage : undefined} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {room.type === 'direct' 
                ? otherParticipant?.name?.[0]?.toUpperCase() || 'U'
                : <Users className="h-5 w-5" />
              }
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="font-semibold text-chat-text">
              {room.type === 'direct' ? otherParticipant?.name : room.name}
            </h2>
            <div className='flex gap-2'>
              {room.isTyping ? 
                (<span className='text-xs text-sky-400/70'>Typing...</span>)
                :
                (<p className="text-xs text-chat-text-muted">{getStatusText()}</p>) 
              }
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVideoCall}
            disabled={!!incomingCall || room.type === 'group'}
            className="text-chat-text hover:bg-chat-message-bg disabled:opacity-50"
            title={incomingCall ? 'Handle incoming call first' : 'Start video call'}
          >
            <Video className="h-5 w-5" />
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
    </div>
  );
};
