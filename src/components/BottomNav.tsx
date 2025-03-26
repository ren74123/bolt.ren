import React from 'react';
import { Home, User, MessageSquare, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

export function BottomNav({ activeNav, onNavChange }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '数字人', icon: Home, label: '数字人', path: '/digital-human' },
    { id: '发现', icon: Search, label: '发现', path: '/discovery' },
    { id: '聊天', icon: MessageSquare, label: '聊天', path: '/chat' },
    { id: '我的', icon: User, label: '我的', path: '/profile' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    onNavChange(item.id);
    navigate(item.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center py-2 px-3 ${
                isActive ? 'text-primary' : 'text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
