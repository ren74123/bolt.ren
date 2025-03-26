/*
  # Fix Generation Results RLS Policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies for generation_results
    - Ensure proper insert and select permissions

  2. Security
    - Users can only view results from their own prompts
    - Users can only create results for their own prompts
*/

-- Drop existing policies
drop policy if exists "Enable read access for own results" on generation_results;
drop policy if exists "Enable insert for own results" on generation_results;

-- Create new policies for generation_results
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
