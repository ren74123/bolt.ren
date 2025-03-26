/*
  # Fix Generation Prompts RLS Policies

  1. Changes
    - Drop all existing policies
    - Create new policies with proper user checks
    - Add user_id column check for inserts

  2. Security
    - Users can only manage their own prompts
    - Authenticated users can create prompts
    - Results are linked to prompts
*/

-- Drop all existing policies to start fresh
drop policy if exists "Enable insert for authenticated users" on generation_prompts;
drop policy if exists "Enable select for own prompts" on generation_prompts;
drop policy if exists "Enable update for own prompts" on generation_prompts;
drop policy if exists "Enable delete for own prompts" on generation_prompts;
drop policy if exists "Enable select for own results" on generation_results;
drop policy if exists "Enable insert for own results" on generation_results;

-- Create new policies for generation_prompts
create policy "Enable insert for authenticated users"
  on generation_prompts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Enable select for own prompts"
  on generation_prompts
  for select
  using (auth.uid() = user_id);

create policy "Enable update for own prompts"
  on generation_prompts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Enable delete for own prompts"
  on generation_prompts
  for delete
  using (auth.uid() = user_id);

-- Create new policies for generation_results
create policy "Enable select for own results"
  on generation_results
  for select
  using (
    exists (
      select 1 from generation_prompts
      where id = prompt_id
      and user_id = auth.uid()
    )
  );

create policy "Enable insert for own results"
  on generation_results
  for insert
  with check (
    exists (
      select 1 from generation_prompts
      where id = prompt_id
      and user_id = auth.uid()
    )
  );
