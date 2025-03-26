import React, { useState, useRef } from 'react';
import { ArrowLeft, Share2, Heart, MessageCircle, Bookmark, Smile } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ContentItem {
  id: string;
  type?: 'image' | '3d_scene';
  title?: string;
  content_url?: string;
  imageUrl?: string;
  description?: string;
  creator?: {
    id: string;
    username: string;
    avatar_url: string;
  };
  author?: {
    name: string;
    avatar: string;
  };
  likes_count?: number;
  comments_count?: number;
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  time: string;
}

interface FullScreenViewerProps {
  item: ContentItem;
  onClose: () => void;
}

export function FullScreenViewer({ item, onClose }: FullScreenViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const swiperRef = useRef<SwiperType>();

  // Mock data
  const images = [
    item.content_url || item.imageUrl,
    'https://source.unsplash.com/random/1000x1000?art=1',
    'https://source.unsplash.com/random/1000x1000?art=2'
  ];

  const comments: Comment[] = [
    {
      id: '1',
      user: {
        name: '设计爱好者',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=1'
      },
      content: '构图绝了！求调色参数！',
      time: '3小时前'
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    // Handle comment submission
    setNewComment('');
  };

  return (
    <div className="detail-container fixed inset-0 bg-white z-50 flex flex-col">
      {/* Top Bar */}
      <div className="top-bar flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={onClose} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button className="p-2">
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      {/* Gallery Section */}
      <div className="gallery-section h-[60vh] bg-black">
        <Swiper
          modules={[Navigation, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={() => {
            setCurrentIndex(swiperRef.current?.activeIndex! + 1);
          }}
          navigation
          pagination={{ type: 'fraction' }}
          className="h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="h-full flex items-center justify-center">
                <img
                  src={image}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Author Info */}
      <div className="sticky-header bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-gray-100">
        <div className="author-info flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={item.creator?.avatar_url || item.author?.avatar || 'https://source.unsplash.com/random/100x100?portrait'}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <span className="username font-medium">
              @{item.creator?.username || item.author?.name || '摄影达人'}
            </span>
          </div>
          <button
            onClick={handleFollow}
            className={`follow-btn px-4 py-1.5 rounded-full text-sm font-medium ${
              isFollowing
                ? 'bg-gray-100 text-gray-600'
                : 'bg-primary text-white'
            }`}
          >
            {isFollowing ? '已关注' : '+ 关注'}
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="description px-4 py-3">
        <p className="text-gray-700">
          「古风街夜景」霓虹灯与青石板路的碰撞，赛博朋克×传统美学的实验性创作
        </p>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons flex justify-around py-3 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            isLiked ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          <span>2.1k</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-600">
          <MessageCircle className="w-6 h-6" />
          <span>{comments.length}</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-600">
          <Bookmark className="w-6 h-6" />
          <span>收藏</span>
        </button>
      </div>

      {/* Comments */}
      <div className="comment-list flex-1 overflow-y-auto px-4">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item flex space-x-3 py-4 border-t border-gray-100">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>
              <p className="text-gray-700 mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Input */}
      <div className="fixed-input fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="input-wrapper flex items-center space-x-2">
          <button className="p-2">
            <Smile className="w-6 h-6 text-gray-400" />
          </button>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="说点什么... @用户 😊"
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-primary text-white rounded-full disabled:opacity-50"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
