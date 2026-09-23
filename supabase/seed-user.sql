-- Run this in Supabase SQL Editor to create the default admin user
-- Email: admin@otsuka.id
-- Password: Loc?1234

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Cek apakah user dengan email tersebut sudah ada
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@otsuka.id') THEN
    
    -- Insert ke auth.users
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

    -- Insert ke auth.identities
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
    
  END IF;
END $$;
