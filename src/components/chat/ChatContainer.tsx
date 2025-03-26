import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { EmotionAnalysis } from './EmotionAnalysis';
import { Message, MessageCategory } from '../../types/chat';

interface ChatContainerProps {
  conversationId: string;
  onBack: () => void;
}

export function ChatContainer({ conversationId, onBack }: ChatContainerProps) {
  const { messages, loading, error, sendMessage } = useChat(conversationId);
  const [messageCategory, setMessageCategory] = useState<MessageCategory>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const message = await sendMessage(content, {
      category: messageCategory,
    });

    if (message) {
      setMessageCategory('chat');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
        >
          返回
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-b border-white/10 z-20">
        <div className="flex items-center p-4">
          <button
            onClick={onBack}
            className="p-2 text-white hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-16 pb-20">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-white/10 p-4">
        <ChatInput
          onSend={handleSendMessage}
          category={messageCategory}
          onCategoryChange={setMessageCategory}
        />
      </div>
    </div>
  );
}
