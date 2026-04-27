-- ================================================================
-- 004_fixes.sql  –  paste and run in Supabase SQL Editor
-- ================================================================

-- ── 1. users: allow 'moderator' role ────────────────────────────
alter table public.users drop constraint if exists users_role_check;
alter table public.users
  add constraint users_role_check
  check (role in ('admin', 'moderator', 'customer'));

-- ── 2. orders: fix status values (remove 'Shipped', add 'Cancelled')
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check
  check (status in ('Pending', 'Delivered', 'Cancelled'));

-- ── 3. sync_user_profile: accept moderator, sanitise unknown roles ─
create or replace function public.sync_user_profile()
returns trigger
language plpgsql
security definer
as $$
declare
  v_role text;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'customer');
  if v_role not in ('admin', 'moderator', 'customer') then
    v_role := 'customer';
  end if;

  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    v_role
  )
  on conflict (id) do update
    set email = excluded.email,
        name  = excluded.name,
        role  = excluded.role;

  return new;
end;
$$;

-- ── 4. sync_customer_profile: keep customers in sync with users ───
--    Also handles moderator rows (don't add them to customers table)
create or replace function public.sync_customer_profile()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.role = 'customer' then
    insert into public.customers (id, name, email, created_at)
    values (new.id, new.name, new.email, new.created_at)
    on conflict (id) do update
      set name  = excluded.name,
          email = excluded.email;
  else
    delete from public.customers where id = new.id;
  end if;
  return new;
end;
$$;

-- ================================================================
-- RLS POLICIES
-- Drop every policy we manage, then recreate cleanly.
-- ================================================================

-- ── users ────────────────────────────────────────────────────────
drop policy if exists "admins can manage users"    on public.users;
drop policy if exists "users can read own profile" on public.users;

-- admins + moderators can do everything
create policy "admins can manage users" on public.users
  for all
  using      ((auth.jwt()->'user_metadata'->>'role') in ('admin','moderator'))
  with check ((auth.jwt()->'user_metadata'->>'role') in ('admin','moderator'));

-- every logged-in user can read their own row
create policy "users can read own profile" on public.users
  for select
  to authenticated
  using (id = auth.uid());

-- ── products ─────────────────────────────────────────────────────
drop policy if exists "admins can manage products" on public.products;
drop policy if exists "public can read products"   on public.products;

-- anyone (including anonymous storefront visitors) can read
create policy "public can read products" on public.products
  for select
  to anon, authenticated
  using (true);

-- only admins can write
create policy "admins can manage products" on public.products
  for all
  using      ((auth.jwt()->'user_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'user_metadata'->>'role') = 'admin');

-- ── orders ───────────────────────────────────────────────────────
drop policy if exists "admins can manage orders"    on public.orders;
drop policy if exists "moderators can manage orders" on public.orders;
drop policy if exists "users can manage own orders" on public.orders;

-- admins + moderators can see and update all orders
create policy "admins can manage orders" on public.orders
  for all
  using      ((auth.jwt()->'user_metadata'->>'role') in ('admin','moderator'))
  with check ((auth.jwt()->'user_metadata'->>'role') in ('admin','moderator'));

-- customers can insert and read their own orders
create policy "users can manage own orders" on public.orders
  for all
  to authenticated
  using      (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- ── order_items ──────────────────────────────────────────────────
drop policy if exists "admins can manage order_items"    on public.order_items;
drop policy if exists "users can manage own order items" on public.order_items;

create policy "admins can manage order_items" on public.order_items
  for all
  using      ((auth.jwt()->'user_metadata'->>'role') in ('admin','moderator'))
  with check ((auth.jwt()->'user_metadata'->>'role') in ('admin','moderator'));

create policy "users can manage own order items" on public.order_items
  for all
  to authenticated
  using (
    order_id in (select id from public.orders where customer_id = auth.uid())
  )
  with check (
    order_id in (select id from public.orders where customer_id = auth.uid())
  );

-- ── customers ────────────────────────────────────────────────────
drop policy if exists "admins can manage customers" on public.customers;

create policy "admins can manage customers" on public.customers
  for all
  using      ((auth.jwt()->'user_metadata'->>'role') in ('admin','moderator'))
  with check ((auth.jwt()->'user_metadata'->>'role') in ('admin','moderator'));

-- ── contact_messages ─────────────────────────────────────────────
drop policy if exists "anyone can send contact messages"    on public.contact_messages;
drop policy if exists "admins can manage contact messages"  on public.contact_messages;

create policy "anyone can send contact messages" on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

create policy "admins can manage contact messages" on public.contact_messages
  for all
  using      ((auth.jwt()->'user_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'user_metadata'->>'role') = 'admin');

-- ── storage: product-images ──────────────────────────────────────
drop policy if exists "admins can upload product images" on storage.objects;
drop policy if exists "public can read product images"   on storage.objects;

-- storefront needs to display images
create policy "public can read product images" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- only admins can upload / delete
create policy "admins can upload product images" on storage.objects
  for all
  using (
    bucket_id = 'product-images'
    and (auth.jwt()->'user_metadata'->>'role') = 'admin'
  )
  with check (
    bucket_id = 'product-images'
    and (auth.jwt()->'user_metadata'->>'role') = 'admin'
  );
