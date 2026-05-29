-- ============================================================
-- Handyman Pro — Services Module Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── Contractor Global Defaults ─────────────────────────────
create table if not exists public.contractor_defaults (
  contractor_id uuid primary key references public.profiles(id) on delete cascade,
  labor_rate     numeric(10,2) not null default 65,
  waste_percent  numeric(5,2)  not null default 10,
  profit_margin  numeric(5,2)  not null default 20,
  tax_rate       numeric(5,2)  not null default 5,
  updated_at     timestamptz   not null default now()
);

alter table public.contractor_defaults enable row level security;

create policy "Contractors manage own defaults"
  on public.contractor_defaults for all
  using (auth.uid() = contractor_id);

-- ── Material Prices (per contractor, per material key) ─────
create table if not exists public.material_prices (
  id            uuid primary key default gen_random_uuid(),
  contractor_id uuid not null references public.profiles(id) on delete cascade,
  material_key  text not null,
  unit_price    numeric(10,2) not null,
  updated_at    timestamptz not null default now(),
  unique (contractor_id, material_key)
);

alter table public.material_prices enable row level security;

create policy "Contractors manage own material prices"
  on public.material_prices for all
  using (auth.uid() = contractor_id);
