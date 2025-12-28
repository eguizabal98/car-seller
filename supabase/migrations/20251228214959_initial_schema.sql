-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create ENUMs for vehicle attributes
create type vehicle_status as enum ('available', 'reserved', 'sold', 'coming_soon');
create type fuel_type as enum ('petrol', 'diesel', 'electric', 'hybrid', 'plug_in_hybrid');
create type transmission_type as enum ('automatic', 'manual', 'semi_automatic');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type booking_type as enum ('test_drive', 'video_walkthrough');

-- Create PROFILES table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone_number text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin', 'staff')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create VEHICLES table
create table vehicles (
  id uuid default uuid_generate_v4() primary key,
  make text not null,
  model text not null,
  year integer not null,
  price decimal(12, 2) not null,
  mileage integer not null,
  fuel_type fuel_type not null,
  transmission transmission_type not null,
  body_type text not null, -- e.g. SUV, Sedan, Coupe
  color text,
  vin text unique, -- Vehicle Identification Number
  status vehicle_status default 'available' not null,
  description text,
  features jsonb default '[]'::jsonb, -- Array of strings features
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create MEDIA table
create table media (
  id uuid default uuid_generate_v4() primary key,
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  url text not null,
  type text not null check (type in ('image', 'video_url', '360_view')),
  is_primary boolean default false,
  caption text,
  metadata jsonb default '{}'::jsonb, -- For hotspots or other data
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create BOOKINGS table
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  vehicle_id uuid references vehicles(id) on delete set null, -- Keep booking record even if vehicle is deleted? Or cascade?
  booking_date date not null,
  time_slot time not null,
  type booking_type default 'test_drive' not null,
  status booking_status default 'pending' not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create CHAT_ROOMS table
create table chat_rooms (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create CHAT_PARTICIPANTS table
create table chat_participants (
  room_id uuid references chat_rooms(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (room_id, user_id)
);

-- Create MESSAGES table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references chat_rooms(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

-- PROFILES
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- VEHICLES
alter table vehicles enable row level security;
create policy "Vehicles are viewable by everyone" on vehicles for select using (true);
create policy "Only admins can insert/update/delete vehicles" on vehicles for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

-- MEDIA
alter table media enable row level security;
create policy "Media is viewable by everyone" on media for select using (true);
create policy "Only admins can manage media" on media for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

-- BOOKINGS
alter table bookings enable row level security;
create policy "Users can view their own bookings" on bookings for select using (auth.uid() = user_id);
create policy "Admins can view all bookings" on bookings for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = user_id);
create policy "Users can update their own bookings" on bookings for update using (auth.uid() = user_id);

-- CHAT (Simplified RLS)
alter table chat_rooms enable row level security;
create policy "Users can view rooms they are participants in" on chat_rooms for select using (
  exists (select 1 from chat_participants where room_id = id and user_id = auth.uid())
);

alter table chat_participants enable row level security;
create policy "Participants viewable by participants" on chat_participants for select using (
  exists (select 1 from chat_participants cp where cp.room_id = room_id and cp.user_id = auth.uid())
);

alter table messages enable row level security;
create policy "Users can view messages in their rooms" on messages for select using (
  exists (select 1 from chat_participants where room_id = messages.room_id and user_id = auth.uid())
);
create policy "Users can insert messages in their rooms" on messages for insert with check (
  exists (select 1 from chat_participants where room_id = messages.room_id and user_id = auth.uid())
);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Realtime publication
alter publication supabase_realtime add table vehicles;
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table bookings;
