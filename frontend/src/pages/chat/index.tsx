

import React from 'react';
import { User } from '@/types/chat.type';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { env } from '@/config/env.config';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserRole } from '@/types';


const Chat: React.FC = () => {
  // TODO: Replace with actual user from Redux store
  const {user} = useSelector((state: RootState) => state.auth);

  const currentUser: User = {
    _id: user?._id as string,
    name: user?.name ?? '',
    email: user?.email ?? '',
    role: user?.role as UserRole,
    onlineStatus: true,
    lastSeen: new Date(),
  } 
  
  return (
    <div className="md:h-[50rem]">
      <ChatInterface 
        currentUser={currentUser} serverUrl={process.env.NODE_ENV === 'development' ? env.API_URL : 'your-production-server-url'}
      />
    </div>
  );
};

export default Chat;