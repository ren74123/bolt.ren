import React, { useState } from 'react';
import { ArrowLeft, Trophy, TrendingUp, Users, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Ranking {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  change: number;
}

interface RankingCategory {
  id: string;
  name: string;
  icon: typeof Trophy;
  color: string;
}

export function RankingsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('creation');

  const categories: RankingCategory[] = [
    { id: 'creation', name: '创作榜', icon: Trophy, color: '#FFD700' },
    { id: 'trending', name: '热度榜', icon: TrendingUp, color: '#FF6B6B' },
    { id: 'influence', name: '影响力榜', icon: Users, color: '#4ECDC4' }
  ];

  // Mock rankings data
  const rankings: Ranking[] = Array(10).fill(null).map((_, i) => ({
    id: `user-${i}`,
    name: `用户${i + 1}`,
    avatar: `https://source.unsplash.com/random/100x100?portrait=${i}`,
    score: Math.floor(Math.random() * 10000),
    rank: i + 1,
    change: Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1)
  }));

  const currentUserRank: Ranking = {
    id: 'current-user',
    name: '我的账号',
    avatar: 'https://source.unsplash.com/random/100x100?portrait=me',
    score: 3500,
    rank: 42,
    change: 2
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/profile')} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">排行榜</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4">
        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-3 rounded-xl flex flex-col items-center space-y-2 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Current User Rank */}
        <div className="bg-white rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={currentUserRank.avatar}
                alt={currentUserRank.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                {currentUserRank.rank}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{currentUserRank.name}</h3>
              <p className="text-sm text-gray-500">
                {currentUserRank.score.toLocaleString()} 分
              </p>
            </div>
            <div className={`flex items-center space-x-1 ${
              currentUserRank.change > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{Math.abs(currentUserRank.change)}</span>
            </div>
          </div>
        </div>

        {/* Rankings List */}
        <div className="bg-white rounded-xl overflow-hidden">
          {rankings.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center space-x-4 p-4 ${
                index !== rankings.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="w-8 font-medium text-center">
                {index < 3 ? (
                  <Medal
                    className={`w-6 h-6 ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      'text-orange-500'
                    }`}
                  />
                ) : (
                  user.rank
                )}
              </div>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  {user.score.toLocaleString()} 分
                </p>
              </div>
              <div className={`flex items-center space-x-1 ${
                user.change > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">{Math.abs(user.change)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
