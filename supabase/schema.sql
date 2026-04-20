-- Iactor schema
-- Run this in Supabase SQL editor

create extension if not exists "pgcrypto";

-- Instagram accounts connected by user
create table if not exists public.ig_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ig_user_id text not null,
  username text not null,
  access_token text not null,
  token_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Generations history (texts/images created by AI)
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('text','image','caption','copy')) not null,
  prompt text not null,
  output text not null,
  created_at timestamptz default now()
);

-- Scheduled / published posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ig_account_id uuid references public.ig_accounts(id) on delete set null,
  image_url text not null,
  caption text not null,
  scheduled_at timestamptz not null,
  status text check (status in ('draft','scheduled','publishing','published','failed')) default 'scheduled',
  ig_media_id text,
  error text,
  created_at timestamptz default now(),
  published_at timestamptz
);

create index if not exists posts_due_idx on public.posts (status, scheduled_at);

-- RLS
alter table public.ig_accounts enable row level security;
alter table public.generations enable row level security;
alter table public.posts enable row level security;

create policy "own ig_accounts" on public.ig_accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own generations" on public.generations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own posts" on public.posts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage bucket for generated images
insert into storage.buckets (id, name, public) values ('iactor', 'iactor', true)
on conflict (id) do nothing;

create policy "public read iactor" on storage.objects
  for select using (bucket_id = 'iactor');

create policy "auth upload iactor" on storage.objects
  for insert to authenticated with check (bucket_id = 'iactor');
