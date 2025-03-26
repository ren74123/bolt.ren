/*
  # Fix Profiles RLS Policies

  1. Changes
    - Add RLS policy for inserting profiles
    - Update existing RLS policies to be more permissive
    - Allow users to create and update their own profiles

  2. Security
    - Users can only create profiles for themselves
    - Users can only update their own profiles
    - Everyone can view profiles
*/

-- Drop existing policies
drop policy if exists "Profiles are viewable by everyone" on profiles;
drop policy if exists "Users can update their own profile" on profiles;

-- Create new policies
create policy "Enable read access for all users"
  on profiles for select
  using (true);

create policy "Enable insert for authenticated users only"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Enable update for users based on id"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
