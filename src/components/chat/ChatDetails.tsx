import React, { useState, useEffect } from 'react';
import { ArrowLeft, Smile, Image, Paperclip, Send } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { ChatScene } from './ChatScene';
import { EmotionAnalysis } from './EmotionAnalysis';
import { MessageBubble } from './MessageBubble';
import { useChat } from '../../hooks/useChat';

interface ChatDetailsProps {
  contact: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
  };
  onBack: () => void;
}

export function ChatDetails({ contact, onBack }: ChatDetailsProps) {
  const { messages, sendMessage } = useChat(contact.id);
  const [newMessage, setNewMessage] = useState('');
  const [currentScene, setCurrentScene] = useState('default');
  const [emotion, setEmotion] = useState({
    type: 'neutral' as const,
    intensity: 50,
    confidence: 85
  });

  useEffect(() => {
    // 模拟情感分析
    const timer = setInterval(() => {
      setEmotion(prev => ({
        ...prev,
        intensity: Math.min(100, Math.max(0, prev.intensity + (Math.random() - 0.5) * 20)),
        confidence: Math.min(100, Math.max(70, prev.confidence + (Math.random() - 0.5) * 10))
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-b border-white/10 z-20">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-white">
              <h2 className="font-medium">{contact.name}</h2>
              <p className="text-xs opacity-70">{contact.online ? '在线' : '离线'}</p>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <ChatScene scene={currentScene} />
        </Canvas>
      </div>

      {/* Emotion Analysis */}
      <div className="fixed top-20 right-4 w-64 z-10">
        <EmotionAnalysis emotion={emotion} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-16 pb-20 px-4 space-y-4">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-white/10 p-4 z-20">
        <div className="flex items-center space-x-3">
          <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <Smile className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="说点什么..."
              className="w-full px-4 py-2 bg-white/10 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary placeholder-white/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button className="p-2 text-white hover:bg-white/10 rounded-full">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-2 text-white hover:bg-white/10 rounded-full">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
