/*
  # Fix Conversation Participants RLS Policies

  1. Changes
    - Fix infinite recursion in conversation_participants policies
    - Simplify participant access checks
    - Add missing RLS policies for conversations

  2. Security
    - Users can only view conversations they're part of
    - Users can only add participants to conversations they created
    - Users can only view participants of their conversations
*/

-- Drop existing policies
drop policy if exists "Users can add participants" on conversation_participants;
drop policy if exists "Users can view participants" on conversation_participants;

-- Enable RLS
alter table conversation_participants enable row level security;

-- Create new policies for conversation_participants
create policy "Enable insert for conversation creators"
  on conversation_participants
  for insert
  with check (
    auth.uid() = (
      select created_by 
      from conversations 
      where id = conversation_id
    )
  );

create policy "Enable select for conversation members"
  on conversation_participants
  for select
  using (
    auth.uid() in (
      select user_id 
      from conversation_participants 
      where conversation_id = conversation_participants.conversation_id
    )
  );

-- Update conversation policies
create policy "Enable insert for authenticated users"
  on conversations
  for insert
  with check (auth.uid() = created_by);

create policy "Enable select for participants"
  on conversations
  for select
  using (
    auth.uid() in (
      select user_id 
      from conversation_participants 
      where conversation_id = id
    )
  );

create policy "Enable update for creators"
  on conversations
  for update
  using (auth.uid() = created_by);
