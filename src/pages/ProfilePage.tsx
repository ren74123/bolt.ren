import React, { useState, useEffect } from 'react';
import { Settings, Edit, Image, Heart, Bookmark, Share2, Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!existingProfile) {
        const { data: newProfile, error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (upsertError) throw upsertError;
        setProfile(newProfile);
      } else {
        setProfile(existingProfile);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : '加载个人资料失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => loadProfile()}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          重试
        </button>
      </div>
    );
  }

  const sections = [
    {
      id: 'digital-identity',
      title: '数字身份',
      items: [
        { id: 'avatars', label: '我的形象', count: 3, path: '/digital-identity/avatars' },
        { id: 'voices', label: '声音管理', count: 2, path: '/digital-identity/voices' }
      ]
    },
    {
      id: 'content-library',
      title: '内容库',
      items: [
        { id: 'images', label: '数字图片', count: 128, path: '/content-library/images' },
        { id: 'scenes', label: '3D场景', count: 45, path: '/content-library/scenes' }
      ]
    },
    {
      id: 'achievements',
      title: '成就',
      items: [
        { id: 'badges', label: '徽章', count: 12, path: '/achievements/badges' },
        { id: 'rankings', label: '排行榜', count: null, path: '/achievements/rankings' }
      ]
    }
  ];

  const tabs = [
    { id: 'content', icon: Image, label: '作品' },
    { id: 'likes', icon: Heart, label: '喜欢' },
    { id: 'collections', icon: Bookmark, label: '收藏' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary/80">
        <button 
          onClick={() => navigate('/profile/settings')}
          className="absolute top-4 right-4 p-2 bg-white/20 rounded-full"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative px-4 pb-4">
        <div className="absolute -top-16 left-4 w-32 h-32 rounded-full border-4 border-white bg-gray-100">
          <img
            src={profile?.avatar_url || 'https://source.unsplash.com/random/200x200?portrait'}
            alt={profile?.full_name || 'Profile'}
            className="w-full h-full rounded-full object-cover"
          />
          <button 
            onClick={() => navigate('/digital-human/create', { state: { type: 'real' } })}
            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>

        <div className="ml-36 mb-4">
          <h1 className="text-xl font-bold">{profile?.full_name || '未设置昵称'}</h1>
          <p className="text-gray-600">@{profile?.username || 'user'}</p>
        </div>

        <p className="text-gray-700 mb-4">
          {profile?.bio || '这个人很懒，什么都没写~'}
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => navigate('/profile/edit')}
            className="flex-1 py-2 bg-primary text-white rounded-full font-medium"
          >
            编辑资料
          </button>
          <button className="p-2 border border-gray-200 rounded-full">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.id} className="bg-white rounded-xl p-4">
              <h2 className="font-semibold mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">{item.label}</span>
                    <div className="flex items-center space-x-2 text-gray-400">
                      {item.count !== null && (
                        <span className="text-sm">{item.count}</span>
                      )}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
                <button className="w-full flex items-center justify-center space-x-2 p-2 text-primary border border-primary/20 rounded-lg">
                  <Plus className="w-4 h-4" />
                  <span>添加{section.title}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="mt-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center space-x-1 py-3 ${
                  activeTab === id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-3 gap-1">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`https://source.unsplash.com/random/400x400?art=${i}`}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
