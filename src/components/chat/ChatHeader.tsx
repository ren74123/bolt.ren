import React from 'react';
import { User, Settings } from 'lucide-react';

interface ChatHeaderProps {
  name: string;
  online: boolean;
  onModeSwitch: () => void;
}

export function ChatHeader({ name, online, onModeSwitch }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        <button onClick={onModeSwitch} className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-left">
            <h2 className="font-medium">{name}</h2>
            <p className="text-xs text-gray-500">{online ? '在线' : '离线'}</p>
          </div>
        </button>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
