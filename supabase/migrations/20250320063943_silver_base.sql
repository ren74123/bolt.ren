/*
  # Fix Generation Prompts Migration

  1. Changes
    - Create generation_prompts table if not exists
    - Add proper RLS policies
    - Add necessary indexes
    - Add proper constraints

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create generation_prompts table if not exists
create table if not exists generation_prompts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  model_id uuid references ai_models(id),
  prompt text not null,
  negative_prompt text,
  parameters jsonb default '{}'::jsonb,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table generation_prompts enable row level security;

-- Create indexes
create index if not exists idx_generation_prompts_user_id on generation_prompts(user_id);
create index if not exists idx_generation_prompts_status on generation_prompts(status);

-- Create policies
create policy "Users can manage their own prompts"
  on generation_prompts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create generation_results table if not exists
create table if not exists generation_results (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references generation_prompts(id) on delete cascade,
  image_url text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS for results
alter table generation_results enable row level security;

-- Create policies for results
create policy "Users can view results of their prompts"
  on generation_results
  for select
  using (
    exists (
      select 1 from generation_prompts
      where id = prompt_id
      and user_id = auth.uid()
    )
  );
