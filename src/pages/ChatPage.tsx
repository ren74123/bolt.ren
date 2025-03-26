import React, { useState, useEffect } from 'react';
import { Search, Plus, Tag, Settings, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ContactList } from '../components/chat/ContactList';
import { ThemeRoom } from '../components/chat/ThemeRoom';
import { ChatContainer } from '../components/chat/ChatContainer';
import { FloatingButton } from '../components/FloatingButton';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  online: boolean;
  lastMessage: string;
  lastTime: string;
}

interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
}

export function ChatPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'messages' | 'contacts'>('messages');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Get all conversations where the user is a participant
      const { data: participations, error: participationsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', session.user.id);

      if (participationsError) throw participationsError;

      if (participations && participations.length > 0) {
        const conversationIds = participations.map(p => p.conversation_id);
        
        // Get conversation details
        const { data: conversationData, error: conversationsError } = await supabase
          .from('conversations')
          .select('id, title')
          .in('id', conversationIds);

        if (conversationsError) throw conversationsError;

        const conversationMap: Record<string, string> = {};
        conversationData?.forEach(conv => {
          conversationMap[conv.id] = conv.title || '';
        });
        setConversations(conversationMap);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const handleContactSelect = async (contact: Contact) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Check if conversation exists
      const { data: existingConversation, error: existingError } = await supabase
        .from('conversations')
        .select('id')
        .eq('type', 'direct')
        .eq('created_by', session.user.id)
        .single();

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }

      let conversationId: string;

      if (!existingConversation) {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            type: 'direct',
            created_by: session.user.id,
            title: contact.name,
          })
          .select()
          .single();

        if (createError) throw createError;
        if (!newConversation) throw new Error('Failed to create conversation');

        conversationId = newConversation.id;

        // Add participants
        const { error: participantsError } = await supabase
          .from('conversation_participants')
          .insert([
            { conversation_id: conversationId, user_id: session.user.id },
            { conversation_id: conversationId, user_id: contact.id }
          ]);

        if (participantsError) throw participantsError;
      } else {
        conversationId = existingConversation.id;
      }

      setSelectedContact({ ...contact, id: conversationId });
    } catch (error) {
      console.error('Error handling contact selection:', error);
      alert('无法创建或加载会话');
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleNewContact = () => {
    navigate('/contacts/create');
  };

  if (selectedContact) {
    return (
      <ChatContainer
        conversationId={selectedContact.id}
        onBack={() => setSelectedContact(null)}
      />
    );
  }

  // Mock data for UI demonstration
  const contacts: Contact[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: '张三',
      avatar: 'https://source.unsplash.com/random/100x100?portrait=1',
      tags: ['同事', '项目组'],
      online: true,
      lastMessage: '好的，我们下午开会讨论',
      lastTime: '10:30'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: '李四',
      avatar: 'https://source.unsplash.com/random/100x100?portrait=2',
      tags: ['朋友'],
      online: false,
      lastMessage: '周末一起去看电影吗？',
      lastTime: '昨天'
    }
  ];

  const themeRooms = [
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      name: '二次元研究所',
      preview: 'https://source.unsplash.com/random/400x300?anime',
      online: 58,
      requirement: '需上传作品'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174003',
      name: '摄影分享会',
      preview: 'https://source.unsplash.com/random/400x300?camera',
      online: 42,
      requirement: '摄影爱好者'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">消息</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Tag className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'messages' ? "搜索消息" : "搜索联系人"}
              className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 ${
              activeTab === 'messages'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>消息</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 ${
              activeTab === 'contacts'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>通讯录</span>
          </button>
        </div>
      </div>

      {activeTab === 'messages' ? (
        <>
          {/* Theme Rooms */}
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">主题房间</h2>
              <button className="text-primary text-sm">更多</button>
            </div>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {themeRooms.map(room => (
                <ThemeRoom
                  key={room.id}
                  {...room}
                  onClick={() => {/* Handle room selection */}}
                />
              ))}
              <button className="flex-shrink-0 w-60 h-[132px] border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50">
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Contact List */}
          <ContactList
            contacts={contacts}
            onContactSelect={handleContactSelect}
            onTagSelect={handleTagSelect}
            selectedTags={selectedTags}
          />
        </>
      ) : (
        <div className="p-4">
          {/* Contact Categories */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {['家人', '同事', '同学', '朋友'].map(category => (
              <button
                key={category}
                className="aspect-square bg-white rounded-xl p-4 flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm">{category}</span>
              </button>
            ))}
          </div>

          {/* Contact List */}
          <div className="bg-white rounded-xl">
            <ContactList
              contacts={contacts}
              onContactSelect={handleContactSelect}
              onTagSelect={handleTagSelect}
              selectedTags={selectedTags}
            />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {activeTab === 'contacts' && (
        <FloatingButton onClick={handleNewContact} />
      )}
    </div>
  );
}
