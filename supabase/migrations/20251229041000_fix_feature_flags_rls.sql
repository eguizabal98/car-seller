drop policy "Allow admin update access" on feature_flags;

create policy "Allow admin update access"
  on feature_flags for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role in ('admin', 'staff')
    )
  );
