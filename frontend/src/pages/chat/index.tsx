// import ChatContainer from "@/components/chat/chat-container";
// import ContactsContainer from "@/components/chat/contacts-container";
// import EmptyChatContainer from "@/components/chat/empty-chat-container";
// import { RootState } from "@/store";
// import { useSelector } from "react-redux";

// const Chat = () => {

//     const {selectedChatData,selectedChatType} = useSelector((state:RootState) => state.chat);
//     console.log(selectedChatData,selectedChatType);

    

//     return (
//         <div className="flex h-[43rem] overflow-hidden">
//             <ContactsContainer />
//             {
//                 selectedChatType === undefined 
//                 ? <EmptyChatContainer />
//                 : <ChatContainer />
//             }
//         </div>
//     )
// }

// export default Chat

import React from 'react';
import { User } from '@/types/chat.type';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { env } from '@/config/env.config';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserRole } from '@/types';

// Mock current user - replace this with your Redux auth state
// const currentUser: User = {
//   id: 'current-user',
//   name: 'John Doe',
//   email: 'john@example.com',
//   role: 'student',
//   isOnline: true,
//   lastSeen: new Date(),
// };

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