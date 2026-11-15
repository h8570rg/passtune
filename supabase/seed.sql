-- 手元の開発用のサンプルデータ（pnpm supabase:reset で投入される。本番には入らない）
-- 自分のメールアドレスでログインし、@demo_alice をフォローすると、タイムラインにサンプルの投稿が流れる。

insert into auth.users (id, instance_id, aud, role, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('a1111111-1111-4111-8111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@example.com', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('b2222222-2222-4222-8222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bob@example.com', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());

insert into public.profiles (id, handle, display_name) values
  ('a1111111-1111-4111-8111-111111111111', 'demo_alice', 'アリス'),
  ('b2222222-2222-4222-8222-222222222222', 'demo_bob', 'ボブ');

insert into public.follows (follower_id, followee_id) values
  ('a1111111-1111-4111-8111-111111111111', 'b2222222-2222-4222-8222-222222222222'),
  ('b2222222-2222-4222-8222-222222222222', 'a1111111-1111-4111-8111-111111111111');

insert into public.posts (id, user_id, apple_track_id, title, artist_name, album_name, artwork_url, duration_ms, comment, created_at) values
  ('c0000000-0000-4000-8000-000000000001', 'a1111111-1111-4111-8111-111111111111', 1490256995, '夜に駆ける', 'YOASOBI', '夜に駆ける - Single',
   'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/fe/58/79/fe58795c-1628-230a-9ffe-300c04b6627c/194491717186.jpg/300x300bb.jpg', 261013,
   '何回聴いてもイントロで上がる', now() - interval '3 hours'),
  ('c0000000-0000-4000-8000-000000000002', 'b2222222-2222-4222-8222-222222222222', 1479397873, 'Pretender', 'Official髭男dism', 'Traveler',
   'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/9c/7d/88/9c7d883d-4477-bf68-f56f-a726030a63a2/PCCA_04822.jpg/300x300bb.jpg', 326843,
   'サビのファルセットが最高', now() - interval '1 day'),
  ('c0000000-0000-4000-8000-000000000003', 'a1111111-1111-4111-8111-111111111111', 1402042897, 'マリーゴールド', 'あいみょん', 'マリーゴールド - Single',
   'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/67/34/90/67349087-0609-2be4-4963-fd4682ae8c46/190295600341.jpg/300x300bb.jpg', 308107,
   '', now() - interval '3 days'),
  ('c0000000-0000-4000-8000-000000000004', 'b2222222-2222-4222-8222-222222222222', 1679278167, 'アイドル', 'YOASOBI', 'アイドル - Single',
   'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/17/eb/3a17eb30-eacb-82eb-51df-d1321dbb55bc/197188492205.jpg/300x300bb.jpg', 213234,
   'ライブで聴きたい', now() - interval '6 days');

insert into public.likes (user_id, post_id) values
  ('b2222222-2222-4222-8222-222222222222', 'c0000000-0000-4000-8000-000000000001'),
  ('a1111111-1111-4111-8111-111111111111', 'c0000000-0000-4000-8000-000000000002');

insert into public.comments (post_id, user_id, body) values
  ('c0000000-0000-4000-8000-000000000001', 'b2222222-2222-4222-8222-222222222222', 'わかる、朝に聴きたくなる');

insert into public.post_play_counts (post_id, play_count) values
  ('c0000000-0000-4000-8000-000000000001', 5),
  ('c0000000-0000-4000-8000-000000000002', 2);
