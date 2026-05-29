-- Add work_type and assigned_to to jobs table
alter table public.jobs add column if not exists work_type text;
alter table public.jobs add column if not exists assigned_to text;
