import React, { useState } from 'react';
import { ArrowLeft, Grid, List, Search, SlidersHorizontal, Play, Share2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SceneItem {
  id: string;
  preview: string;
  title: string;
  polyCount: number;
  style: 'anime' | 'realistic';
  renderTime: number;
  memoryUsage: number;
  created_at: string;
}

export function ScenesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const scenes: SceneItem[] = Array(6).fill(null).map((_, i) => ({
    id: `scene-${i}`,
    preview: `https://source.unsplash.com/random/400x300?3d=${i}`,
    title: `3D场景 ${i + 1}`,
    polyCount: Math.floor(Math.random() * 100000),
    style: Math.random() > 0.5 ? 'anime' : 'realistic',
    renderTime: Math.random() * 100,
    memoryUsage: Math.random() * 1000,
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/profile')} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">3D场景</h1>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2"
          >
            {viewMode === 'grid' ? (
              <List className="w-6 h-6" />
            ) : (
              <Grid className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索场景"
              className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <button className="absolute right-3 top-2.5">
              <SlidersHorizontal className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Scene Grid/List */}
      <div className="p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {scenes.map(scene => (
              <div
                key={scene.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative aspect-video">
                  <img
                    src={scene.preview}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    {(scene.polyCount / 10000).toFixed(1)}万面片
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-medium mb-1">{scene.title}</h3>
                  <p className="text-xs text-gray-500">
                    渲染耗时: {scene.renderTime.toFixed(1)}ms
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {scenes.map(scene => (
              <div
                key={scene.id}
                className="bg-white rounded-lg p-4 flex space-x-4"
              >
                <div className="w-32 h-24 rounded-lg overflow-hidden">
                  <img
                    src={scene.preview}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{scene.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {(scene.polyCount / 10000).toFixed(1)}万面片 ·{' '}
                    {scene.style === 'anime' ? '二次元' : '写实'}风格
                  </p>
                  <div className="flex space-x-4">
                    <button className="text-gray-600 flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span className="text-sm">预览</span>
                    </button>
                    <button className="text-gray-600 flex items-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">分享</span>
                    </button>
                    <button className="text-gray-600 flex items-center space-x-1">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">分析</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
