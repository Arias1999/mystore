-- ============================================================
-- STEP 1: Ensure role column exists with correct constraint
-- ============================================================
alter table public.users
  add column if not exists role text not null default 'customer';

alter table public.users
  drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check
  check (role in ('admin', 'moderator', 'customer'));

-- ============================================================
-- STEP 2: Fix the sync trigger — always sets role from metadata
-- ============================================================
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
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.sync_user_profile();

-- ============================================================
-- STEP 3: Sync ALL existing auth users into public.users
-- ============================================================
insert into public.users (id, email, name, role)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'name', ''),
  case
    when raw_user_meta_data->>'role' in ('admin', 'moderator', 'customer')
    then raw_user_meta_data->>'role'
    else 'customer'
  end
from auth.users
on conflict (id) do update
  set email = excluded.email,
      name  = excluded.name;

-- ============================================================
-- STEP 4: Force admin role for admin@gmail.com
-- ============================================================
update public.users
set role = 'admin'
where email = 'admin@gmail.com';

-- Also update the auth metadata so JWT carries the role
update auth.users
set raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
where email = 'admin@gmail.com';

-- ============================================================
-- STEP 5: RLS policies — DB role is the source of truth
-- ============================================================
alter table public.users enable row level security;

drop policy if exists "admins can manage users" on public.users;
create policy "admins can manage users" on public.users
  for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('admin', 'moderator')
    )
  )
  with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('admin', 'moderator')
    )
  );

drop policy if exists "users can read own profile" on public.users;
create policy "users can read own profile" on public.users
  for select to authenticated
  using (id = auth.uid());
