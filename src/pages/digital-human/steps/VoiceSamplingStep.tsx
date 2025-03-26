import React, { useState, useEffect } from 'react';
import { Mic, StopCircle } from 'lucide-react';

interface VoiceSamplingStepProps {
  onComplete: (samples: string[]) => void;
}

export function VoiceSamplingStep({ onComplete }: VoiceSamplingStepProps) {
  const [samples, setSamples] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

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
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    // Simulate adding a sample
    setSamples(prev => [...prev, `sample-${prev.length + 1}`]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">语音采样</h2>
        <p className="text-gray-500">完成3次录音以创建您的声音模型</p>
      </div>

      {/* Recording Animation */}
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

      {/* Recording Progress */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>已完成录音 {samples.length}/3</span>
          {isRecording && <span>{recordingTime}s</span>}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(samples.length / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Next Button */}
      {samples.length === 3 && (
        <button
          onClick={() => onComplete(samples)}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium"
        >
          下一步
        </button>
      )}
    </div>
  );
}
