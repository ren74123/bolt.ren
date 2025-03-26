/*
  # Fix comments table user relationship

  1. Changes
    - Add foreign key relationship between comments.user_id and profiles.id
    - Update comments table structure to ensure proper user relationship

  2. Security
    - Maintain data integrity with foreign key constraint
*/

-- First check if user_id column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'comments' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE comments ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Drop existing foreign key if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'comments_user_id_fkey' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE comments DROP CONSTRAINT comments_user_id_fkey;
  END IF;
END $$;

-- Add foreign key constraint to profiles table
ALTER TABLE comments
ADD CONSTRAINT comments_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE CASCADE;
