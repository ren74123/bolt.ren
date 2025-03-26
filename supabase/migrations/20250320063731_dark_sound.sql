/*
  # Fix Generation Prompts RLS Policy

  1. Changes
    - Drop existing policy
    - Create new policy with proper user_id check
    - Ensure authenticated users can create prompts
*/

-- Drop existing policy
drop policy if exists "Users can manage their own prompts" on generation_prompts;

-- Create new policies with proper checks
create policy "Users can create prompts"
  on generation_prompts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their own prompts"
  on generation_prompts
  for select
  using (auth.uid() = user_id);

create policy "Users can update their own prompts"
  on generation_prompts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
