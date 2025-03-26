import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface ContactForm {
  name: string;
  phone: string;
  company?: string;
  department?: string;
  position?: string;
  email?: string;
  notes?: string;
}

interface ContactMethod {
  type: 'wechat' | 'email' | 'custom';
  value: string;
  label?: string;
}

export function CreateContactPage() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [form, setForm] = useState<ContactForm>({
    name: '',
    phone: '',
  });
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      // Redirect to login page if not authenticated
      alert('请先登录');
      navigate('/chat');
      return;
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const addContactMethod = () => {
    setContactMethods(prev => [
      ...prev,
      { type: 'custom', value: '' }
    ]);
  };

  const removeContactMethod = (index: number) => {
    setContactMethods(prev => prev.filter((_, i) => i !== index));
  };

  const updateContactMethod = (index: number, field: keyof ContactMethod, value: string) => {
    setContactMethods(prev => prev.map((method, i) => 
      i === index ? { ...method, [field]: value } : method
    ));
  };

  const validateForm = () => {
    const newErrors: Partial<ContactForm> = {};
    
    if (!form.name.trim()) {
      newErrors.name = '请输入姓名';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('请先登录');

      // Upload avatar if exists
      let avatarUrl = null;
      if (avatar) {
        const { data: avatarData, error: avatarError } = await supabase.storage
          .from('avatars')
          .upload(`contact-${Date.now()}`, avatar);
        
        if (avatarError) throw avatarError;
        avatarUrl = avatarData.path;
      }

      // Create contact
      const { error: insertError } = await supabase
        .from('contacts')
        .insert({
          name: form.name,
          phone: form.phone,
          avatar_url: avatarUrl,
          contact_methods: contactMethods,
          company_info: showCompanyInfo ? {
            company: form.company,
            department: form.department,
            position: form.position
          } : {},
          notes: form.notes,
          created_by: session.user.id
        });

      if (insertError) throw insertError;

      // Navigate back to contacts list
      navigate('/chat');
    } catch (err) {
      console.error('Failed to create contact:', err);
      // Show error to user
      alert(err instanceof Error ? err.message : '创建联系人失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/chat')} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">新建联系人</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`text-primary font-medium ${isSubmitting ? 'opacity-50' : ''}`}
          >
            {isSubmitting ? '创建中...' : '完成'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar Upload */}
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
              className="block w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="请输入姓名"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              手机号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="请输入手机号"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Company Info */}
        <div className="space-y-4">
          <button
            onClick={() => setShowCompanyInfo(!showCompanyInfo)}
            className="flex items-center space-x-2 text-gray-600"
          >
            <span>{showCompanyInfo ? '收起公司信息' : '添加公司信息'}</span>
          </button>

          {showCompanyInfo && (
            <div className="space-y-4 animate-slide-up">
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="公司名称"
              />
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="部门"
              />
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="职位"
              />
            </div>
          )}
        </div>

        {/* Contact Methods */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">其他联系方式</h3>
            <button
              onClick={addContactMethod}
              className="text-primary flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>添加</span>
            </button>
          </div>

          {contactMethods.map((method, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                value={method.type}
                onChange={(e) => updateContactMethod(index, 'type', e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="wechat">微信</option>
                <option value="email">邮箱</option>
                <option value="custom">自定义</option>
              </select>

              {method.type === 'custom' && (
                <input
                  type="text"
                  value={method.label || ''}
                  onChange={(e) => updateContactMethod(index, 'label', e.target.value)}
                  className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="标签"
                />
              )}

              <input
                type={method.type === 'email' ? 'email' : 'text'}
                value={method.value}
                onChange={(e) => updateContactMethod(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={
                  method.type === 'wechat' ? '微信号' :
                  method.type === 'email' ? '邮箱地址' :
                  '联系方式'
                }
              />

              <button
                onClick={() => removeContactMethod(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            备注
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
            placeholder="添加备注信息..."
          />
        </div>
      </div>
    </div>
  );
}
