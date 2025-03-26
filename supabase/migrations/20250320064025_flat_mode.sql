/*
  # Fix Generation Prompts and Results Policies

  1. Changes
    - Drop existing policies if they exist
    - Create new policies with proper checks
    - Add indexes for better performance

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing policies if they exist
drop policy if exists "Users can manage their own prompts" on generation_prompts;
drop policy if exists "Users can view results of their prompts" on generation_results;

-- Create new policies for generation_prompts
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

create policy "Users can delete their own prompts"
  on generation_prompts
  for delete
  using (auth.uid() = user_id);

-- Create new policies for generation_results
create policy "Users can view their own results"
  on generation_results
  for select
  using (
    exists (
      select 1 from generation_prompts
      where id = prompt_id
      and user_id = auth.uid()
    )
  );

create policy "Users can create results for their prompts"
  on generation_results
  for insert
  with check (
    exists (
      select 1 from generation_prompts
      where id = prompt_id
      and user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index if not exists idx_generation_prompts_user_id on generation_prompts(user_id);
create index if not exists idx_generation_prompts_status on generation_prompts(status);
create index if not exists idx_generation_results_prompt_id on generation_results(prompt_id);
