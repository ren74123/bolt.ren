import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dna } from 'lucide-react';
import { DefaultAvatar } from '../components/digital-human/DefaultAvatar';
import { CreateTypeModal } from '../components/CreateTypeModal';

export function DigitalHumanPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleTypeSelect = (type: 'real' | 'clone') => {
    setShowModal(false);
    navigate('/digital-human/create', { state: { type } });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Space Station Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-[calc(100vh-4rem)] p-4">
        {/* Avatar Preview */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="w-full max-w-md">
            <DefaultAvatar />
          </div>
        </div>

        {/* Bottom Content */}
        <div className="space-y-6 mb-4">
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              欢迎来到数字人空间站
            </h1>
            <p className="text-gray-300 mt-2">
              指挥官，我们需要先完成基因采样才能开始创建您的数字分身。
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full relative group overflow-hidden px-12 py-4 bg-primary rounded-2xl text-white font-medium shadow-lg hover:bg-primary/90 transition-all"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <Dna className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <Dna className="w-5 h-5" />
              <span>开始基因采样</span>
            </span>
          </button>
        </div>
      </div>

      {/* Type Selection Modal */}
      {showModal && (
        <CreateTypeModal
          onClose={() => setShowModal(false)}
          onSelect={handleTypeSelect}
        />
      )}
    </div>
  );
}
