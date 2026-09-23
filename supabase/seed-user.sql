-- Run this in Supabase SQL Editor to FRESH SEED the default admin user
-- This script will delete the existing user (if any) and create a fresh one.
-- Email: admin@otsuka.id
-- Password: Loc?1234

DO $$
DECLARE
  target_user_id uuid;
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- 1. Hapus user lama jika ada
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'admin@otsuka.id';
  
  IF target_user_id IS NOT NULL THEN
    DELETE FROM auth.identities WHERE user_id = target_user_id;
    DELETE FROM auth.users WHERE id = target_user_id;
  END IF;

  -- 2. Buat user baru
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'admin@otsuka.id',
    crypt('Loc?1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now()
  );

  -- 3. Buat identity baru
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    new_user_id::text,
    jsonb_build_object('sub', new_user_id::text, 'email', 'admin@otsuka.id'),
    'email',
    now(),
    now()
  );
END $$;
