-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Profiles (handled via triggers usually, or just query auth.users, but here we just rely on auth.users for id)
-- We can create a public profiles table if needed, but for this app we just link by user_id.

-- Sleep Logs Table
create table public.sleep_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  sleep_start timestamptz not null,
  wake_end timestamptz,
  duration_minutes integer,
  quality_rating integer,
  notes text,
  created_at timestamptz default now() not null
);

-- Notes Table
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text,
  tags text[], -- Array of strings
  is_pinned boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Profiles Table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  username text unique,
  avatar_url text,
  updated_at timestamptz,
  created_at timestamptz default now() not null
);

-- RLS Policies (Row Level Security)
alter table public.sleep_logs enable row level security;
alter table public.notes enable row level security;
alter table public.profiles enable row level security;

-- Sleep Logs Policies
create policy "Users can view their own sleep logs"
  on public.sleep_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sleep logs"
  on public.sleep_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sleep logs"
  on public.sleep_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sleep logs"
  on public.sleep_logs for delete
  using (auth.uid() = user_id);

-- Notes Policies
create policy "Users can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
