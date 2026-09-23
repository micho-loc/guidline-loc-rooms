-- Run this in Supabase SQL Editor to FRESH SEED the default admin user
-- This script will delete the existing user (if any) and create a fresh one.
-- Email: admin@otsuka.id
-- Password: Loc?1234

-- Pastikan ekstensi pgcrypto aktif
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  target_user_id uuid;
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- 1. Hapus user lama jika ada (beserta relasinya)
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'admin@otsuka.id';
  
  IF target_user_id IS NOT NULL THEN
    DELETE FROM auth.sessions WHERE user_id = target_user_id;
    DELETE FROM auth.refresh_tokens WHERE user_id = target_user_id::text;
    DELETE FROM auth.identities WHERE user_id = target_user_id;
    DELETE FROM auth.users WHERE id = target_user_id;
  END IF;

  -- 2. Buat user baru dengan enkripsi yang benar
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
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
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
    now(),
    '',
    '',
    '',
    ''
  );

  -- 3. Buat identity baru
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    new_user_id::text,
    format('{"sub":"%s","email":"%s"}', new_user_id::text, 'admin@otsuka.id')::jsonb,
    'email',
    now(),
    now(),
    now()
  );
END $$;
