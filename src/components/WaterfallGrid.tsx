import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface WaterfallGridProps {
  items: any[];
  onItemClick: (item: any) => void;
}

export function WaterfallGrid({ items, onItemClick }: WaterfallGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative group cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          onClick={() => onItemClick(item)}
        >
          <img
            src={item.imageUrl}
            alt=""
            className="w-full aspect-[3/4] object-cover"
            loading="lazy"
          />
          
          {item.type === '3d' && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
              3D
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center space-x-2">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-6 h-6 rounded-full border border-white/50"
                loading="lazy"
              />
              <span className="text-white text-sm font-medium truncate">
                {item.author.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-white">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs">{item.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{item.comments}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
