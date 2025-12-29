-- Create a new storage bucket for vehicle images
insert into storage.buckets (id, name, public)
values ('vehicles', 'vehicles', true);

-- Policy: Allow public read access to vehicle images
create policy "Vehicle images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'vehicles' );

-- Policy: Allow authenticated users to upload vehicle images
create policy "Authenticated users can upload vehicle images."
  on storage.objects for insert
  with check ( bucket_id = 'vehicles' and auth.role() = 'authenticated' );

-- Policy: Allow authenticated users to update vehicle images
create policy "Authenticated users can update vehicle images."
  on storage.objects for update
  using ( bucket_id = 'vehicles' and auth.role() = 'authenticated' )
  with check ( bucket_id = 'vehicles' and auth.role() = 'authenticated' );

-- Policy: Allow authenticated users to delete vehicle images
create policy "Authenticated users can delete vehicle images."
  on storage.objects for delete
  using ( bucket_id = 'vehicles' and auth.role() = 'authenticated' );
