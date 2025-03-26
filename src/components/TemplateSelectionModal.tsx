import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

interface Template {
  id: string;
  preview: string;
  name: string;
  params: any;
  commissionRate: number;
}

interface ContentItem {
  id?: string;
  type?: 'image' | '3d_scene';
  title?: string;
  content_url?: string;
  creator?: {
    id?: string;
    username?: string;
  };
  author?: {
    name?: string;
  };
}

interface TemplateSelectionModalProps {
  type: 'image' | '3d_scene';
  originalItem: ContentItem;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

export function TemplateSelectionModal({
  type,
  originalItem,
  onClose,
  onSelect,
}: TemplateSelectionModalProps) {
  const [mode, setMode] = useState<'quick' | 'deep'>('quick');

  // Mock templates data
  const templates: Template[] = [
    {
      id: '1',
      preview: 'https://source.unsplash.com/random/300x300?art=1',
      name: '基础模板',
      params: { similarity: 0.8 },
      commissionRate: 5,
    },
    {
      id: '2',
      preview: 'https://source.unsplash.com/random/300x300?art=2',
      name: '高级模板',
      params: { similarity: 0.9 },
      commissionRate: 10,
    },
    {
      id: '3',
      preview: 'https://source.unsplash.com/random/300x300?art=3',
      name: '专业模板',
      params: { similarity: 0.95 },
      commissionRate: 15,
    },
  ];

  // Get author name safely
  const authorName = originalItem?.creator?.username || originalItem?.author?.name || '原作者';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">选择模板</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switch */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setMode('quick')}
              className={`flex-1 py-2 rounded-full text-sm font-medium ${
                mode === 'quick'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              快速复用
            </button>
            <button
              onClick={() => setMode('deep')}
              className={`flex-1 py-2 rounded-full text-sm font-medium ${
                mode === 'deep'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              深度改编
            </button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className="group relative rounded-xl overflow-hidden"
              >
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                  <span className="text-white font-medium">{template.name}</span>
                  <div className="flex items-center mt-1">
                    <span className="text-white/80 text-sm">
                      查看详情
                    </span>
                    <ChevronRight className="w-4 h-4 text-white/80" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Commission Notice */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              使用此模板需向{authorName}支付{' '}
              <span className="text-primary font-medium">5%</span> 收益分成
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
