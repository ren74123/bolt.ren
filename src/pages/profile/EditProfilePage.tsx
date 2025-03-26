import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export function EditProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    username: '',
    full_name: '',
    bio: ''
  });

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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profile);
      setForm({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || ''
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setSaving(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/${Date.now()}.${fileExt}`;

      // Upload avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
    } catch (err) {
      console.error('Error updating avatar:', err);
      setError(err instanceof Error ? err.message : '头像上传失败');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: form.username,
          full_name: form.full_name,
          bio: form.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
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
          <h1 className="text-lg font-semibold">编辑资料</h1>
          <div className="w-10" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="block w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden relative group"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              昵称
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入昵称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              个人简介
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder="介绍一下自己..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium flex items-center justify-center disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              保存中...
            </>
          ) : (
            '保存修改'
          )}
        </button>
      </form>
    </div>
  );
}
