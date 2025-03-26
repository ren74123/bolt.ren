/*
  # Fix Content and Comments Relationship

  1. Changes
    - Create comments table with proper relationships
    - Add RLS policies for comments
    - Add indexes for better performance

  2. Security
    - Enable RLS
    - Add policies for comments management
*/

-- Drop existing comments table if exists
drop table if exists comments cascade;

-- Create comments table with proper relationships
create table comments (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid references content_items(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table comments enable row level security;

-- Create RLS policies
create policy "Users can comment on content"
  on comments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create indexes
create index if not exists idx_comments_content_id on comments(content_id);
create index if not exists idx_comments_user_id on comments(user_id);
