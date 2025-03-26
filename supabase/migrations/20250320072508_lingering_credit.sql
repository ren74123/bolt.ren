/*
  # Fix content items schema and relationships

  1. Changes
    - Add missing foreign key relationship between content_items and users
    - Update RLS policies for content items
    - Fix creator relationship in queries

  2. Security
    - Ensure proper access control
    - Maintain data integrity
*/

-- First ensure the creator_id column exists and has proper foreign key
alter table content_items
  add column if not exists creator_id uuid references auth.users(id) on delete set null;

-- Drop existing policies
drop policy if exists "Content is viewable based on visibility" on content_items;
drop policy if exists "Content is viewable by everyone" on content_items;
drop policy if exists "Users can create content" on content_items;
drop policy if exists "Users can update their own content" on content_items;

-- Create new policies
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

-- Create indexes for better performance
create index if not exists idx_content_items_creator_id on content_items(creator_id);
create index if not exists idx_content_items_created_at on content_items(created_at desc);
create index if not exists idx_content_items_recommended on content_items(recommended) where recommended = true;
create index if not exists idx_content_items_recommendation_score on content_items(recommendation_score desc) where recommended = true;
