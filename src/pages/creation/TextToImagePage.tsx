import React, { useState } from 'react';
import { ArrowLeft, Wand2, Download, Share2, Loader2, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { generateImage } from '../../lib/ai';
import { shareToFriend, shareToTimeline } from '../../lib/wechat';

const stylePresets = [
  { id: 'realistic', name: '写实风格', preview: 'https://source.unsplash.com/random/150x150?art' },
  { id: 'anime', name: '动漫风格', preview: 'https://source.unsplash.com/random/150x150?anime' },
  { id: 'oil-painting', name: '油画风格', preview: 'https://source.unsplash.com/random/150x150?painting' },
  { id: 'watercolor', name: '水彩风格', preview: 'https://source.unsplash.com/random/150x150?watercolor' },
  { id: 'cyberpunk', name: '赛博朋克', preview: 'https://source.unsplash.com/random/150x150?cyberpunk' },
  { id: 'fantasy', name: '奇幻风格', preview: 'https://source.unsplash.com/random/150x150?fantasy' },
];

const popularTags = [
  // 场景标签
  '赛博朋克城市', '梦幻森林', '未来都市', '古风街景', '科技感',
  // 人物标签
  '美少女', '帅哥', '可爱萌娘', '机器人', '精灵',
  // 风格标签
  '二次元', '写实', '水墨', '复古', '未来派',
  // 情绪标签
  '治愈系', '热血', '神秘', '浪漫', '科幻',
  // 元素标签
  '霓虹灯', '樱花', '星空', '雨天', '日落',
  // 流行文化标签
  'JRPG', '国风', '蒸汽朋克', '赛博格', '魔法'
];

interface ShareOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const shareOptions: ShareOption[] = [
  { id: 'wechat', name: '微信', icon: '💬', color: '#07C160' },
  { id: 'moments', name: '朋友圈', icon: '👥', color: '#07C160' },
  { id: 'weibo', name: '微博', icon: '🌐', color: '#E6162D' },
  { id: 'qq', name: 'QQ', icon: '💭', color: '#12B7F5' },
  { id: 'link', name: '复制链接', icon: '🔗', color: '#666666' }
];

export function TextToImagePage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [styleStrength, setStyleStrength] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
      setPrompt(prev => {
        const newPrompt = prev.trim();
        return newPrompt ? `${newPrompt}, ${tag}` : tag;
      });
    }
  };

  const handleGenerate = async () => {
    if (!prompt || !selectedStyle || isGenerating) return;

    try {
      setIsGenerating(true);
      setError(null);
      setSaveSuccess(false);

      const result = await generateImage(prompt, {
        style: selectedStyle,
        styleStrength,
        tags: selectedTags
      });

      if (result?.image_url) {
        setGeneratedImage(result.image_url);
        await handleSave();
      } else {
        throw new Error('生成失败');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedImage) return;

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('请先登录');

      const { error: saveError } = await supabase
        .from('content_items')
        .insert({
          creator_id: session.user.id,
          title: prompt,
          description: `使用 ${selectedStyle || '默认'} 风格创作`,
          type: 'image',
          content_url: generatedImage,
          metadata: {
            prompt,
            style: selectedStyle,
            styleStrength,
            tags: selectedTags
          }
        });

      if (saveError) throw saveError;

      setSaveSuccess(true);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setError(err instanceof Error ? err.message : '保存失败，请重试');
    }
  };

  const handleShare = (option: ShareOption) => {
    if (!generatedImage) return;

    const shareOptions = {
      title: prompt,
      desc: `使用 ${selectedStyle} 风格创作的AI艺术作品`,
      link: window.location.href,
      imgUrl: generatedImage
    };

    switch (option.id) {
      case 'wechat':
        shareToFriend(shareOptions);
        break;

      case 'moments':
        shareToTimeline({
          title: shareOptions.title,
          link: shareOptions.link,
          imgUrl: shareOptions.imgUrl
        });
        break;

      case 'weibo':
        const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(prompt)}&pic=${encodeURIComponent(generatedImage)}`;
        window.open(weiboUrl, '_blank');
        break;

      case 'qq':
        const qqUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(prompt)}&pics=${encodeURIComponent(generatedImage)}`;
        window.open(qqUrl, '_blank');
        break;

      case 'link':
        navigator.clipboard.writeText(window.location.href)
          .then(() => alert('链接已复制'))
          .catch(() => alert('复制失败'));
        break;
    }

    setShowShareModal(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">文生图创作</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {showSuccessMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 z-50 animate-fade-in-down">
            <Check className="w-5 h-5" />
            <span>保存成功！可在"我的图片"中查看</span>
          </div>
        )}

        {generatedImage && (
          <div>
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleSave}
                    disabled={saveSuccess}
                    className={`text-white flex items-center space-x-1 ${
                      saveSuccess ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {saveSuccess ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    <span>{saveSuccess ? '已保存' : '保存'}</span>
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="text-white flex items-center space-x-1"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>分享</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <h2 className="text-lg font-medium mb-3">描述你的创意</h2>
          <div className="space-y-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想创作的图像，例如：赛博朋克风格的猫咪"
              className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">选择风格</h2>
          <div className="grid grid-cols-3 gap-3">
            {stylePresets.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`relative rounded-xl overflow-hidden aspect-square ${
                  selectedStyle === style.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <img src={style.preview} alt={style.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                  <span className="text-white text-sm">{style.name}</span>
                </div>
              </button>
            ))}
          </div>
          
          {selectedStyle && (
            <div className="mt-4">
              <label className="text-sm text-gray-600 mb-2 block">风格强度</label>
              <input
                type="range"
                min="0"
                max="100"
                value={styleStrength}
                onChange={(e) => setStyleStrength(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>弱</span>
                <span>强</span>
              </div>
            </div>
          )}
        </div>

        {showShareModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center sm:items-center">
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">分享到</h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {shareOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleShare(option)}
                      className="flex flex-col items-center space-y-2"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${option.color}20` }}
                      >
                        {option.icon}
                      </div>
                      <span className="text-sm">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={generatedImage ? () => navigate('/images') : handleGenerate}
          disabled={(!prompt || !selectedStyle) && !generatedImage}
          className={`fixed bottom-4 left-4 right-4 py-3 rounded-xl font-medium text-white flex items-center justify-center space-x-2 ${
            (!prompt || !selectedStyle) && !generatedImage
              ? 'bg-gray-400'
              : 'bg-primary'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>生成中...</span>
            </>
          ) : generatedImage ? (
            <>
              <Check className="w-5 h-5" />
              <span>完成</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>开始生成</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
