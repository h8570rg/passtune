-- RLS（行レベルセキュリティ）と関数のテスト。`pnpm supabase:test` で実行する。
begin;
create extension if not exists pgtap with schema extensions;
select plan(14);

-- テスト用のユーザー 2 人
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com');

-- alice としてログイン
set local role authenticated;
set local request.jwt.claims to '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select lives_ok(
  $$insert into public.profiles (id, handle, display_name) values ('11111111-1111-1111-1111-111111111111', 'alice', 'Alice')$$,
  '自分のプロフィールは作れる'
);
select throws_ok(
  $$insert into public.profiles (id, handle, display_name) values ('22222222-2222-2222-2222-222222222222', 'bob', 'Bob')$$,
  '42501', null,
  '他人のプロフィールは作れない'
);
select throws_ok(
  $$update public.profiles set handle = 'Alice!' where id = '11111111-1111-1111-1111-111111111111'$$,
  '23514', null,
  'handle の形式は CHECK 制約で守られる'
);

-- bob のプロフィールは管理者権限で作る
reset role;
insert into public.profiles (id, handle, display_name) values ('22222222-2222-2222-2222-222222222222', 'bob', 'Bob');
insert into public.posts (id, user_id, apple_track_id, title, artist_name)
  values ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 1490256995, '夜に駆ける', 'YOASOBI');

set local role authenticated;
set local request.jwt.claims to '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select throws_ok(
  $$insert into public.posts (user_id, apple_track_id, title, artist_name) values ('22222222-2222-2222-2222-222222222222', 1, 't', 'a')$$,
  '42501', null,
  '他人として投稿はできない'
);
select lives_ok(
  $$insert into public.posts (user_id, apple_track_id, title, artist_name, comment) values ('11111111-1111-1111-1111-111111111111', 1, 't', 'a', 'いい曲')$$,
  '自分として投稿できる'
);
select is(
  (select count(*) from public.posts where id = '33333333-3333-3333-3333-333333333333'),
  1::bigint,
  '他人の投稿は読める'
);
delete from public.posts where id = '33333333-3333-3333-3333-333333333333';
reset role;
select is(
  (select count(*) from public.posts where id = '33333333-3333-3333-3333-333333333333'),
  1::bigint,
  '他人の投稿は削除できない'
);

set local role authenticated;
set local request.jwt.claims to '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select throws_ok(
  $$insert into public.follows (follower_id, followee_id) values ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111')$$,
  '23514', null,
  '自分はフォローできない'
);
select lives_ok(
  $$insert into public.follows (follower_id, followee_id) values ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222')$$,
  '他人をフォローできる'
);

-- 再生回数
select lives_ok(
  $$select public.increment_play_count('33333333-3333-3333-3333-333333333333')$$,
  'ログイン中の人は再生回数を増やせる'
);
select is(
  (select count(*) from public.post_play_counts where post_id = '33333333-3333-3333-3333-333333333333'),
  0::bigint,
  '他人の投稿の再生回数は見えない'
);
select throws_ok(
  $$update public.post_play_counts set play_count = 100$$,
  '42501', null,
  '再生回数は直接書き換えられない'
);

-- ログインしていない人
set local role anon;
set local request.jwt.claims to '{"role":"anon"}';
select lives_ok(
  $$select public.increment_play_count('33333333-3333-3333-3333-333333333333')$$,
  'ログインなしでも再生回数を増やせる'
);

-- bob として再生回数を確認
set local role authenticated;
set local request.jwt.claims to '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select is(
  (select play_count from public.post_play_counts where post_id = '33333333-3333-3333-3333-333333333333'),
  2::bigint,
  '投稿者本人は延べ再生回数を見られる'
);

select * from finish();
rollback;
