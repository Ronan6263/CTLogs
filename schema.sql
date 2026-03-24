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
