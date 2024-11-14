INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 10)
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            id,
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

INSERT INTO public.products (
  id,
  active,
  name,
  description,
  image,
  metadata
) VALUES (
    'prod_RAHuqzQ3tK13OV',
    true,
    'Fantasy Pro (Local)',
    'Local product for fantasy pro',
    null,
    format('{}')::jsonb
  );

INSERT INTO public.prices (
  id,
  product_id,
  active,
  description,
  unit_amount,
  currency,
  type,
  interval,
  interval_count,
  trial_period_days,
  metadata
) VALUES (
  'price_1QHxKrCS6xnAdY8yDpZp8wDm',
  'prod_RAHuqzQ3tK13OV',
  true,
  'Annual price',
  4500,
  'cad',
  'recurring',
  'year',
  '1',
  0,
  null
);

INSERT INTO public.subscriptions(
  id,
  user_id,
  status,
  price_id,
  quantity,
  cancel_at_period_end,
  created,
  current_period_start,
  current_period_end
) (
  select
    'sub' || (ROW_NUMBER() OVER()) ,
    id,
    'active',
    'price_1QHxKrCS6xnAdY8yDpZp8wDm',
    1,
    false,
    current_timestamp,
    current_timestamp,
    current_timestamp+'1 year'::interval
  from auth.users
);
