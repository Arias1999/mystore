do $$
declare
  rilay_id uuid := gen_random_uuid();
  rider_id uuid := gen_random_uuid();
begin

  -- Insert Rilay if not exists
  if not exists (select 1 from auth.users where email = 'rilay@lyrastore.com') then
    insert into auth.users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at, aud, role
    ) values (
      rilay_id, 'rilay@lyrastore.com',
      crypt('rilay123', gen_salt('bf')),
      now(), '{"name":"Rilay","role":"rider"}'::jsonb,
      now(), now(), 'authenticated', 'authenticated'
    );
    insert into public.users (id, email, name, role)
    values (rilay_id, 'rilay@lyrastore.com', 'Rilay', 'rider');
  end if;

  -- Insert Rider if not exists
  if not exists (select 1 from auth.users where email = 'rider@lyrastore.com') then
    insert into auth.users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at, aud, role
    ) values (
      rider_id, 'rider@lyrastore.com',
      crypt('rider123', gen_salt('bf')),
      now(), '{"name":"Rider","role":"rider"}'::jsonb,
      now(), now(), 'authenticated', 'authenticated'
    );
    insert into public.users (id, email, name, role)
    values (rider_id, 'rider@lyrastore.com', 'Rider', 'rider');
  end if;

end $$;
