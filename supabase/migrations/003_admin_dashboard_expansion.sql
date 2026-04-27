create table if not exists public.customers (
  id uuid primary key references public.users(id) on delete cascade,
  name text,
  email text not null,
  phone text,
  total_orders integer not null default 0 check (total_orders >= 0),
  created_at timestamptz not null default now()
);

insert into public.customers (id, name, email, created_at)
select u.id, u.name, u.email, u.created_at
from public.users u
where u.role = 'customer'
on conflict (id) do update
set
  name = excluded.name,
  email = excluded.email;

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
    set
      name = excluded.name,
      email = excluded.email;
  else
    delete from public.customers where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_public_user_changed_for_customers on public.users;
create trigger on_public_user_changed_for_customers
after insert or update on public.users
for each row execute function public.sync_customer_profile();

create or replace function public.recompute_customer_order_count(customer_uuid uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.customers c
  set total_orders = (
    select count(*)
    from public.orders o
    where o.customer_id = customer_uuid
  )
  where c.id = customer_uuid;
end;
$$;

create or replace function public.sync_customer_order_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if tg_op = 'INSERT' then
    perform public.recompute_customer_order_count(new.customer_id);
  elsif tg_op = 'DELETE' then
    perform public.recompute_customer_order_count(old.customer_id);
  elsif tg_op = 'UPDATE' then
    perform public.recompute_customer_order_count(old.customer_id);
    perform public.recompute_customer_order_count(new.customer_id);
  end if;
  return null;
end;
$$;

drop trigger if exists on_orders_changed_for_customer_count on public.orders;
create trigger on_orders_changed_for_customer_count
after insert or update or delete on public.orders
for each row execute function public.sync_customer_order_count();

update public.customers c
set total_orders = (
  select count(*)
  from public.orders o
  where o.customer_id = c.id
);

alter table public.customers enable row level security;

drop policy if exists "admins can manage customers" on public.customers;
create policy "admins can manage customers" on public.customers
for all
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check
  check (status in ('Pending', 'Delivered', 'Cancelled'));
