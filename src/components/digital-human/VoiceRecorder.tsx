import React, { useState, useEffect } from 'react';
import { Mic, StopCircle, Play, Trash2 } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordComplete: (sample: string) => void;
}

export function VoiceRecorder({ onRecordComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setAudioUrl(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    // 模拟录音完成
    setAudioUrl('mock-audio-url');
  };

  const handleSave = () => {
    if (audioUrl) {
      onRecordComplete(audioUrl);
      setAudioUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recording Button */}
      <div className="relative w-48 h-48 mx-auto">
        <div className={`absolute inset-0 bg-primary/10 rounded-full ${
          isRecording ? 'animate-ping' : ''
        }`} />
        <button
          onMouseDown={handleStartRecording}
          onMouseUp={handleStopRecording}
          onTouchStart={handleStartRecording}
          onTouchEnd={handleStopRecording}
          className="absolute inset-0 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          {isRecording ? (
            <StopCircle className="w-12 h-12 text-red-500" />
          ) : (
            <Mic className="w-12 h-12 text-primary" />
          )}
        </button>
      </div>

      {/* Recording Time */}
      {isRecording && (
        <div className="text-center text-2xl font-medium text-primary">
          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
        </div>
      )}

      {/* Preview Controls */}
      {audioUrl && (
        <div className="flex justify-center space-x-4">
          <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
            <Play className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={() => setAudioUrl(null)}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <Trash2 className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      )}

      {/* Save Button */}
      {audioUrl && (
        <button
          onClick={handleSave}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium"
        >
          保存录音
        </button>
      )}
    </div>
  );
}
