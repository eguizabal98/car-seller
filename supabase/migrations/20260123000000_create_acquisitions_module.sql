-- Ensure 'coming_soon' status exists
alter type vehicle_status add value if not exists 'coming_soon';

-- Create ENUMs for acquisition workflow
create type acquisition_stage as enum ('auction', 'transport', 'repair', 'legalization', 'completed');
create type expense_category as enum ('purchase_price', 'auction_fee', 'transport_fee', 'repair_cost', 'legalization_fee', 'parts', 'labor', 'other');

-- Create ACQUISITIONS table
create table acquisitions (
  id uuid default gen_random_uuid() primary key,
  vehicle_id uuid references vehicles(id) on delete cascade not null, -- 1:1 relationship with a vehicle
  stage acquisition_stage default 'auction' not null,
  details jsonb default '{}'::jsonb, -- Stores stage-specific data (e.g., auction info, transport company)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(vehicle_id) -- Ensure one active acquisition per vehicle (though usually a vehicle is acquired once, this enforces 1:1)
);

-- Create EXPENSES table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  acquisition_id uuid references acquisitions(id) on delete cascade not null,
  category expense_category not null,
  amount decimal(12, 2) not null check (amount >= 0),
  description text,
  date date default CURRENT_DATE not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- ACQUISITIONS
alter table acquisitions enable row level security;

-- Only admins/staff can see acquisitions
create policy "Admins can view all acquisitions" on acquisitions for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

-- Only admins/staff can insert/update/delete acquisitions
create policy "Admins can manage acquisitions" on acquisitions for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

-- EXPENSES
alter table expenses enable row level security;

-- Only admins/staff can see expenses
create policy "Admins can view all expenses" on expenses for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

-- Only admins/staff can insert/update/delete expenses
create policy "Admins can manage expenses" on expenses for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

-- Realtime
alter publication supabase_realtime add table acquisitions;
alter publication supabase_realtime add table expenses;
