import { Database } from './supabase';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar_url?: string;
  company?: string;
  department?: string;
  position?: string;
  email?: string;
  notes?: string;
  contact_methods?: ContactMethod[];
  created_at: string;
  updated_at: string;
}

export interface ContactMethod {
  type: 'wechat' | 'email' | 'custom';
  value: string;
  label?: string;
}

export type ContactsResponse = Database['public']['Tables']['contacts']['Row'];
