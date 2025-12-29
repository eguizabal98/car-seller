-- Create APP_SETTINGS table
create table app_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table app_settings enable row level security;

-- Policies
create policy "Settings are viewable by everyone" on app_settings for select using (true);
create policy "Only admins can manage settings" on app_settings for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

-- Insert default finance settings
insert into app_settings (key, value, description)
values (
  'finance_defaults',
  '{"interest_rate": 6.9, "min_deposit_percent": 10, "max_term_months": 72, "default_term_months": 48}'::jsonb,
  'Default configuration for the finance calculator'
);
