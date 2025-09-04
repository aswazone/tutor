import { ReactNode } from "react";

export interface CallProviderProps {
  children: ReactNode;
  serverUrl: string;
  currentUserId: string;
}

export interface IncomingCall {
  callerId: string;
  callName: string;
  chatId: string;
  receiverId: string;
}

export interface CallContextType {
  incomingCall: IncomingCall | null;
  showIncomingCall: (callData: IncomingCall) => void;
  hideIncomingCall: () => void;
  acceptCall: () => void;
  rejectCall: () => void;
}