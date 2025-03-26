import React, { useState } from 'react';
import { ArrowLeft, Grid, List, Search, SlidersHorizontal, Trash2, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ImageItem {
  id: string;
  url: string;
  title: string;
  created_at: string;
  likes: number;
  views: number;
}

export function ImagesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBatchMode, setIsBatchMode] = useState(false);

  // Mock data
  const images: ImageItem[] = Array(12).fill(null).map((_, i) => ({
    id: `img-${i}`,
    url: `https://source.unsplash.com/random/400x400?art=${i}`,
    title: `作品 ${i + 1}`,
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    likes: Math.floor(Math.random() * 1000),
    views: Math.floor(Math.random() * 5000)
  }));

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBack = () => {
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={handleBack} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">我的图片</h1>
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
              placeholder="搜索图片"
              className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <button className="absolute right-3 top-2.5">
              <SlidersHorizontal className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Grid/List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-4">
              {images.map(image => (
                <div
                  key={image.id}
                  className="relative group"
                  onClick={() => isBatchMode && toggleItemSelection(image.id)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isBatchMode && (
                    <div
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                        selectedItems.includes(image.id) ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedItems.includes(image.id)
                            ? 'bg-primary border-primary'
                            : 'border-white'
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {images.map(image => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg p-4 flex space-x-4"
                  onClick={() => isBatchMode && toggleItemSelection(image.id)}
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(image.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{image.likes} 喜欢</span>
                      <span>{image.views} 浏览</span>
                    </div>
                  </div>
                  {!isBatchMode && (
                    <div className="flex flex-col space-y-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Share2 className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Trash2 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Batch Action Bar */}
      {isBatchMode && (
        <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            已选择 {selectedItems.length} 项
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setSelectedItems([]);
                setIsBatchMode(false);
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg"
            >
              取消
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
              删除
            </button>
          </div>
        </div>
      )}

      {/* Long Press Handler */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        onContextMenu={(e) => {
          e.preventDefault();
          if (!isBatchMode) {
            setIsBatchMode(true);
          }
        }}
      />
    </div>
  );
}
