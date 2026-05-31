create table if not exists public.calculator_settings (
  id text primary key default 'default',
  labor_rate numeric not null default 65,
  waste_percent numeric not null default 10,
  tax_rate numeric not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.calculator_settings (id, labor_rate, waste_percent, tax_rate)
values ('default', 65, 10, 5)
on conflict (id) do nothing;

alter table public.calculator_settings enable row level security;

drop policy if exists "Calculator settings are publicly readable" on public.calculator_settings;
create policy "Calculator settings are publicly readable"
  on public.calculator_settings
  for select
  using (true);

drop policy if exists "Authenticated users can manage calculator settings" on public.calculator_settings;
create policy "Authenticated users can manage calculator settings"
  on public.calculator_settings
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
