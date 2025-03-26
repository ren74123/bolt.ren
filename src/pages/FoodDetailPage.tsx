import React, { useState, useRef, useEffect } from 'react';
import { X, Search, RotateCw, Heart, MessageCircle, Share2, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  created_at: string;
}

export function FoodDetailPage() {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showQuickTags, setShowQuickTags] = useState(false);
  const [showNewMessageTip, setShowNewMessageTip] = useState(false);

  const quickTags = ['太香了！', '求地址', '明天就去打卡'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewMessageTip(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'User',
        avatar: 'https://source.unsplash.com/random/100x100?avatar'
      },
      content: newComment,
      likes: 0,
      created_at: new Date().toISOString()
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => navigate(-1)} className="p-2">
            <X className="w-6 h-6" />
          </button>
          <div className="flex space-x-4">
            <button className="p-2">
              <Search className="w-6 h-6" />
            </button>
            <button className="p-2">
              <RotateCw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-14 pb-24">
        <div className="px-4 space-y-6">
          {/* AI Analysis */}
          <div className="space-y-4 pt-4">
            <div>
              <h2 className="text-xl font-bold">AI分析</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-400">图片创作</span>
                <span className="text-primary">发现我的内容</span>
              </div>
            </div>

            {/* Score */}
            <div className="flex justify-between items-baseline">
              <div className="text-4xl font-bold">16.5/</div>
              <div className="text-right">
                <div>1650426286</div>
                <div className="text-gray-400">2025/3</div>
              </div>
            </div>

            {/* Style Tag */}
            <div className="flex justify-between items-center py-2">
              <span className="text-lg">复古风格</span>
              <div className="flex items-center space-x-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-gray-400">0 回复</span>
              </div>
            </div>

            <div className="h-px bg-white/10 my-6" />

            {/* Keywords */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">标题</h3>
              <div className="space-y-3">
                <div className="text-gray-300">经典文字</div>
                <div className="text-gray-300">素材</div>
                <div className="text-gray-300">科技感，古风街</div>
                <div className="text-gray-300">博朋克城市</div>
              </div>
            </div>

            {/* Engagement */}
            <div className="flex justify-between items-center pt-4">
              <span className="text-gray-400">16:50</span>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <div className="py-3">
              <span className="text-gray-400">1 评论</span>
            </div>
            {comments.map(comment => (
              <div key={comment.id} className="py-4 border-t border-white/10">
                <div className="flex space-x-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium mb-1">{comment.user.name}</div>
                    <p className="text-gray-300">{comment.content}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <button className="text-gray-400 text-sm flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-gray-400 text-sm">回复</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-white/10">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQuickTags(!showQuickTags)}
              className="p-2 rounded-full bg-white/10 flex-shrink-0"
            >
              <Smile className="w-6 h-6" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评论..."
                className="w-full px-4 py-2 bg-white/10 rounded-full text-white placeholder-gray-400"
              />
              {showQuickTags && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/10 rounded-xl p-2 z-50">
                  <div className="flex flex-wrap gap-2">
                    {quickTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setNewComment(tag);
                          setShowQuickTags(false);
                        }}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                handleCommentSubmit();
                setShowQuickTags(false);
              }}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-primary rounded-full disabled:opacity-50 flex-shrink-0"
            >
              发送
            </button>
          </div>
        </div>
      </div>

      {/* New Message Tip */}
      {showNewMessageTip && (
        <div 
          className="fixed bottom-24 right-4 z-30 bg-primary px-3 py-1.5 rounded-full text-sm animate-bounce cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShowNewMessageTip(false);
          }}
        >
          有新消息
        </div>
      )}
    </div>
  );
}
