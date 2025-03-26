/*
  # Add recommendation fields to content_items

  1. New Fields
    - `recommended` (boolean) - Whether this item is recommended
    - `recommendation_score` (float) - Score for sorting recommendations
    - `recommendation_reason` (text) - Why this item is recommended
    - `visibility` (text) - Content visibility level

  2. Changes
    - Add indexes for efficient querying
    - Update RLS policies
*/

-- Add recommendation fields to content_items
alter table content_items
  add column if not exists recommended boolean default false,
  add column if not exists recommendation_score float default 0.0,
  add column if not exists recommendation_reason text,
  add column if not exists visibility text check (visibility in ('public', 'private', 'followers')) default 'public';

-- Create indexes for better performance
create index if not exists idx_content_items_recommended on content_items(recommended) where recommended = true;
create index if not exists idx_content_items_recommendation_score on content_items(recommendation_score desc) where recommended = true;
create index if not exists idx_content_items_created_at on content_items(created_at desc);

-- Update RLS policies
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

-- Create function to update recommendation score
create or replace function update_recommendation_score()
returns trigger as $$
begin
  -- Calculate recommendation score based on various factors
  new.recommendation_score := (
    -- Base score from likes and comments
    (select count(*) from likes where content_id = new.id) * 2 +
    (select count(*) from comments where content_id = new.id) * 3 +
    
    -- Creator influence
    (select count(*) from follows where following_id = new.creator_id) * 0.5 +
    
    -- Time decay (newer content scores higher)
    1.0 / (extract(epoch from (now() - new.created_at)) / 3600 + 1)
  );

  -- Set recommended flag if score is high enough
  new.recommended := new.recommendation_score > 10.0;

  -- Set recommendation reason
  if new.recommended then
    new.recommendation_reason := case
      when new.recommendation_score > 50 then '热门创作'
      when (select count(*) from likes where content_id = new.id) > 100 then '深受欢迎'
      when (select count(*) from comments where content_id = new.id) > 20 then '讨论热烈'
      else '优质作品'
    end;
  end if;

  return new;
end;
$$ language plpgsql;

-- Create trigger to update recommendation score
create trigger update_content_recommendation
  before insert or update on content_items
  for each row
  execute function update_recommendation_score();
