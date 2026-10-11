-- 投稿（1 曲＋一言）。曲の情報はすべて Apple（iTunes Search API）由来。試聴音源と画像そのものは保存しない。
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  apple_track_id bigint not null,
  title text not null,
  artist_name text not null,
  album_name text,
  artwork_url text,
  duration_ms integer
    constraint posts_duration_ms_positive check (duration_ms is null or duration_ms >= 0),
  comment text not null default ''
    constraint posts_comment_length check (char_length(comment) <= 140),
  created_at timestamptz not null default now()
);

create index posts_user_id_created_at_idx on public.posts (user_id, created_at desc);
create index posts_created_at_idx on public.posts (created_at desc);

alter table public.posts enable row level security;

create policy "posts are viewable by everyone"
  on public.posts for select
  to anon, authenticated
  using (true);

create policy "users can create their own posts"
  on public.posts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users can delete their own posts"
  on public.posts for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert, delete on public.posts to authenticated;
