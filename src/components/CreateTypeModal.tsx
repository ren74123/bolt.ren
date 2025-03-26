import React from 'react';
import { X, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateTypeModalProps {
  onClose: () => void;
  onSelect: (type: 'real' | 'clone') => void;
}

export function CreateTypeModal({ onClose, onSelect }: CreateTypeModalProps) {
  const navigate = useNavigate();

  const handleSelect = (type: 'real' | 'clone') => {
    onSelect(type);
    // 根据类型跳转到不同的创建页面
    if (type === 'real') {
      navigate('/digital-human/create', { state: { type: 'real' } });
    } else {
      navigate('/digital-human/create-clone', { state: { type: 'clone' } });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">选择创建类型</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleSelect('real')}
              className="w-full group bg-white hover:bg-gray-50 p-6 rounded-xl border-2 border-gray-200 transition-all hover:border-primary"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-lg font-semibold mb-1">真实数字人</h4>
                  <p className="text-gray-500">基于您的声音和形象创建专属数字分身</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelect('clone')}
              className="w-full group bg-white hover:bg-gray-50 p-6 rounded-xl border-2 border-gray-200 transition-all hover:border-primary"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-lg font-semibold mb-1">副本数字人</h4>
                  <p className="text-gray-500">通过人格融合实验创建独特的虚拟身份</p>
                </div>
              </div>
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500 text-center">
            创建数字人需要完成基因采样和个性化定制
          </p>
        </div>
      </div>
    </div>
  );
}
