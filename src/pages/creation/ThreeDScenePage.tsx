import React, { useState } from 'react';
import { ArrowLeft, Box, Sparkles, Share2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sceneTemplates = [
  { id: 'classroom', name: '教室', preview: 'https://source.unsplash.com/random/200x200?classroom' },
  { id: 'space-station', name: '太空站', preview: 'https://source.unsplash.com/random/200x200?space' },
  { id: 'ancient-street', name: '古风街道', preview: 'https://source.unsplash.com/random/200x200?ancient' },
  { id: 'cyberpunk-city', name: '赛博城市', preview: 'https://source.unsplash.com/random/200x200?cyberpunk' },
];

const components = [
  { id: 'furniture', name: '家具', items: ['桌子', '椅子', '柜子'] },
  { id: 'characters', name: '人物', items: ['学生', '老师', '路人'] },
  { id: 'effects', name: '特效', items: ['樱花飘落', '雨天', '雾气'] },
];

export function ThreeDScenePage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isRendering, setIsRendering] = useState(false);
  const [renderedScene, setRenderedScene] = useState('');

  const handleRender = () => {
    setIsRendering(true);
    // 模拟渲染过程
    setTimeout(() => {
      setRenderedScene('https://source.unsplash.com/random/800x600?3d');
      setIsRendering(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">3D场景创作</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Scene Templates */}
        <div>
          <h2 className="text-lg font-medium mb-3">场景模板</h2>
          <div className="grid grid-cols-2 gap-3">
            {sceneTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`relative rounded-xl overflow-hidden aspect-video ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                  <span className="text-white">{template.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Components */}
        <div>
          <h2 className="text-lg font-medium mb-3">场景组件</h2>
          {components.map((category) => (
            <div key={category.id} className="mb-4">
              <h3 className="text-base font-medium mb-2">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <button
                    key={item}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Rendered Scene */}
        {renderedScene && (
          <div>
            <h2 className="text-lg font-medium mb-3">渲染结果</h2>
            <div className="relative rounded-xl overflow-hidden">
              <img src={renderedScene} alt="Rendered Scene" className="w-full aspect-video object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex justify-end space-x-4">
                  <button className="text-white flex items-center space-x-1">
                    <Download className="w-5 h-5" />
                    <span>保存</span>
                  </button>
                  <button className="text-white flex items-center space-x-1">
                    <Share2 className="w-5 h-5" />
                    <span>分享</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Button */}
        <button
          onClick={handleRender}
          disabled={!selectedTemplate || isRendering}
          className={`fixed bottom-4 left-4 right-4 py-3 rounded-xl font-medium text-white flex items-center justify-center space-x-2 ${
            isRendering || !selectedTemplate ? 'bg-gray-400' : 'bg-primary'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>{isRendering ? '渲染中...' : '一键渲染'}</span>
        </button>
      </div>
    </div>
  );
}
