/*
  # Add API Keys Table
  
  1. New Tables
    - api_keys
      - id (uuid, primary key)
      - service (text)
      - api_key (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
*/

-- Create api_keys table
create table if not exists api_keys (
  id uuid primary key default uuid_generate_v4(),
  service text not null,
  api_key text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table api_keys enable row level security;

-- Create policy for api_keys
create policy "Only authenticated users can read api keys"
  on api_keys for select
  to authenticated
  using (true);

-- Insert initial API key (replace with your actual key)
insert into api_keys (service, api_key)
values ('stability_ai', 'YOUR-STABILITY-AI-API-KEY-HERE');
