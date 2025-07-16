import React, { useState, useEffect } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { useSocket } from '@/components/hooks/useSocket';
import { ChatRoom, Message, User } from '@/types/chat.type';
import { toast } from 'sonner';
import { NewChatModal } from './NewChatModel';
import axiosInstance from '@/config/axios.config';

interface ChatInterfaceProps {
  currentUser: User;
  serverUrl?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUser,
  serverUrl = 'http://localhost:3001',
}) =>  {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);

  // Socket connection
  const { emit, on, off, connected } = useSocket(serverUrl, currentUser._id);

  const selectedRoom = chatRooms.find(room => room._id === selectedRoomId);

  const fetchChatRooms = async () => {
    try {
      const res = await axiosInstance.get('/api/v1/chat/rooms');
      console.log(res.data, 'chat rooms');
      setChatRooms(res.data);
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
      toast("Failed to load chat rooms");
    }
  };

  // Fetch chat rooms on mount
  useEffect(() => {
    fetchChatRooms();
  }, []);

  // Fetch messages when a room is selected
  useEffect(() => {
    if (!selectedRoomId) return;
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/chat/rooms/${selectedRoomId}/messages`);
        setMessages(res.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        toast("Failed to load messages");
      }
    };
    fetchMessages();
  }, [selectedRoomId]); 


  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    console.log(`Selected room: ${roomId}`);
    emit('join_room', roomId);
  };

  const handleSendMessage = (content: string, replyTo?: Message['replyTo']) => {
    if (!selectedRoomId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      senderId: currentUser._id,
      senderName: currentUser.name,
      timestamp: new Date(),
      type: 'text',
      roomId: selectedRoomId,
      replyTo,
      isRead: false,
    };


    // Emit to server
    emit('send_message', {
      content,
      roomId: selectedRoomId,
      senderId: currentUser._id,
      senderName: currentUser.name,
      type: 'text',
      replyTo,
      isRead: false,
    });

    // Update last message in chat room
    setChatRooms(prev => prev.map(room => 
      room._id === selectedRoomId 
        ? { ...room, lastMessage: newMessage }
        : room
    ));
  };

  const handleNewChat = () => {
    setNewChatModalOpen(true);
  };

  const handleCreateChat = async (tutorId: string): Promise<void> => {
    try {

      console.log('tutorId', tutorId);
      // return
      
      const res = await axiosInstance.post('/api/v1/chat/rooms/direct', {
        participantId: tutorId,
      });
      const newRoom: ChatRoom = res.data;
  
      // Check if room already exists
      const existingRoom = chatRooms.find(room => room._id === newRoom._id);
      if (existingRoom) {
        setSelectedRoomId(existingRoom._id);
        toast("Chat opened");
        return;
      }
  
      setChatRooms(prev => [newRoom, ...prev]);
      setSelectedRoomId(newRoom._id);
      toast("Chat created");
    } catch (error) {
      console.error('Failed to create chat:', error);
      toast("Failed to create chat. Please try again.");
      throw error;
    }
  };

  // Socket event listeners
    useEffect(() => {
    const handleMessageReceived = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };
  
    const handleUserOffline = (userId: string) => {
      setChatRooms(prev => prev.map(room => {
        if (room.participants.find(participant => participant._id === userId)) {
          return {
            ...room,
            participants: room.participants.map(participant =>
              participant._id === userId
                ? { ...participant, onlineStatus: false }
                : participant
            ),
          };
        }
        return room;
      }));
    };
  
    const handleUserOnline = (userId: string) => {
      setChatRooms(prev => prev.map(room => {
        if (room.participants.find(participant => participant._id === userId)) {
          return {
            ...room,
            participants: room.participants.map(participant =>
              participant._id === userId
                ? { ...participant, onlineStatus: true }
                : participant
            ),
          };
        }
        return room;
      }));
    };
  
    on('message_received', handleMessageReceived);
    on('user_offline', handleUserOffline);
    on('user_online', handleUserOnline);
  
    return () => {
      off('message_received', handleMessageReceived);
      off('user_offline', handleUserOffline);
      off('user_online', handleUserOnline);
    };
  }, [on, off, selectedRoomId]);

  return (
    <div className="fixed w-full h-full flex bg-chat-background">
      <ChatSidebar
        chatRooms={chatRooms}
        selectedRoomId={selectedRoomId}
        currentUser={currentUser}
        onRoomSelect={handleRoomSelect}
        onNewChat={handleNewChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {selectedRoom ? (
        <div className="flex-1 flex flex-col">
          <ChatWindow
            room={selectedRoom}
            setChatRooms={setChatRooms}
            messages={messages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedRoomId(undefined)}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-chat-background">
          <div className="text-center text-chat-text-muted">
            <h3 className="text-lg font-medium mb-2">Welcome to Chat</h3>
            <p>Select a conversation to start messaging with your teachers and classmates</p>
            {!connected && (
              <p className="text-sm text-destructive mt-2">
                Connecting to server...
              </p>
            )}
          </div>
        </div>
      )}
      <NewChatModal
        open={newChatModalOpen}
        onOpenChange={setNewChatModalOpen}
        currentUser={currentUser}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
};