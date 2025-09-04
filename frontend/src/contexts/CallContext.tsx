// contexts/CallContext.tsx
import { useSocket } from '@/components/hooks/useSocket';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface IncomingCall {
  callerId: string;
  callName: string;
  chatId: string;
  receiverId: string;
}

interface CallContextType {
  incomingCall: IncomingCall | null;
  showIncomingCall: (callData: IncomingCall) => void;
  hideIncomingCall: () => void;
  acceptCall: () => void;
  rejectCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};

interface CallProviderProps {
  children: ReactNode;
  serverUrl: string;
  currentUserId: string;
}

export const CallProvider: React.FC<CallProviderProps> = ({
  children,
  serverUrl,
  currentUserId,
}) => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const { emit, on, off } = useSocket(serverUrl, currentUserId);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Listen for incoming calls
    on('incoming-call', (callData: IncomingCall) => {
      console.log('Incoming call:', callData);
      setIncomingCall(callData);
    });

    // Listen for call ended/rejected from caller side
    on('end-call', () => {
      console.log('Call ended');
      setIncomingCall(null);
    });

    on('call-rejected', () => {
      setIncomingCall(null);
      console.log('Call rejected');
    });

    return () => {
      off('incoming-call');
      off('end-call');
      off('call-rejected');
    };
  }, [on, off]);

  const showIncomingCall = (callData: IncomingCall) => {
    setIncomingCall(callData);
  };

  const hideIncomingCall = () => {
    setIncomingCall(null);
  };

  const acceptCall = () => {
    if (incomingCall) {
      navigate(`/video-call/${incomingCall.chatId}?target=${incomingCall.callerId}&calleName=${incomingCall.callName}`);
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      emit('call-rejected', { chatId: incomingCall.chatId });
      emit('end-call', { chatId: incomingCall.chatId });
      setIncomingCall(null);
    }
  };

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        showIncomingCall,
        hideIncomingCall,
        acceptCall,
        rejectCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
