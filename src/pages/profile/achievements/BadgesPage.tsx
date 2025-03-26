import React from 'react';
import { ArrowLeft, Trophy, Star, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export function BadgesPage() {
  const navigate = useNavigate();

  const badges: Badge[] = [
    {
      id: '1',
      name: '创作达人',
      description: '发布100个作品',
      icon: Star,
      color: '#FFD700',
      progress: 65,
      unlocked: false
    },
    {
      id: '2',
      name: '人气之星',
      description: '累计获得1000个赞',
      icon: Trophy,
      color: '#FF6B6B',
      progress: 100,
      unlocked: true,
      unlockedAt: '2025-02-15'
    },
    {
      id: '3',
      name: '探索先锋',
      description: '尝试所有创作类型',
      icon: Target,
      color: '#4ECDC4',
      progress: 80,
      unlocked: false
    },
    {
      id: '4',
      name: '速度之王',
      description: '连续30天创作',
      icon: Zap,
      color: '#45B7D1',
      progress: 100,
      unlocked: true,
      unlockedAt: '2025-03-01'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/profile')} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">我的徽章</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4">
        {/* Stats */}
        <div className="bg-white rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {badges.filter(b => b.unlocked).length}
              </div>
              <div className="text-sm text-gray-500">已获得</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {badges.length}
              </div>
              <div className="text-sm text-gray-500">总数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">完成度</div>
            </div>
          </div>
        </div>

        {/* Badge List */}
        <div className="space-y-4">
          {badges.map(badge => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`bg-white rounded-xl p-4 ${
                  badge.unlocked ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${badge.color}20` }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: badge.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{badge.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {badge.description}
                    </p>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${badge.progress}%`,
                          backgroundColor: badge.color
                        }}
                      />
                    </div>
                    {badge.unlocked && badge.unlockedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        获得于 {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
