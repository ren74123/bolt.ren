import React from 'react';
import { Users } from 'lucide-react';

interface ThemeRoomProps {
  id: string;
  name: string;
  preview: string;
  online: number;
  requirement: string;
  onClick: () => void;
}

export function ThemeRoom({
  name,
  preview,
  online,
  requirement,
  onClick
}: ThemeRoomProps) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-60 bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <img
          src={preview}
          alt={name}
          className="w-full h-24 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center text-white space-x-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">{online}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1">{name}</h3>
        <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
          {requirement}
        </span>
      </div>
    </div>
  );
}
