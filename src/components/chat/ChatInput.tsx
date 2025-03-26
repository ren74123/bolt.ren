import React, { useState } from 'react';
import { Smile, Image, Paperclip, Send, Calendar, FileText, Code } from 'lucide-react';
import { MessageCategory } from '../../types/chat';

interface ChatInputProps {
  onSend: (content: string) => void;
  category: MessageCategory;
  onCategoryChange: (category: MessageCategory) => void;
}

export function ChatInput({ onSend, category, onCategoryChange }: ChatInputProps) {
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

  const categoryButtons = [
    { type: 'meeting' as MessageCategory, icon: Calendar },
    { type: 'file' as MessageCategory, icon: FileText },
    { type: 'code' as MessageCategory, icon: Code },
  ];

  return (
    <div className="space-y-2">
      {/* Category Selector */}
      <div className="flex space-x-2 px-2">
        {categoryButtons.map(({ type, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onCategoryChange(type)}
            className={`p-1.5 rounded-full transition-colors ${
              category === type
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-white/10'
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center space-x-2">
        <button className="p-2 text-white hover:bg-white/10 rounded-full">
          <Smile className="w-6 h-6" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`发送${category === 'chat' ? '消息' : category === 'meeting' ? '会议内容' : category === 'file' ? '文件消息' : '代码片段'}...`}
            className="w-full px-4 py-2 bg-white/10 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary placeholder-white/50"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button className="p-2 text-white hover:bg-white/20 rounded-full">
              <Image className="w-5 h-5" />
            </button>
            <button className="p-2 text-white hover:bg-white/20 rounded-full">
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
