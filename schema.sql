-- Run this in Supabase → SQL Editor → New Query

create table if not exists locations (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  site_id     text,
  address     text,
  description text,
  tags        text[]    default '{}',
  images      jsonb     default '[]',
  visits      jsonb     default '[]',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Allow anyone with the anon key to read/write (no login required)
alter table locations enable row level security;

create policy "Public read"   on locations for select using (true);
create policy "Public insert" on locations for insert with check (true);
create policy "Public update" on locations for update using (true);
create policy "Public delete" on locations for delete using (true);

-- V29: Add phone and sector to profiles
alter table profiles add column if not exists phone text;
alter table profiles add column if not exists sector text;
alter table profiles add column if not exists display_name text;

-- V29: Audit log table
create table if not exists audit_log (
  id          uuid primary key default gen_random_uuid(),
  action      text not null,
  detail      text,
  user_email  text not null,
  created_at  timestamptz default now()
);

alter table audit_log enable row level security;
create policy "Public read"   on audit_log for select using (true);
create policy "Public insert" on audit_log for insert with check (true);
