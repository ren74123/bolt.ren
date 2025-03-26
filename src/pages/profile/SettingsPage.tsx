import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, LogOut, Shield, Bell, Eye, UserX, Link, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Setting {
  id: string;
  label: string;
  value: boolean;
}

export function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Setting[]>([
    { id: 'visitor_record', label: '访客记录', value: true },
    { id: 'message_notify', label: '消息提醒', value: true },
    { id: 'system_notify', label: '系统通知', value: true }
  ]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
      alert('退出登录失败，请重试');
    }
  };

  const handleDeleteAccount = () => {
    // Show confirmation dialog
    if (window.confirm('确定要注销账号吗？此操作不可恢复！')) {
      // In a real app, you would implement account deletion logic here
      alert('账号注销功能即将上线');
    }
  };

  const toggleSetting = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, value: !setting.value }
          : setting
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/profile')} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">设置</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Security */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="w-5 h-5" />
              <span className="font-medium">账户安全</span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            <button
              onClick={() => navigate('/profile/change-password')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="text-gray-700">修改密码</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate('/profile/third-party')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="text-gray-700">第三方绑定</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">已绑定微信</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="text-red-500">注销账号</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-gray-600">
              <Eye className="w-5 h-5" />
              <span className="font-medium">隐私</span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            <button
              onClick={() => navigate('/profile/blacklist')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="text-gray-700">黑名单管理</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">2人</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            <div className="flex items-center justify-between p-4">
              <span className="text-gray-700">访客记录</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.find(s => s.id === 'visitor_record')?.value}
                  onChange={() => toggleSetting('visitor_record')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="font-medium">通知</span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {settings
              .filter(s => s.id.includes('notify'))
              .map(setting => (
                <div key={setting.id} className="flex items-center justify-between p-4">
                  <span className="text-gray-700">{setting.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.value}
                      onChange={() => toggleSetting(setting.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-white text-red-500 rounded-xl font-medium flex items-center justify-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
}
