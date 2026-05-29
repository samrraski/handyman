-- Novareno: Site Content CMS Table
-- Run this in the Supabase SQL Editor

create table if not exists public.site_content (
  key        text primary key,
  value      text not null default '',
  label      text not null default '',
  section    text not null default 'general',
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Public can read content"
  on public.site_content for select using (true);

create policy "Authenticated can update content"
  on public.site_content for update
  using (auth.role() = 'authenticated');

create policy "Authenticated can insert content"
  on public.site_content for insert
  with check (auth.role() = 'authenticated');

-- Seed default content
insert into public.site_content (key, value, label, section) values
  ('hero_title',      'Calgary''s Most Trusted Renovation Contractor',                                            'Hero Title',        'home'),
  ('hero_subtitle',   'Quality craftsmanship, transparent pricing, and results you''ll love — guaranteed.',       'Hero Subtitle',     'home'),
  ('hero_cta',        'Get a Free Quote',                                                                          'Hero Button Text',  'home'),
  ('about_headline',  'Built on Craftsmanship, Driven by Quality',                                                'About Headline',    'about'),
  ('about_text',      'Novareno has been transforming Calgary homes for over 6 years. What started as a small crew with a passion for quality work has grown into one of Calgary''s most trusted renovation companies.', 'About Text', 'about'),
  ('about_mission',   'Our mission is simple: deliver exceptional renovations that stand the test of time, at prices that are fair and transparent.',  'About Mission',  'about'),
  ('story_headline',  'How Novareno Started',                                                                     'Story Headline',    'about'),
  ('story_text',      'Novareno was founded in 2018 by a team of experienced tradespeople who were tired of seeing homeowners get burned by unreliable contractors. We built our company on a simple principle: treat every home like it''s our own. Since then, we''ve completed over 300 renovation projects across Calgary.', 'Story Text', 'about'),
  ('process_intro',   'We make renovation simple, transparent, and stress-free with our proven 6-step process.', 'Process Intro',     'about'),
  ('team_headline',   'Meet the Novareno Team',                                                                   'Team Headline',     'about'),
  ('team_text',       'Our team of certified tradespeople brings decades of combined experience to every project.','Team Text',        'about'),
  ('projects_headline','Our Work Speaks for Itself',                                                              'Projects Headline', 'projects'),
  ('projects_subtext','Browse our portfolio of completed renovations across Calgary and the surrounding area.',   'Projects Subtext',  'projects'),
  ('contact_tagline', 'Ready to transform your home?',                                                            'Contact Tagline',   'contact')
on conflict (key) do nothing;
