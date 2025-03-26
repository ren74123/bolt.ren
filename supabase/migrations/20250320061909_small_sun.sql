/*
  # Add AI Image Generation Support

  1. New Tables
    - `ai_models`
      - Stores available AI models for generation
    - `generation_prompts`
      - Stores user prompts and generation parameters
    - `generation_results`
      - Stores generated image results

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create ai_models table
create table if not exists ai_models (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text check (type in ('text-to-image', '3d-scene')) not null,
  description text,
  parameters jsonb default '{}'::jsonb,
  status text check (status in ('active', 'inactive', 'maintenance')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create generation_prompts table
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

-- Create generation_results table
create table if not exists generation_results (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references generation_prompts(id) on delete cascade,
  image_url text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table ai_models enable row level security;
alter table generation_prompts enable row level security;
alter table generation_results enable row level security;

-- Create policies
create policy "AI models are viewable by everyone"
  on ai_models for select
  using (true);

create policy "Users can manage their own prompts"
  on generation_prompts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can view results of their prompts"
  on generation_results for select
  using (
    exists (
      select 1 from generation_prompts
      where id = prompt_id
      and user_id = auth.uid()
    )
  );

-- Create indexes
create index if not exists idx_generation_prompts_user_id on generation_prompts(user_id);
create index if not exists idx_generation_prompts_status on generation_prompts(status);
create index if not exists idx_generation_results_prompt_id on generation_results(prompt_id);
