alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check check (role in ('admin', 'moderator', 'customer'));

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status in ('Pending', 'Delivered', 'Cancelled'));

create or replace function public.sync_user_profile()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_role text;
  v_name text;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'customer');
  if v_role not in ('admin', 'moderator', 'customer') then
    v_role := 'customer';
  end if;
  v_name := coalesce(new.raw_user_meta_data->>'name', '');
  insert into public.users (id, email, name, role)
  values (new.id, new.email, v_name, v_role)
  on conflict (id) do update
    set email = excluded.email,
        name  = excluded.name,
        role  = excluded.role;
  return new;
exception
  when others then
    raise warning 'sync_user_profile failed for %: %', new.id, sqlerrm;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.sync_user_profile();

alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "admins can manage users" on public.users;
drop policy if exists "users can read own profile" on public.users;
create policy "admins can manage users" on public.users
  for all
  using ((auth.jwt()->'user_metadata'->>'role') in ('admin', 'moderator'))
  with check ((auth.jwt()->'user_metadata'->>'role') in ('admin', 'moderator'));
create policy "users can read own profile" on public.users
  for select to authenticated using (id = auth.uid());

drop policy if exists "admins can manage orders" on public.orders;
drop policy if exists "users can manage own orders" on public.orders;
create policy "admins can manage orders" on public.orders
  for all
  using ((auth.jwt()->'user_metadata'->>'role') in ('admin', 'moderator'))
  with check ((auth.jwt()->'user_metadata'->>'role') in ('admin', 'moderator'));
create policy "users can manage own orders" on public.orders
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "admins can manage profiles" on public.profiles;
drop policy if exists "users can read own profile row" on public.profiles;
create policy "admins can manage profiles" on public.profiles
  for all
  using ((auth.jwt()->'user_metadata'->>'role') in ('admin', 'moderator'))
  with check ((auth.jwt()->'user_metadata'->>'role') in ('admin', 'moderator'));
create policy "users can read own profile row" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "admins can manage products" on public.products;
drop policy if exists "public can read products" on public.products;
create policy "public can read products" on public.products
  for select to anon, authenticated using (true);
create policy "admins can manage products" on public.products
  for all
  using ((auth.jwt()->'user_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'user_metadata'->>'role') = 'admin');

drop policy if exists "admins can upload product images" on storage.objects;
drop policy if exists "public can read product images" on storage.objects;
create policy "public can read product images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');
create policy "admins can upload product images" on storage.objects
  for all
  using (bucket_id = 'product-images' and (auth.jwt()->'user_metadata'->>'role') = 'admin')
  with check (bucket_id = 'product-images' and (auth.jwt()->'user_metadata'->>'role') = 'admin');
