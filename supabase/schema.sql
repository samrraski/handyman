-- ============================================================
-- Handyman Pro — Initial Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── Profiles (extends auth.users) ──────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  company_name text,
  phone        text,
  city         text,
  province     text,
  role         text not null default 'contractor',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Clients ────────────────────────────────────────────────
create table if not exists public.clients (
  id           uuid primary key default gen_random_uuid(),
  contractor_id uuid not null references public.profiles(id) on delete cascade,
  full_name    text not null,
  email        text,
  phone        text,
  address      text,
  city         text,
  notes        text,
  created_at   timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Contractors manage own clients"
  on public.clients for all
  using (auth.uid() = contractor_id);

-- ── Jobs ───────────────────────────────────────────────────
create table if not exists public.jobs (
  id             uuid primary key default gen_random_uuid(),
  contractor_id  uuid not null references public.profiles(id) on delete cascade,
  client_id      uuid references public.clients(id) on delete set null,
  title          text not null,
  description    text,
  status         text not null default 'lead'
                   check (status in ('lead','scheduled','in_progress','completed','cancelled')),
  start_date     date,
  end_date       date,
  location       text,
  total_amount   numeric(12,2) default 0,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy "Contractors manage own jobs"
  on public.jobs for all
  using (auth.uid() = contractor_id);

-- ── Estimates ──────────────────────────────────────────────
create table if not exists public.estimates (
  id             uuid primary key default gen_random_uuid(),
  contractor_id  uuid not null references public.profiles(id) on delete cascade,
  client_id      uuid references public.clients(id) on delete set null,
  job_id         uuid references public.jobs(id) on delete set null,
  estimate_number text not null,
  title          text not null,
  status         text not null default 'draft'
                   check (status in ('draft','sent','accepted','declined','expired')),
  valid_until    date,
  subtotal       numeric(12,2) default 0,
  tax_rate       numeric(5,2) default 5,  -- Alberta GST
  tax_amount     numeric(12,2) default 0,
  total          numeric(12,2) default 0,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.estimates enable row level security;

create policy "Contractors manage own estimates"
  on public.estimates for all
  using (auth.uid() = contractor_id);

-- ── Estimate Line Items ─────────────────────────────────────
create table if not exists public.estimate_items (
  id           uuid primary key default gen_random_uuid(),
  estimate_id  uuid not null references public.estimates(id) on delete cascade,
  type         text not null default 'labor' check (type in ('labor','material','other')),
  description  text not null,
  quantity     numeric(10,3) not null default 1,
  unit         text,
  unit_price   numeric(12,2) not null default 0,
  total        numeric(12,2) generated always as (quantity * unit_price) stored,
  sort_order   int default 0
);

alter table public.estimate_items enable row level security;

create policy "Contractors manage own estimate items"
  on public.estimate_items for all
  using (
    exists (
      select 1 from public.estimates e
      where e.id = estimate_id and e.contractor_id = auth.uid()
    )
  );

-- ── Invoices ───────────────────────────────────────────────
create table if not exists public.invoices (
  id             uuid primary key default gen_random_uuid(),
  contractor_id  uuid not null references public.profiles(id) on delete cascade,
  client_id      uuid references public.clients(id) on delete set null,
  job_id         uuid references public.jobs(id) on delete set null,
  estimate_id    uuid references public.estimates(id) on delete set null,
  invoice_number text not null,
  status         text not null default 'draft'
                   check (status in ('draft','sent','paid','overdue','cancelled')),
  due_date       date,
  subtotal       numeric(12,2) default 0,
  tax_rate       numeric(5,2) default 0,
  tax_amount     numeric(12,2) default 0,
  total          numeric(12,2) default 0,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "Contractors manage own invoices"
  on public.invoices for all
  using (auth.uid() = contractor_id);
