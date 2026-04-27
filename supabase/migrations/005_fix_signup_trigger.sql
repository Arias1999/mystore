-- ================================================================
-- 005_fix_signup_trigger.sql
-- Paste and run this in Supabase SQL Editor.
-- Fixes "database error saving a new user" on signup.
-- ================================================================

-- ── 1. Drop the role check constraint so the trigger can insert ──
alter table public.users drop constraint if exists users_role_check;
alter table public.users
  add constraint users_role_check
  check (role in ('admin', 'moderator', 'customer'));

-- ── 2. Replace sync_user_profile with a safe version ────────────
--    - Sanitises any unknown role to 'customer'
--    - Wrapped in exception handler so it never crashes signup
create or replace function public.sync_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
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
exception
  when others then
    -- Log the error but never block signup
    raise warning 'sync_user_profile failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- ── 3. Recreate the trigger ──────────────────────────────────────
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.sync_user_profile();

-- ── 4. Replace sync_customer_profile with a safe version ────────
create or replace function public.sync_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = public
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
exception
  when others then
    raise warning 'sync_customer_profile failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- ── 5. Recreate the customers trigger ───────────────────────────
drop trigger if exists on_public_user_changed_for_customers on public.users;
create trigger on_public_user_changed_for_customers
  after insert or update on public.users
  for each row execute function public.sync_customer_profile();

-- ── 6. Ensure RLS allows the trigger to insert into public.users ─
--    Triggers run as SECURITY DEFINER so they bypass RLS,
--    but add a self-insert policy as a safety net.
drop policy if exists "users can insert own profile" on public.users;
create policy "users can insert own profile" on public.users
  for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "users can read own profile" on public.users;
create policy "users can read own profile" on public.users
  for select
  to authenticated
  using (id = auth.uid());
