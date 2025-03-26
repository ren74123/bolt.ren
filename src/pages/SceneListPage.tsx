import React, { useState } from 'react';
import { ArrowLeft, Grid, List, Eye, Share2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SceneItem {
  id: string;
  preview: string;
  title: string;
  polyCount: number;
  style: 'anime' | 'realistic';
  renderTime: number;
  memoryUsage: number;
}

const FILTER_OPTIONS = {
  style: [
    { id: 'anime', label: '二次元' },
    { id: 'realistic', label: '写实' },
  ],
  polyCount: [
    { id: 'low', label: '<1万面片' },
    { id: 'medium', label: '1-5万面片' },
    { id: 'high', label: '>5万面片' },
  ],
};

export function SceneListPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
  const [selectedPolyCount, setSelectedPolyCount] = useState<string[]>([]);

  // Mock data
  const scenes: SceneItem[] = Array(6).fill(null).map((_, i) => ({
    id: `scene-${i}`,
    preview: `https://source.unsplash.com/random/400x300?3d=${i}`,
    title: `3D场景 ${i + 1}`,
    polyCount: Math.floor(Math.random() * 100000),
    style: Math.random() > 0.5 ? 'anime' : 'realistic',
    renderTime: Math.random() * 100,
    memoryUsage: Math.random() * 1000,
  }));

  const toggleFilter = (type: 'style' | 'polyCount', id: string) => {
    if (type === 'style') {
      setSelectedStyle(
        selectedStyle.includes(id)
          ? selectedStyle.filter(item => item !== id)
          : [...selectedStyle, id]
      );
    } else {
      setSelectedPolyCount(
        selectedPolyCount.includes(id)
          ? selectedPolyCount.filter(item => item !== id)
          : [...selectedPolyCount, id]
      );
    }
  };

  const handleBack = () => {
    navigate('/discovery');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={handleBack} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">3D场景列表</h1>
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
      </div>

      {/* Filters */}
      <div className="bg-white p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">风格</h3>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.style.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleFilter('style', option.id)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedStyle.includes(option.id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">面片数</h3>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.polyCount.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleFilter('polyCount', option.id)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedPolyCount.includes(option.id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scene List */}
      <div className="p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {scenes.map(scene => (
              <div
                key={scene.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <img
                    src={scene.preview}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    {(scene.polyCount / 10000).toFixed(1)}万面片
                  </div>
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
                    loading="lazy"
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
                      <Eye className="w-4 h-4" />
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
