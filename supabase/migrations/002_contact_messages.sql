create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  reply text default null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "anyone can insert messages" on public.contact_messages;
create policy "anyone can insert messages" on public.contact_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "admins can manage messages" on public.contact_messages;
create policy "admins can manage messages" on public.contact_messages
  for all using ((auth.jwt()->'user_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'user_metadata'->>'role') = 'admin');
