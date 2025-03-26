/*
  # Fix Conversations RLS Policies

  1. Changes
    - Add RLS policies for conversations table
    - Allow users to create conversations
    - Allow users to view conversations they're part of

  2. Security
    - Users can only create conversations they're part of
    - Users can only view conversations they're participating in
    - Users can only update their own conversations
*/

-- Drop existing policies if any
drop policy if exists "Users can access messages from their conversations" on conversations;

-- Enable RLS
alter table conversations enable row level security;

-- Create policies for conversations table
create policy "Users can create conversations"
  on conversations
  for insert
  with check (auth.uid() = created_by);

create policy "Users can view their conversations"
  on conversations
  for select
  using (
    exists (
      select 1 from conversation_participants
      where conversation_id = id
      and user_id = auth.uid()
    )
  );

create policy "Users can update their conversations"
  on conversations
  for update
  using (auth.uid() = created_by);

-- Create policies for conversation_participants table
create policy "Users can add participants"
  on conversation_participants
  for insert
  with check (
    exists (
      select 1 from conversations
      where id = conversation_id
      and created_by = auth.uid()
    )
  );

create policy "Users can view participants"
  on conversation_participants
  for select
  using (
    exists (
      select 1 from conversation_participants cp2
      where cp2.conversation_id = conversation_id
      and cp2.user_id = auth.uid()
    )
  );
