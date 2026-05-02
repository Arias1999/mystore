-- Add rider to role constraint
alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check
  check (role in ('admin', 'moderator', 'customer', 'rider'));

-- Add rider_id to storefront_orders
alter table public.storefront_orders
  add column if not exists rider_id uuid references public.users(id) on delete set null;

-- Riders can view and update orders assigned to them
drop policy if exists "riders can view assigned orders" on public.storefront_orders;
create policy "riders can view assigned orders" on public.storefront_orders
  for select to authenticated
  using (rider_id = auth.uid());

drop policy if exists "riders can update assigned orders" on public.storefront_orders;
create policy "riders can update assigned orders" on public.storefront_orders
  for update to authenticated
  using (rider_id = auth.uid())
  with check (rider_id = auth.uid());
