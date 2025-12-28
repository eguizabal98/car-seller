-- Create SERVICE_HISTORY table
create table service_history (
  id uuid default uuid_generate_v4() primary key,
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  date date not null,
  service_type text not null, -- e.g., 'Major Service', 'Interim Service', 'Oil Change'
  description text,
  provider text, -- e.g., 'Porsche Centre London'
  mileage integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) for SERVICE_HISTORY
alter table service_history enable row level security;

create policy "Service history is viewable by everyone" on service_history for select using (true);

create policy "Only admins can manage service history" on service_history for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

-- Realtime publication
alter publication supabase_realtime add table service_history;
