/*
  # Fix content_items relationships and queries

  1. Changes
    - Drop and recreate content_items table with proper relationships
    - Add proper foreign key constraints
    - Update RLS policies
    - Add necessary indexes

  2. Security
    - Enable RLS
    - Add policies for content visibility
    - Add policies for content management
*/

-- Drop existing trigger and function
drop trigger if exists update_content_recommendation on content_items;
drop function if exists update_recommendation_score();

-- Drop existing table
drop table if exists content_items cascade;

-- Create content_items table with proper relationships
create table content_items (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  type text check (type in ('image', '3d_scene')) not null,
  content_url text not null,
  metadata jsonb default '{}'::jsonb,
  recommended boolean default false,
  recommendation_score double precision default 0.0,
  recommendation_reason text,
  visibility text check (visibility in ('public', 'private', 'followers')) default 'public',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table content_items enable row level security;

-- Create RLS policies
create policy "Content is viewable based on visibility"
  on content_items for select
  using (
    visibility = 'public' or
    (visibility = 'followers' and exists (
      select 1 from follows
      where following_id = creator_id
      and follower_id = auth.uid()
    )) or
    (visibility = 'private' and creator_id = auth.uid())
  );

create policy "Users can create content"
  on content_items for insert
  with check (auth.uid() = creator_id);

create policy "Users can update their own content"
  on content_items for update
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

-- Create indexes
create index if not exists idx_content_items_creator_id on content_items(creator_id);
create index if not exists idx_content_items_created_at on content_items(created_at desc);
create index if not exists idx_content_items_recommended on content_items(recommended) where recommended = true;
create index if not exists idx_content_items_recommendation_score on content_items(recommendation_score desc) where recommended = true;

-- Create recommendation score update function
create or replace function update_recommendation_score()
returns trigger as $$
begin
  -- Calculate recommendation score based on various factors
  new.recommendation_score := (
    -- Base score from likes and comments
    coalesce((select count(*) from likes where content_id = new.id), 0) * 2 +
    coalesce((select count(*) from comments where content_id = new.id), 0) * 3 +
    
    -- Creator influence
    coalesce((select count(*) from follows where following_id = new.creator_id), 0) * 0.5 +
    
    -- Time decay (newer content scores higher)
    1.0 / (extract(epoch from (now() - new.created_at)) / 3600 + 1)
  );

  -- Set recommended flag if score is high enough
  new.recommended := new.recommendation_score > 10.0;

  -- Set recommendation reason
  if new.recommended then
    new.recommendation_reason := case
      when new.recommendation_score > 50 then '热门创作'
      when coalesce((select count(*) from likes where content_id = new.id), 0) > 100 then '深受欢迎'
      when coalesce((select count(*) from comments where content_id = new.id), 0) > 20 then '讨论热烈'
      else '优质作品'
    end;
  end if;

  return new;
end;
$$ language plpgsql;

-- Create trigger
create trigger update_content_recommendation
  before insert or update on content_items
  for each row
  execute function update_recommendation_score();
