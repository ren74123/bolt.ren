/*
  # Initial Schema Setup

  1. Users & Authentication
    - Uses Supabase built-in auth.users
    - Additional user profile information
    - User settings and preferences

  2. Chat & Messages
    - Conversations
    - Messages
    - Message reactions and status

  3. Content
    - Images
    - 3D scenes
    - User generated content

  4. Social Features
    - Follows
    - Likes
    - Comments
*/

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- User Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User Settings
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text default 'system',
  notification_preferences jsonb default '{}'::jsonb,
  privacy_settings jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Conversations
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid references auth.users(id) on delete set null,
  title text,
  type text check (type in ('direct', 'group')) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Conversation Participants
create table if not exists conversation_participants (
  conversation_id uuid references conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  last_read_at timestamptz default now(),
  primary key (conversation_id, user_id)
);

-- Messages
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  content text not null,
  type text default 'text',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Message Status
create table if not exists message_status (
  message_id uuid references messages(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  status text check (status in ('delivered', 'read')) not null,
  updated_at timestamptz default now(),
  primary key (message_id, user_id)
);

-- Content Items (Images & 3D Scenes)
create table if not exists content_items (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  type text check (type in ('image', '3d_scene')) not null,
  content_url text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Likes
create table if not exists likes (
  user_id uuid references auth.users(id) on delete cascade,
  content_id uuid references content_items(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, content_id)
);

-- Comments
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid references content_items(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Follows
create table if not exists follows (
  follower_id uuid references auth.users(id) on delete cascade,
  following_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table user_settings enable row level security;
alter table conversations enable row level security;
alter table conversation_participants enable row level security;
alter table messages enable row level security;
alter table message_status enable row level security;
alter table content_items enable row level security;
alter table likes enable row level security;
alter table comments enable row level security;
alter table follows enable row level security;

-- RLS Policies

-- Profiles: Users can read all profiles but only update their own
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Messages: Users can only access messages from conversations they're part of
create policy "Users can access messages from their conversations"
  on messages for all
  using (
    exists (
      select 1 from conversation_participants
      where conversation_id = messages.conversation_id
      and user_id = auth.uid()
    )
  );

-- Content: Public content is viewable by everyone
create policy "Content is viewable by everyone"
  on content_items for select
  using (true);

create policy "Users can create content"
  on content_items for insert
  with check (auth.uid() = creator_id);

create policy "Users can update their own content"
  on content_items for update
  using (auth.uid() = creator_id);

-- Likes & Comments: Users can interact with public content
create policy "Users can like content"
  on likes for all
  using (auth.uid() = user_id);

create policy "Users can comment on content"
  on comments for all
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_content_items_creator_id on content_items(creator_id);
create index if not exists idx_likes_content_id on likes(content_id);
create index if not exists idx_comments_content_id on comments(content_id);
