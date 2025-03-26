/*
  # Add foreign key relationship to comments table

  1. Changes
    - Add foreign key constraint from comments.user_id to profiles.id
    - Enable RLS on comments table
    - Add RLS policies for comments

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own comments
    - Add policies for users to view comments on content they can access
*/

-- Add foreign key constraint
ALTER TABLE comments
ADD CONSTRAINT comments_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can create their own comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view comments on content they can access"
ON comments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM content_items
    WHERE content_items.id = comments.content_id
    AND (
      content_items.visibility = 'public'
      OR (
        content_items.visibility = 'followers'
        AND EXISTS (
          SELECT 1 FROM follows
          WHERE follows.following_id = content_items.creator_id
          AND follows.follower_id = auth.uid()
        )
      )
      OR (
        content_items.visibility = 'private'
        AND content_items.creator_id = auth.uid()
      )
    )
  )
);
