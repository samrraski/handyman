-- ============================================================
-- Handyman Pro — Inquiries Table
-- Run this in the Supabase SQL Editor
-- ============================================================

create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  service     text,
  address     text,
  description text,
  estimate    jsonb,           -- full calculator breakdown
  total       numeric(12, 2),  -- estimate total
  status      text not null default 'new'
                check (status in ('new','contacted','quoted','booked','completed','cancelled')),
  admin_notes text,
  created_at  timestamptz not null default now()
);

alter table public.inquiries enable row level security;

-- Anyone can submit an inquiry (public form)
create policy "Public can submit inquiry"
  on public.inquiries for insert
  with check (true);

-- Only authenticated users (admin) can read and update
create policy "Admin can read inquiries"
  on public.inquiries for select
  using (auth.role() = 'authenticated');

create policy "Admin can update inquiries"
  on public.inquiries for update
  using (auth.role() = 'authenticated');
