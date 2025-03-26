import React from 'react';
import { Message } from '../../types/chat';
import { VoiceMessage } from './VoiceMessage';

interface MessageBubbleProps {
  message: Message;
  onImageClick?: (url: string) => void;
}

export function MessageBubble({ message, onImageClick }: MessageBubbleProps) {
  const isSender = message.sender_id === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'voice':
        return (
          <VoiceMessage
            url={message.media_url!}
            duration={message.duration!}
            isSender={isSender}
          />
        );
      case 'image':
        return (
          <img
            src={message.media_url}
            alt=""
            className="max-w-[200px] rounded-lg cursor-pointer"
            onClick={() => onImageClick?.(message.media_url!)}
          />
        );
      case 'emoji':
        return (
          <span className="text-4xl">{message.content}</span>
        );
      default:
        return (
          <p className="break-words">{message.content}</p>
        );
    }
  };

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isSender
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-white/10 text-white rounded-bl-none'
        }`}
      >
        {renderContent()}
        <div className="text-xs opacity-70 mt-1">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}
