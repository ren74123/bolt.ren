import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface Author {
  name: string;
  avatar: string;
}

interface ContentCardProps {
  type: 'image' | '3d';
  coverUrl: string;
  title: string;
  hint: string;
  author: Author;
  likes: number;
  comments: number;
  isHot?: boolean;
  isNew?: boolean;
  isFollowed?: boolean;
  onClick: () => void;
}

export function ContentCard({
  type,
  coverUrl,
  title,
  hint,
  author,
  likes,
  comments,
  isHot,
  isNew,
  isFollowed,
  onClick,
}: ContentCardProps) {
  return (
    <div
      className="relative group cursor-pointer rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <img
        src={coverUrl}
        alt={title}
        className={`w-full ${type === 'image' ? 'aspect-[3/4]' : 'aspect-video'} object-cover`}
        loading="lazy"
      />
      
      {/* Tags */}
      <div className="absolute top-1 left-1 flex gap-1">
        {isHot && (
          <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">
            热门
          </span>
        )}
        {isNew && (
          <span className="px-1.5 py-0.5 text-[10px] bg-green-500 text-white rounded-full">
            最新
          </span>
        )}
        {isFollowed && (
          <span className="px-1.5 py-0.5 text-[10px] bg-blue-500 text-white rounded-full">
            关注
          </span>
        )}
      </div>

      {type === '3d' && (
        <div className="absolute top-1 right-1 bg-black/50 text-white px-1.5 py-0.5 rounded-full text-[10px]">
          3D
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center space-x-1 mb-1">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-4 h-4 rounded-full border border-white/50"
            loading="lazy"
          />
          <span className="text-white text-xs font-medium truncate">
            {author.name}
          </span>
        </div>
        
        <p className="text-white/90 text-xs mb-1 line-clamp-1">{title}</p>
        <p className="text-white/70 text-[10px] mb-1">{hint}</p>
        
        <div className="flex items-center space-x-2 text-white">
          <div className="flex items-center space-x-0.5">
            <Heart className="w-3 h-3" />
            <span className="text-[10px]">{likes}</span>
          </div>
          <div className="flex items-center space-x-0.5">
            <MessageCircle className="w-3 h-3" />
            <span className="text-[10px]">{comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
