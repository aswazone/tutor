import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Chapter } from "@/types/course.type";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import QuickNotes from "./QuickNotes";
import { ShinyButton } from "../magicui/shiny-button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// export interface ChapterNote {
//   id: string;
//   timestamp: number;
//   text: string;
//   chapterId: string;
//   userId: string;
//   createdAt: Date;
// }

export interface VideoPlayerProgress {
  progressValue?: number;
  progressData: Chapter;
}

interface VideoPlayerProps {
  width?: string;
  height?: string;
  url: string;
  onProgressUpdate: (data: Chapter) => void;
  progressData: Chapter | undefined;
  // notes: ChapterNote[];
  onAddNote: (timestamp: number, text: string) => void;
  // onSeekToTimestamp: (timestamp: number) => void;
}

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
  onAddNote,
}: VideoPlayerProps) {

  const {notes} = useSelector((state: RootState) => state.note);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');

  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handlePlayAndPause() {
    setPlaying(!playing);
  }

  function handleProgress(state: { played: number }) {
    if (!seeking) {
      setPlayed(state.played);
    }
  }

  function handleRewind() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5);
  }

  function handleForward() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5);
  }

  function handleToggleMute() {
    setMuted(!muted);
  }

  function handleSeekChange(newValue:number[]) {
    // console.log(newValue);
    setPlayed(newValue[0]);
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    playerRef.current?.seekTo(played);
    console.log(played,'in mouse up');
  }

  function handleVolumeChange(newValue:number[]) {
    setVolume(newValue[0]);
  }


  const formatTime = (seconds: number): string => {
    const pad = (num: number): string => num.toString().padStart(2, '0');
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current?.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  function handleMouseMove() {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }

  const handleAddNoteClick = useCallback(() => {
    setNoteText('');
    setShowNoteDialog(true);
  }, []);

  const handleSaveNote = useCallback(() => {
    if (!noteText.trim()) return;
    onAddNote(playerRef.current?.getCurrentTime() || 0, noteText.trim());
    setShowNoteDialog(false);
    setNoteText('');
  }, [noteText, onAddNote]);

  const handleNoteClick = useCallback((timestamp: number) => {
    playerRef.current?.seekTo(timestamp);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // console.log(played, "played");

  useEffect(() => {
    if (played === 1) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      } as Chapter);
    }
  }, [played]);

  return (
    <div className="relative">
      <div
        ref={playerContainerRef}
        className={`relative bg-gradient-to-l from-[#111826]/60 via-background/30 to-[#111826]/60 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
        ${isFullScreen ? "w-screen h-screen" : ""}
        `}
        style={{ width, height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
      >
        <ReactPlayer
          ref={playerRef}
          className="absolute top-0 left-0"
          width="100%"
          height="100%"
          url={url}
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
        />
        {showControls && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 p-3 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <Slider
              value={[played * 100]}
              max={100}
              step={0.1}
              onValueChange={(value) => {handleSeekChange([value[0] / 100])}}
              onValueCommit={handleSeekMouseUp}
              className="w-full mb-3"
            />
            {notes?.map((note, index) => (
              <div
                key={index}
                className="absolute top-4 -translate-y-1/2 w-2 h-2.5 rounded-xs bg-sky-400 cursor-pointer transform hover:scale-150 transition-transform"
                style={{
                  left: `${(note.timestamp / (playerRef?.current?.getDuration() || 1)) * 100}%`,
                }}
                onClick={() => console.log(note.timestamp)}
                title={note.text}
              />
            ))}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayAndPause}
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                >
                  {playing ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <Button
                  onClick={handleRewind}
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                  variant="ghost"
                  size="icon"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
                <Button
                  onClick={handleForward}
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                  variant="ghost"
                  size="icon"
                >
                  <RotateCw className="h-6 w-6" />
                </Button>
                <Button
                  onClick={handleToggleMute}
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                  variant="ghost"
                  size="icon"
                >
                  {muted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                  className="w-24 "
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-white text-xs">
                  {formatTime(played * (playerRef?.current?.getDuration() || 0))}/{" "}
                  {formatTime(playerRef?.current?.getDuration() || 0)}
                </div>
                <Button
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                  variant="ghost"
                  size="icon"
                  onClick={handleFullScreen}
                >
                  {isFullScreen ? (
                    <Minimize className="h-6 w-6" />
                  ) : (
                    <Maximize className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
        <ShinyButton className="absolute z-1 -bottom-19 right-0 rounded-r-none rounded-bl-none border-r-0" onClick={handleAddNoteClick}>Add Note</ShinyButton>
        <Dialog
         open={showNoteDialog} onOpenChange={setShowNoteDialog}>
          <DialogContent className="bg-[#071322f1] backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
            </DialogHeader>
            <Textarea
              className="focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none"
              placeholder="Type your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <DialogFooter>
              <Button className="hover:text-red-500"  onClick={() => setShowNoteDialog(false)} variant="ghost">
                Cancel
              </Button>
              <Button className="hover:text-sky-500" variant={"outline"} onClick={handleSaveNote}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <QuickNotes handleNoteClick={handleNoteClick}/>
    </div>
  );
}

export default VideoPlayer;