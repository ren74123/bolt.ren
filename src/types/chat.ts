import { EmojiData } from 'emoji-mart';

export type MessagePriority = 'urgent' | 'high' | 'normal' | 'low';
export type MessageCategory = 'chat' | 'meeting' | 'task' | 'file' | 'code';
export type MessageType = 'text' | 'voice' | 'image' | 'emoji' | 'file';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: MessageType;
  priority: MessagePriority;
  category: MessageCategory;
  parent_message_id?: string;
  context_data: Record<string, any>;
  ai_analysis: Record<string, any>;
  created_at: string;
  updated_at: string;
  status?: 'sending' | 'sent' | 'read';
  media_url?: string;
  duration?: number; // For voice messages
}

export interface MessageTask {
  id: string;
  message_id: string;
  title: string;
  description?: string;
  status: string;
  assigned_to: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingNote {
  id: string;
  conversation_id: string;
  title: string;
  content?: string;
  start_time?: string;
  end_time?: string;
  participants: string[];
  action_items: Array<{
    content: string;
    assigned_to?: string;
    status: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface VoiceRecorderState {
  isRecording: boolean;
  duration: number;
  audioUrl: string | null;
}

export interface ImagePreviewState {
  isOpen: boolean;
  url: string | null;
}

export interface EmojiPickerState {
  isOpen: boolean;
  position: { x: number; y: number };
  onSelect: (emoji: EmojiData) => void;
}
