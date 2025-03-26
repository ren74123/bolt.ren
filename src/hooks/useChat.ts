import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Message, MessageTask, MeetingNote } from '../types/chat';

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load message history
  useEffect(() => {
    if (!conversationId) {
      setError('会话 ID 不能为空');
      setLoading(false);
      return;
    }

    if (!isValidUUID(conversationId)) {
      setError('会话 ID 无效');
      setLoading(false);
      return;
    }

    loadMessages();
    const unsubscribe = subscribeToMessages();
    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const loadMessages = async () => {
    try {
      const { data, error: queryError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (queryError) throw queryError;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载消息失败');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (content: string, options?: {
    priority?: Message['priority'];
    category?: Message['category'];
    parentMessageId?: string;
  }) => {
    if (!isValidUUID(conversationId)) {
      setError('会话 ID 无效');
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('用户未登录');

      const message = {
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        type: 'text',
        priority: options?.priority || 'normal',
        category: options?.category || 'chat',
        parent_message_id: options?.parentMessageId,
        context_data: {},
        ai_analysis: {},
      };

      const { data, error: insertError } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送消息失败');
      return null;
    }
  };

  const createTask = async (messageId: string, taskData: Partial<MessageTask>) => {
    if (!isValidUUID(messageId)) {
      setError('消息 ID 无效');
      return null;
    }

    try {
      const { data, error: taskError } = await supabase
        .from('message_tasks')
        .insert({
          message_id: messageId,
          ...taskData,
        })
        .select()
        .single();

      if (taskError) throw taskError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建任务失败');
      return null;
    }
  };

  const createMeetingNote = async (noteData: Partial<MeetingNote>) => {
    if (!isValidUUID(conversationId)) {
      setError('会话 ID 无效');
      return null;
    }

    try {
      const { data, error: noteError } = await supabase
        .from('meeting_notes')
        .insert({
          conversation_id: conversationId,
          ...noteData,
        })
        .select()
        .single();

      if (noteError) throw noteError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建会议记录失败');
      return null;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    createTask,
    createMeetingNote,
  };
}
