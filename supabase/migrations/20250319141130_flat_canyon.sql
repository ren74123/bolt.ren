/*
  # Message System Enhancements
  
  1. Message Types & Metadata
    - Support for structured message types
    - Priority levels
    - Context linking
    
  2. Task Integration
    - Task conversion
    - Meeting notes
    - Code snippets
*/

-- Add message priority enum
create type message_priority as enum ('urgent', 'high', 'normal', 'low');

-- Add message category enum
create type message_category as enum ('chat', 'meeting', 'task', 'file', 'code');

-- Enhance messages table
alter table messages 
  add column if not exists priority message_priority default 'normal',
  add column if not exists category message_category default 'chat',
  add column if not exists parent_message_id uuid references messages(id),
  add column if not exists context_data jsonb default '{}'::jsonb,
  add column if not exists ai_analysis jsonb default '{}'::jsonb;

-- Task conversion table
create table if not exists message_tasks (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references messages(id) on delete cascade,
  title text not null,
  description text,
  status text default 'pending',
  assigned_to uuid references auth.users(id),
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Meeting notes table
create table if not exists meeting_notes (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  title text not null,
  content text,
  start_time timestamptz,
  end_time timestamptz,
  participants jsonb default '[]'::jsonb,
  action_items jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table message_tasks enable row level security;
alter table meeting_notes enable row level security;

-- RLS Policies
create policy "Users can view tasks they're assigned to"
  on message_tasks for select
  using (
    auth.uid() = assigned_to or
    exists (
      select 1 from messages m
      join conversation_participants cp on cp.conversation_id = m.conversation_id
      where m.id = message_tasks.message_id
      and cp.user_id = auth.uid()
    )
  );

create policy "Users can view meeting notes from their conversations"
  on meeting_notes for select
  using (
    exists (
      select 1 from conversation_participants
      where conversation_id = meeting_notes.conversation_id
      and user_id = auth.uid()
    )
  );
