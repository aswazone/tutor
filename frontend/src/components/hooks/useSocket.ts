
import { SocketEvents } from '@/types/socket.type';
import { useEffect, useRef } from 'react';
import { default as io, Socket } from 'socket.io-client';
export const useSocket = (serverUrl: string, userId?: string) => {
  
  const socketRef = useRef<typeof Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    socketRef.current = io(serverUrl, {
      auth: {
        userId,
      },
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server to client-socket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    //@ts-expect-error - The 'connect_error' event is not typed in the socket.io-client library
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl, userId]);

  const emit = <K extends keyof SocketEvents>(
    event: K,
    ...args: Parameters<SocketEvents[K]>
  ) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, ...args);
    }
  };

  const on = (event: string, handler: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  };

  const off = (event: string, handler?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  };

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    connected: socketRef.current?.connected || false,
  };

};