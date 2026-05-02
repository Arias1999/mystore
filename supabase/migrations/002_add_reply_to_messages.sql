alter table public.contact_messages
  add column if not exists reply text default null;
