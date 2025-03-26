/*
  # Fix Content Relationships

  1. Changes
    - Drop and recreate content_items table with proper relationships
    - Create likes and comments tables with correct foreign keys
    - Add RLS policies for all tables
    - Add proper indexes for performance

  2. Security
    - Enable RLS on all tables
    - Add policies for content management
    - Add policies for likes and comments
*/

-- Drop existing tables to start fresh
drop trigger if exists update_content_recommendation on content_items;
drop function if exists update_recommendation_score();
drop table if exists likes cascade;
drop table if exists comments cascade;
drop table if exists content_items cascade;

-- Create content_items table
create table content_items (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references profiles(id) on delete set null,
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

-- Create likes table
create table likes (
  user_id uuid references auth.users(id) on delete cascade,
  content_id uuid references content_items(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, content_id)
);

-- Create comments table
create table comments (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid references content_items(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table content_items enable row level security;
alter table likes enable row level security;
alter table comments enable row level security;

-- Create RLS policies for content_items
create policy "Content is viewable based on visibility"
  on content_items for select
  using (
    visibility = 'public' or
    (visibility = 'followers' and exists (
      select 1 from follows
      where following_id = creator_id
      and follower_id = auth.uid()
    )) or
    (visibility = 'private' and creator_id in (
      select id from profiles where auth.uid() = id
    ))
  );

create policy "Users can create content"
  on content_items for insert
  with check (creator_id in (
    select id from profiles where auth.uid() = id
  ));

create policy "Users can update their own content"
  on content_items for update
  using (creator_id in (
    select id from profiles where auth.uid() = id
  ))
  with check (creator_id in (
    select id from profiles where auth.uid() = id
  ));

-- Create RLS policies for likes
create policy "Users can manage their own likes"
  on likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create RLS policies for comments
create policy "Users can comment on content"
  on comments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create indexes
create index if not exists idx_content_items_creator_id on content_items(creator_id);
create index if not exists idx_content_items_created_at on content_items(created_at desc);
create index if not exists idx_content_items_recommended on content_items(recommended) where recommended = true;
create index if not exists idx_content_items_recommendation_score on content_items(recommendation_score desc) where recommended = true;
create index if not exists idx_likes_content_id on likes(content_id);
create index if not exists idx_likes_user_id on likes(user_id);
create index if not exists idx_comments_content_id on comments(content_id);
create index if not exists idx_comments_user_id on comments(user_id);

-- Create recommendation score update function
create or replace function update_recommendation_score()
returns trigger as $$
declare
  like_count integer;
  comment_count integer;
  follower_count integer;
begin
  -- Get counts safely
  select count(*) into like_count from likes where content_id = new.id;
  select count(*) into comment_count from comments where content_id = new.id;
  select count(*) into follower_count from follows where following_id = new.creator_id;

  -- Calculate recommendation score
  new.recommendation_score := (
    coalesce(like_count, 0) * 2 +
    coalesce(comment_count, 0) * 3 +
    coalesce(follower_count, 0) * 0.5 +
    1.0 / (extract(epoch from (now() - new.created_at)) / 3600 + 1)
  );

  -- Set recommended flag and reason
  new.recommended := new.recommendation_score > 10.0;
  
  if new.recommended then
    new.recommendation_reason := case
      when new.recommendation_score > 50 then '热门创作'
      when coalesce(like_count, 0) > 100 then '深受欢迎'
      when coalesce(comment_count, 0) > 20 then '讨论热烈'
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
