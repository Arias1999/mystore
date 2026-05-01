-- Storefront orders table
create table if not exists public.storefront_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  total numeric(12,2) not null,
  payment text not null default 'Cash',
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  created_at timestamptz not null default now()
);

alter table public.storefront_orders enable row level security;

drop policy if exists "users can manage own storefront orders" on public.storefront_orders;
create policy "users can manage own storefront orders" on public.storefront_orders
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "admins can manage all storefront orders" on public.storefront_orders;
create policy "admins can manage all storefront orders" on public.storefront_orders
  for all
  using ((auth.jwt()->'user_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'user_metadata'->>'role') = 'admin');

-- Messages table
create table if not exists public.order_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.storefront_orders(id) on delete cascade,
  sender_role text not null check (sender_role in ('user', 'admin')),
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.order_messages enable row level security;

drop policy if exists "users can manage own order messages" on public.order_messages;
create policy "users can manage own order messages" on public.order_messages
  for all to authenticated
  using (
    order_id in (
      select id from public.storefront_orders where user_id = auth.uid()
    )
  )
  with check (
    order_id in (
      select id from public.storefront_orders where user_id = auth.uid()
    )
  );

drop policy if exists "admins can manage all order messages" on public.order_messages;
create policy "admins can manage all order messages" on public.order_messages
  for all
  using ((auth.jwt()->'user_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'user_metadata'->>'role') = 'admin');
