// components/IncomingCallModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Phone, PhoneOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCallContext } from '@/contexts/CallContext';

const RINGTONE_URL = '/sounds/ringtone.mp3';
const preloadAudio = () => {
  const audio = new Audio(RINGTONE_URL);
  audio.preload = 'auto';
  return audio;
};

export const GlobalIncomingCallModal: React.FC = () => {
  const { incomingCall, acceptCall, rejectCall } = useCallContext();
  const [isRinging, setIsRinging] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(preloadAudio());

  // Auto-reject call after 30 seconds with countdown
  useEffect(() => {
    if (incomingCall) {
      setIsRinging(true);
      setCountdown(30);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            rejectCall();
            setIsRinging(false);
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
        setIsRinging(false);
      };
    }
  }, [incomingCall, rejectCall]);

  // Play ringtone with preloaded audio
  useEffect(() => {
    const audio = audioRef.current;
    
    if (incomingCall && isRinging && audio) {
      try {
        audio.loop = true;
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.error('Failed to play ringtone:', error);
        });
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [incomingCall, isRinging]);

  const handleAcceptCall = () => {
    acceptCall();
  };

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] transition-all duration-300 ease-out">
      <div className="bg-gradient-to-bl from-sky-700/20 from-20% to-10% to-sky-950/30 backdrop-blur-3xl border border-sky-900/30 rounded-2xl rounded-tl-none p-10 text-center shadow-2xl max-w-sm mx-4 transform transition-all duration-500 ease-out scale-100 opacity-100">
        
        {/* Caller Avatar with Enhanced Pulsing Rings */}
        <div className="relative mb-8">
          <div className="relative">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full h-16 w-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-400/20 animate-ping scale-125 opacity-75"></div>
            {/* Middle pulsing ring */}
            <div className="absolute inset-0 rounded-full h-16 w-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-500/30 animate-ping scale-110 animation-delay-300"></div>
            {/* Inner pulsing ring */}
            <div className="absolute inset-0 rounded-full h-16 w-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-600/40 animate-ping scale-105 animation-delay-600"></div>
            
            <Avatar className="h-24 w-24 mx-auto relative z-10 border-4 border-sky-400/40 bg-gradient-to-br from-sky-600/80 to-sky-800/80">
              <AvatarFallback className="bg-gradient-to-br from-sky-600/90 to-sky-800/90 text-sky-100 text-2xl font-bold">
                {incomingCall.callName?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Call Info */}
        <div className="mb-8 space-y-3">
          <h3 className="text-xl font-bold text-sky-200/90 tracking-wide">
            Incoming Video Call
          </h3>
          <p className="text-lg font-semibold text-sky-300/80">
            {incomingCall.callName?.charAt(0).toUpperCase() + incomingCall.callName?.slice(1)}
          </p>
          <div className="flex items-center justify-center gap-2 text-sky-400/70">
            <Volume2 className="h-4 w-4 animate-caret-blink" />
            <span className="text-sm animate-caret-blink font-medium">Ringing...</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-8 justify-center mb-6">
          {/* Reject Button */}
          <div className="relative group">
            <Button
              onClick={rejectCall}
              className="relative cursor-pointer bg-red-500/80 hover:bg-red-500 border border-red-400/30 rounded-full w-16 h-16 p-0 shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-110 active:scale-95 group-hover:shadow-red-500/20 group-hover:shadow-xl"
              title="Decline Call"
            >
              <PhoneOff className="h-6 w-6 text-white" />
            </Button>
          </div>
          
          {/* Accept Button with Enhanced Animation */}
          <div className="relative group">
            {/* Multiple pulsing rings for accept button */}
            <div className="absolute inset-0 h-12 w-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-400/30 rounded-full animate-ping scale-110"></div>
            <div className="absolute inset-0 h-12 w-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500/20 rounded-full animate-ping scale-125 animation-delay-200"></div>
            <div className="absolute inset-0 h-12 w-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600/15 rounded-full animate-ping scale-140 animation-delay-400"></div>
            
            <Button
              onClick={handleAcceptCall}
              className="relative cursor-pointer bg-green-500/80 hover:bg-green-500 border border-green-400/30 rounded-full w-16 h-16 p-0 shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-110 active:scale-95 group-hover:shadow-green-500/20 group-hover:shadow-xl z-10"
              title="Accept Call"
            >
              <Phone className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>

        {/* Enhanced Countdown Display */}
        <div className="space-y-3">
          <div className="text-xs text-sky-400/70 bg-sky-950/30 rounded-lg px-4 py-2 border border-sky-800/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 bg-sky-400/60 rounded-full animate-pulse"></div>
              <span>Auto-decline in {countdown}s</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-sky-950/40 rounded-full h-1.5 overflow-hidden border border-sky-800/20">
            <div 
              className="h-full bg-gradient-to-r from-sky-400/60 via-sky-500/60 to-sky-600/60 transition-all duration-1000 ease-linear rounded-full"
              style={{ 
                width: `${(countdown / 30) * 100}%`,
                boxShadow: '0 0 8px rgba(56, 189, 248, 0.3)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
