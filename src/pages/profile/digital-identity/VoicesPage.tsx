import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Play, Pause, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface Voice {
  id: string;
  name: string;
  duration: number;
  created_at: string;
}

export function VoicesPage() {
  const navigate = useNavigate();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    loadVoices();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const loadVoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        navigate('/login');
        return;
      }

      // In a real app, you would fetch voices from a table
      // For now, we'll use mock data
      setVoices([
        {
          id: '1',
          name: '默认声音',
          duration: 30,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: '商务声音',
          duration: 45,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Error loading voices:', err);
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real app, you would save the recording
    const newVoice = {
      id: Date.now().toString(),
      name: '新录音',
      duration: recordingTime,
      created_at: new Date().toISOString()
    };
    setVoices([...voices, newVoice]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/profile')} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">声音管理</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Recording Button */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
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
              <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500' : 'text-primary'}`} />
            </button>
          </div>
          {isRecording && (
            <div className="text-xl font-medium text-primary">
              {formatTime(recordingTime)}
            </div>
          )}
        </div>

        {/* Voice List */}
        <div className="space-y-4">
          {voices.map(voice => (
            <div
              key={voice.id}
              className="bg-white rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{voice.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatTime(voice.duration)} · {new Date(voice.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPlaying(playing === voice.id ? null : voice.id)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  {playing === voice.id ? (
                    <Pause className="w-5 h-5 text-primary" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
