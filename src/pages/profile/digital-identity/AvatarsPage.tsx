import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface Avatar {
  id: string;
  url: string;
  name: string;
  created_at: string;
}

export function AvatarsPage() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAvatars();
  }, []);

  const loadAvatars = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        navigate('/login');
        return;
      }

      // In a real app, you would fetch avatars from a table
      // For now, we'll use mock data
      setAvatars([
        {
          id: '1',
          url: 'https://source.unsplash.com/random/400x400?portrait=1',
          name: '默认形象',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          url: 'https://source.unsplash.com/random/400x400?portrait=2',
          name: '商务形象',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          url: 'https://source.unsplash.com/random/400x400?portrait=3',
          name: '休闲形象',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Error loading avatars:', err);
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // In a real app, you would upload the file and create a record
      const newAvatar = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        name: '新形象',
        created_at: new Date().toISOString()
      };

      setAvatars([...avatars, newAvatar]);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err instanceof Error ? err.message : '上传失败');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/profile')} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">我的形象</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {avatars.map(avatar => (
            <div
              key={avatar.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <div className="aspect-square relative">
                <img
                  src={avatar.url}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-medium">{avatar.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(avatar.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {/* Upload Button */}
          <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-gray-600">上传新形象</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
