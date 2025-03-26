import React, { useState, useRef } from 'react';
import { Play, Pause, Mic } from 'lucide-react';

interface VoiceMessageProps {
  url: string;
  duration: number;
  isSender: boolean;
}

export function VoiceMessage({ url, duration, isSender }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div
      className={`flex items-center space-x-2 px-4 py-2 rounded-2xl ${
        isSender
          ? 'bg-primary text-white'
          : 'bg-white/10 text-white'
      }`}
    >
      <button
        onClick={handlePlayPause}
        className="p-2 rounded-full hover:bg-white/10"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Mic className="w-4 h-4" />
          <div className="h-1 bg-white/20 rounded-full flex-1">
            <div
              className="h-full bg-white/60 rounded-full transition-all"
              style={{
                width: `${(currentTime / duration) * 100}%`
              }}
            />
          </div>
          <span className="text-xs">
            {Math.round(currentTime)}s / {Math.round(duration)}s
          </span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
