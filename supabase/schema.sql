-- RUN THIS IN THE SUPABASE SQL EDITOR (Project > SQL Editor > New query)
-- Backs the /admin bookings/leads dashboard. Google Sheets (via Apps
-- Script) remains the system of record for the booking/contact forms
-- themselves — this is a secondary store the client dual-writes to.

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  check_in date not null,
  check_out date not null,
  guests int not null default 1,
  requirements text,
  source text not null default 'website',
  status text not null default 'Confirmed'
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text,
  source text not null default 'contact-form'
);

alter table bookings enable row level security;
alter table leads enable row level security;

-- Public (anon) can create rows — this is what lets the booking/contact
-- forms write from the browser — but cannot read, update, or delete
-- anything. Without this, the site's anon key (which is necessarily
-- public, embedded in the JS bundle) would let anyone read every
-- guest's name/phone/email directly via the Supabase REST API.
--
-- Policies are dropped-and-recreated (rather than plain CREATE) so this
-- whole script is safe to re-run after a partial/failed previous run —
-- plain CREATE POLICY errors out (and aborts the rest of the script) if
-- the policy already exists.
drop policy if exists "public can insert bookings" on bookings;
create policy "public can insert bookings" on bookings
  for insert to anon
  with check (true);

drop policy if exists "public can insert leads" on leads;
create policy "public can insert leads" on leads
  for insert to anon
  with check (true);

-- Only a signed-in user (an admin account you create in Supabase Auth,
-- NOT through the app's own UI) can read the data. This is what powers
-- the /admin dashboard.
drop policy if exists "authenticated can read bookings" on bookings;
create policy "authenticated can read bookings" on bookings
  for select to authenticated
  using (true);

drop policy if exists "authenticated can read leads" on leads;
create policy "authenticated can read leads" on leads
  for select to authenticated
  using (true);
