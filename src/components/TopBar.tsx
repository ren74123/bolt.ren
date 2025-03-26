import React from 'react';
import { Rotate3d } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  tabs: string[];
  onTabChange: (tab: string) => void;
}

export function TopBar({ activeTab, tabs, onTabChange }: TopBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex px-4 py-3 space-x-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-primary'
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab === '3D' && <Rotate3d className="w-4 h-4" />}
            <span>{tab}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
