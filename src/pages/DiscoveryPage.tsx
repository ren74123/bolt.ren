import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CategoryTabs } from '../components/CategoryTabs';
import { ContentSection } from '../components/ContentSection';
import { ContentCard } from '../components/ContentCard';
import { FloatingButton } from '../components/FloatingButton';
import { CreationMenu } from '../components/CreationMenu';
import { FullScreenViewer } from '../components/FullScreenViewer';

interface ContentItem {
  id: string;
  type: 'image' | '3d_scene';
  title: string;
  content_url: string;
  description: string;
  creator_id: string;
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
  likes_count: number;
  comments_count: number;
  recommended: boolean;
  recommendation_reason?: string;
  created_at: string;
}

export function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState('hot');
  const [showCreationMenu, setShowCreationMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [imageContent, setImageContent] = useState<ContentItem[]>([]);
  const [sceneContent, setSceneContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'hot', label: '热门' },
    { id: 'new', label: '最新' },
    { id: 'follow', label: '关注' }
  ];

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('content_items')
        .select(`
          id,
          type,
          title,
          content_url,
          description,
          creator_id,
          creator:profiles!content_items_creator_id_fkey (
            id,
            username,
            avatar_url
          ),
          likes:likes(count),
          comments:comments(count),
          recommended,
          recommendation_reason,
          created_at
        `);

      // Apply filters based on active tab
      if (activeTab === 'hot') {
        query = query.eq('recommended', true)
          .order('recommendation_score', { ascending: false });
      } else if (activeTab === 'new') {
        query = query.order('created_at', { ascending: false });
      } else if (activeTab === 'follow') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.in('creator_id', 
            supabase.from('follows')
              .select('following_id')
              .eq('follower_id', user.id)
          );
        }
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      // Transform data to match ContentItem interface
      const transformedData = (data || []).map(item => ({
        ...item,
        likes_count: item.likes?.[0]?.count || 0,
        comments_count: item.comments?.[0]?.count || 0
      }));

      // Split content by type
      setImageContent(transformedData.filter(item => item.type === 'image'));
      setSceneContent(transformedData.filter(item => item.type === '3d_scene'));
    } catch (err) {
      console.error('Error loading content:', err);
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CategoryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      <div className="py-4">
        {/* Search Bar */}
        <div className="px-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索 #标签 或 @用户"
              className="w-full px-4 py-2 pl-10 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="px-4 mb-6">
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-4 text-center text-gray-500">加载中...</div>
        ) : (
          <>
            {/* Image Content Section */}
            <ContentSection
              title="图片创作"
              subtitle="发现灵感源泉"
              type="image"
            >
              <div className="overflow-x-auto">
                <div className="px-4">
                  <div className="grid grid-cols-2 gap-3">
                    {imageContent.map((item) => (
                      <ContentCard
                        key={item.id}
                        type="image"
                        coverUrl={item.content_url}
                        title={item.title}
                        hint={item.recommendation_reason || ''}
                        author={{
                          name: item.creator.username,
                          avatar: item.creator.avatar_url
                        }}
                        likes={item.likes_count}
                        comments={item.comments_count}
                        isHot={item.recommended}
                        onClick={() => setSelectedItem(item)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ContentSection>

            {/* 3D Scene Section */}
            <ContentSection
              title="3D宇宙"
              subtitle="探索立体世界"
              type="3d"
            >
              <div className="overflow-x-auto">
                <div className="px-4">
                  <div className="grid grid-cols-2 gap-3">
                    {sceneContent.map((item) => (
                      <ContentCard
                        key={item.id}
                        type="3d"
                        coverUrl={item.content_url}
                        title={item.title}
                        hint={item.recommendation_reason || ''}
                        author={{
                          name: item.creator.username,
                          avatar: item.creator.avatar_url
                        }}
                        likes={item.likes_count}
                        comments={item.comments_count}
                        isHot={item.recommended}
                        onClick={() => setSelectedItem(item)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ContentSection>
          </>
        )}
      </div>

      <FloatingButton onClick={() => setShowCreationMenu(true)} />
      
      {showCreationMenu && (
        <CreationMenu onClose={() => setShowCreationMenu(false)} />
      )}
      
      {selectedItem && (
        <FullScreenViewer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
