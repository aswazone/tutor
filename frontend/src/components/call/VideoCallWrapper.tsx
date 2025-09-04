// components/call/VideoCallWrapper.tsx
import React from 'react';
import VideoCall from './VideoCall';
import { useAuth } from '@/hooks/useAuth';

const VideoCallWrapper: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <div>Please log in</div>;
  }

  return <VideoCall />;
};

export default VideoCallWrapper;
