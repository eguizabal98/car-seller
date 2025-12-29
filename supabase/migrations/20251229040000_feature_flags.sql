create table public.feature_flags (
  key text primary key,
  is_enabled boolean default true not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id)
);

create index feature_flags_key_idx on public.feature_flags (key);

alter table feature_flags enable row level security;

create policy "Allow public read access"
  on feature_flags for select
  using (true);

create policy "Allow admin update access"
  on feature_flags for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role in ('ADMIN', 'STAFF')
    )
  );

insert into feature_flags (key, description, is_enabled) values
  ('buy', 'Enable inventory browsing and purchasing', true),
  ('sell', 'Enable sell your car flow', true),
  ('finance', 'Enable finance calculator and pages', true),
  ('about', 'Enable about page', true),
  ('footer', 'Enable global footer', true);
