/*
  # Identity System Implementation

  1. New Tables
    - `digital_identities`
      - Core identity data for both real and clone identities
    - `identity_genes`
      - Genetic traits and characteristics
    - `identity_mutations`
      - Mutation records and effects
    - `identity_versions`
      - Version control for identity changes

  2. Security
    - Enable RLS on all tables
    - Add policies for identity management
    - Add validation constraints
*/

-- Create digital_identities table
create table if not exists digital_identities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  type text check (type in ('real', 'clone')) not null,
  base_id uuid references digital_identities(id),
  name text not null,
  status text check (status in ('active', 'inactive', 'locked')) default 'active',
  creation_progress integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create identity_genes table
create table if not exists identity_genes (
  id uuid primary key default uuid_generate_v4(),
  identity_id uuid references digital_identities(id) on delete cascade,
  name text not null,
  value integer check (value between 0 and 100),
  color text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create identity_mutations table
create table if not exists identity_mutations (
  id uuid primary key default uuid_generate_v4(),
  identity_id uuid references digital_identities(id) on delete cascade,
  type text not null,
  effect jsonb not null,
  applied_at timestamptz default now(),
  expires_at timestamptz,
  metadata jsonb default '{}'::jsonb
);

-- Create identity_versions table
create table if not exists identity_versions (
  id uuid primary key default uuid_generate_v4(),
  identity_id uuid references digital_identities(id) on delete cascade,
  version_number integer not null,
  changes jsonb not null,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table digital_identities enable row level security;
alter table identity_genes enable row level security;
alter table identity_mutations enable row level security;
alter table identity_versions enable row level security;

-- Create policies for digital_identities
create policy "Users can manage their own identities"
  on digital_identities
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policies for identity_genes
create policy "Users can manage genes of their identities"
  on identity_genes
  for all
  using (
    exists (
      select 1 from digital_identities
      where id = identity_id
      and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from digital_identities
      where id = identity_id
      and user_id = auth.uid()
    )
  );

-- Create policies for identity_mutations
create policy "Users can manage mutations of their identities"
  on identity_mutations
  for all
  using (
    exists (
      select 1 from digital_identities
      where id = identity_id
      and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from digital_identities
      where id = identity_id
      and user_id = auth.uid()
    )
  );

-- Create policies for identity_versions
create policy "Users can manage versions of their identities"
  on identity_versions
  for all
  using (
    exists (
      select 1 from digital_identities
      where id = identity_id
      and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from digital_identities
      where id = identity_id
      and user_id = auth.uid()
    )
  );

-- Create indexes
create index if not exists idx_digital_identities_user_id on digital_identities(user_id);
create index if not exists idx_identity_genes_identity_id on identity_genes(identity_id);
create index if not exists idx_identity_mutations_identity_id on identity_mutations(identity_id);
create index if not exists idx_identity_versions_identity_id on identity_versions(identity_id);
