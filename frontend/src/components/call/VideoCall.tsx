import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Expand, Mic, MicOff, PhoneOff, Shrink, Users, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, } from "@/components/ui/avatar";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";
import { env } from "@/config/env.config";

const VideoCall = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const targetId = searchParams.get("target");
  const callName = searchParams.get("callName");
  const user = useAuth().user;
  const {socket} = useSocket(env.API_URL,user?._id)

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // State management
  const [callStarted, setCallStarted] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<string>("Initializing...");
  const [error, setError] = useState<string>("");

  // Timer for call duration
  const callTimerRef = useRef<NodeJS.Timeout>(null);


  // Call duration timer
  useEffect(() => {
    if (callConnected) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callConnected]);

  const cleanup = useCallback(() => {
    // Clear timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }

    // Close peer connection
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    // Leave room and cleanup socket? listeners
    socket?.emit("leave-video-room", chatId);
    socket?.off("webrtc-offer");
    socket?.off("webrtc-answer");
    socket?.off("ice-candidate");
    socket?.off("end-call");
    socket?.off("call-rejected");
  },[chatId,socket]);

  const setupSocketListeners = useCallback(() => {
    socket?.on("webrtc-offer", async ({ offer }:{offer:RTCSessionDescription}) => {
      try {
        if (!peerConnectionRef.current) return;
        
        setConnectionStatus("Receiving call...");
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        socket?.emit("webrtc-answer", { chatId, answer, senderId: socket?.id });
        setCallStarted(true);
      } catch (err) {
        console.error("Error handling offer:", err);
        setError("Failed to process incoming call");
      }
    });

    socket?.on("webrtc-answer", async ({ answer }: { answer: RTCSessionDescription }) => {
      try {
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        setConnectionStatus("Call answered");
      } catch (err) {
        console.error("Error handling answer:", err);
        setError("Failed to process call answer");
      }
    });

    socket?.on("ice-candidate", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      } catch (err) {
        console.error("ICE candidate error:", err);
      }
    });

    socket?.on("end-call", () => {
      toast.info("The other user ended the call");
      cleanup();
      navigate(-1);
    });

    socket?.on("call-rejected", () => {
      toast.error("Call was rejected");
      cleanup();
      navigate(-1);
    });
  },[chatId,navigate,socket,cleanup]);

    const initializeCall = useCallback(() => {
    if (!chatId) {
      setError("Invalid chat ID");
      return;
    }

    socket?.emit("join-video-room", chatId);
    setConnectionStatus("Connecting...");

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    peerConnectionRef.current = peerConnection;

    // Connection state monitoring
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      console.log("Connection state:", state);
      
      switch (state) {
        case "connecting":
          setConnectionStatus("Connecting...");
          break;
        case "connected":
          setConnectionStatus("Connected");
          setCallConnected(true);
          setIsConnecting(false);
          break;
        case "disconnected":
          setConnectionStatus("Disconnected");
          setCallConnected(false);
          break;
        case "failed":
          setConnectionStatus("Connection failed");
          setError("Failed to establish connection");
          break;
        case "closed":
          setConnectionStatus("Connection closed");
          break;
      }
    };

    // ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", {
          chatId,
          candidate: event.candidate,
          senderId: socket?.id,
        });
      }
    };

    // Remote stream handling
    peerConnection.ontrack = (event) => {
      console.log("Received remote stream");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnectionStatus("Connected");
        setCallConnected(true);
      }
    };

    // Socket event listeners
    setupSocketListeners();
  }, [chatId, socket,setupSocketListeners]);

  const startCall = async () => {
    try {
      setIsConnecting(true);
      setConnectionStatus("Starting call...");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
      });

      const offer = await peerConnectionRef.current?.createOffer();
      await peerConnectionRef.current?.setLocalDescription(offer);

      socket?.emit("incoming-call", {
        callerId: socket?.id,
        callName: callName,
        chatId,
        receiverId: targetId,
      });

      socket?.emit("webrtc-offer", {
        chatId,
        offer,
        callName,
        senderId: socket?.id,
        receiverId: targetId,
      });

      setCallStarted(true);
      setConnectionStatus("Calling...");
    } catch (err) {
      console.error("Failed to start call:", err);
      setError("Failed to access camera/microphone. Please check permissions.");
      setIsConnecting(false);
    }
  };

  const handleMute = () => {
    if (!localStreamRef.current) return;
    
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted((prev) => !prev);
  };

  const handleToggleVideo = () => {
    if (!localStreamRef.current) return;
    
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoOff((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const hangUp = () => {
    socket?.emit("end-call", { chatId });
    cleanup();
    navigate(-1);
  };

  

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  
  useEffect(() => {
    initializeCall();
    return cleanup;
  }, [chatId, initializeCall, cleanup]);
  

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Remote video (full screen) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Remote video placeholder when not connected */}
      {!callConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <AvatarFallback className="bg-gray-700 text-white text-4xl">
                {callName?.[0]?.toUpperCase() || <Users className="h-16 w-16" />}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold mb-2">{callName && callName?.charAt(0).toUpperCase() + callName?.slice(1) || "Connecting..."}</h2>
            <p className="text-gray-400">{connectionStatus}</p>
            {isConnecting && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Local video (picture-in-picture) */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className={`absolute bottom-30 right-4 w-40 h-28 rounded-lg border-2 border-sky-800/60 object-cover shadow-lg transition-opacity ${
          isVideoOff ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Local video placeholder when camera is off */}
      {isVideoOff && (
        <div className="absolute bottom-20 right-4 w-40 h-28 rounded-lg border-2 border-white bg-gray-800 flex items-center justify-center">
          <VideoOff className="text-2xl text-gray-400" />
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{callName || "Video Call"}</h1>
              <p className="text-sm text-gray-300">
                {callConnected ? formatCallDuration(callDuration) : connectionStatus}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Shrink /> : <Expand />}
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute top-20 left-4 right-4 bg-red-600 text-white p-3 rounded-lg z-20">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Call controls */}
      {!callStarted ? (
        <div className="absolute bottom-18 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={startCall}
            disabled={isConnecting}
            className="cursor-pointer bg-gradient-to-l from-green-500/50 via-green-500/60 to-green-500/60 hover:bg-green-500/70 text-white px-8 py-4 rounded-full shadow-lg text-lg font-semibold disabled:opacity-50"
          >
            {isConnecting ? "Connecting..." : "Start Call"}
          </Button>
        </div>
      ) : (
        <div className="absolute bottom-18 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
          {/* Mute/Unmute */}
          <Button
            onClick={handleMute}
            className={`cursor-pointer p-4 rounded-full text-white text-xl shadow-lg transition-colors ${
              isMuted 
                ? "bg-red-600 hover:bg-red-500" 
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <Mic /> : <MicOff />}
          </Button>

          {/* Video on/off */}
          <Button
            onClick={handleToggleVideo}
            className={`cursor-pointer p-4 rounded-full text-white text-xl shadow-lg transition-colors ${
              isVideoOff 
                ? "bg-red-600 hover:bg-red-500" 
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            title={isVideoOff ? "Turn on camera" : "Turn off camera"}
          >
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>

          {/* Hang up */}
          <Button
            onClick={hangUp}
            className="cursor-pointer bg-red-600 hover:bg-red-500 p-4 rounded-full text-white text-xl shadow-lg"
            title="End call"
          >
            <PhoneOff />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
