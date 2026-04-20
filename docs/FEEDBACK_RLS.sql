-- Feedback table with RLS policies for director-role admin
-- Run this in the SQL editor for your Supabase project.

-- Create table (idempotent safe for first-run)
create table if not exists feedback (
  id uuid default uuid_generate_v4() primary key,
  name text,
  email text,
  message text,
  status text default 'pending', -- pending | reviewed
  created_at timestamptz default now()
);

-- Enable RLS
alter table feedback enable row level security;

-- Policy: allow inserts from public or authenticated users
-- Note: PostgreSQL policies for INSERT must use WITH CHECK (USING is not allowed for INSERT)
create policy "Allow inserts" on feedback
  for insert
  with check (true);

-- Admin policies: allow select/update/delete only to director-like roles
-- Split by command to avoid USING on INSERT issues
-- Assumes `crafter_profiles` table with `id = auth.uid()` and `role` column
create policy "Admin selects" on feedback
  for select
  using (
    exists (
      select 1 from crafter_profiles p
      where p.id = auth.uid() and p.role in ('director','ceo','officer')
    )
  );

create policy "Admin updates" on feedback
  for update
  using (
    exists (
      select 1 from crafter_profiles p
      where p.id = auth.uid() and p.role in ('director','ceo','officer')
    )
  )
  with check (
    exists (
      select 1 from crafter_profiles p
      where p.id = auth.uid() and p.role in ('director','ceo','officer')
    )
  );

create policy "Admin deletes" on feedback
  for delete
  using (
    exists (
      select 1 from crafter_profiles p
      where p.id = auth.uid() and p.role in ('director','ceo','officer')
    )
  );

-- For completeness: ensure inserts by admin accounts also allowed via check
create policy "Admin inserts" on feedback
  for insert
  with check (
    exists (
      select 1 from crafter_profiles p
      where p.id = auth.uid() and p.role in ('director','ceo','officer')
    )
  );

-- Notes:
-- - Keep public inserts open if you want anonymous submission via the browser (the "Allow inserts" policy above permits it).
-- - For server-side admin/scripted access, prefer using the Supabase service_role key for tasks that need full privileges.
-- - Adjust role names to match your project's `role` values.
