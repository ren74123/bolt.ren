/*
  # Add contacts table and related features

  1. New Tables
    - contacts
      - id (uuid, primary key)
      - name (text, not null)
      - phone (text, not null)
      - avatar_url (text)
      - company_info (jsonb)
      - contact_methods (jsonb)
      - notes (text)
      - created_by (uuid, references auth.users)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on contacts table
    - Add policies for authenticated users to manage their own contacts
    - Add phone number validation check
*/

-- Create contacts table with created_by column
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  avatar_url text,
  company_info jsonb default '{}'::jsonb,
  contact_methods jsonb default '[]'::jsonb,
  notes text,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table contacts enable row level security;

-- Create policies
create policy "Users can manage their own contacts"
  on contacts for all
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Create indexes
create index if not exists idx_contacts_created_by on contacts(created_by);
create index if not exists idx_contacts_phone on contacts(phone);

-- Add phone number validation check
alter table contacts
  add constraint contacts_phone_check 
  check (phone ~ '^1[3-9]\d{9}$');
