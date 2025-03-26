/*
  # Fix Generation Prompts RLS Policies

  1. Changes
    - Drop all existing policies
    - Create new simplified policies
    - Ensure proper user authentication checks

  2. Security
    - Users can only manage their own prompts
    - Results are linked to prompts
*/

-- Drop all existing policies
drop policy if exists "Enable insert for authenticated users" on generation_prompts;
drop policy if exists "Enable select for own prompts" on generation_prompts;
drop policy if exists "Enable update for own prompts" on generation_prompts;
drop policy if exists "Enable delete for own prompts" on generation_prompts;
drop policy if exists "Enable select for own results" on generation_results;
drop policy if exists "Enable insert for own results" on generation_results;

-- Create new simplified policies for generation_prompts
create policy "Enable insert for authenticated users"
  on generation_prompts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Enable read access for own prompts"
  on generation_prompts
  for select
  using (auth.uid() = user_id);

-- Create new simplified policies for generation_results
create policy "Enable read access for own results"
  on generation_results
  for select
  using (
    exists (
      select 1 from generation_prompts
      where id = prompt_id
      and user_id = auth.uid()
    )
  );
