import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContentSectionProps {
  title: string;
  subtitle: string;
  type: 'image' | '3d';
  children: React.ReactNode;
}

export function ContentSection({ title, subtitle, type, children }: ContentSectionProps) {
  const navigate = useNavigate();
  
  const handleMoreClick = () => {
    if (type === 'image') {
      navigate('/images');
    } else {
      navigate('/scenes');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <button
          onClick={handleMoreClick}
          className="flex items-center text-primary"
        >
          <span className="text-sm">更多</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );
}
