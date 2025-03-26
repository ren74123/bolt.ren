import React from 'react';

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
  }>;
}

export function CategoryTabs({ activeTab, onTabChange, tabs }: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex px-4 py-3 space-x-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
