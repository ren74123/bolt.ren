/*
  # Fix Conversation Participants Policies

  1. Changes
    - Remove recursive policy reference
    - Simplify policy conditions
    - Fix infinite recursion in conversation_participants policies

  2. Security
    - Users can only view conversations they're part of
    - Users can only add participants to conversations they created
    - Maintain data access control while avoiding recursion
*/

-- Drop existing problematic policies
drop policy if exists "Enable select for conversation members" on conversation_participants;
drop policy if exists "Enable insert for conversation creators" on conversation_participants;

-- Create new, simplified policies for conversation_participants
create policy "Users can view their own participations"
  on conversation_participants
  for select
  using (user_id = auth.uid());

create policy "Users can add participants to their conversations"
  on conversation_participants
  for insert
  with check (
    exists (
      select 1 from conversations
      where id = conversation_id
      and created_by = auth.uid()
    )
  );

-- Update conversation policies to be more explicit
drop policy if exists "Enable select for participants" on conversations;

create policy "Users can view conversations they participate in"
  on conversations
  for select
  using (
    exists (
      select 1 from conversation_participants
      where conversation_id = id
      and user_id = auth.uid()
    )
  );
