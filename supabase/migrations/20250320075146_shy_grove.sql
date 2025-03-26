/*
  # Fix Content and Likes Relationship

  1. Changes
    - Drop existing likes table if exists
    - Create new likes table with proper foreign key to content_items
    - Add RLS policies for likes table
    - Add indexes for better performance

  2. Security
    - Enable RLS
    - Add policies for likes management
*/

-- Drop existing likes table if exists
drop table if exists likes cascade;

-- Create likes table with proper relationships
create table likes (
  user_id uuid references auth.users(id) on delete cascade,
  content_id uuid references content_items(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, content_id)
);

-- Enable RLS
alter table likes enable row level security;

-- Create RLS policies
create policy "Users can like content"
  on likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create indexes
create index if not exists idx_likes_content_id on likes(content_id);
create index if not exists idx_likes_user_id on likes(user_id);
