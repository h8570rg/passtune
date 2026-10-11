-- フォロー関係（片方向）
create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  constraint follows_no_self_follow check (follower_id <> followee_id)
);

create index follows_followee_id_idx on public.follows (followee_id);

alter table public.follows enable row level security;

create policy "follows are viewable by everyone"
  on public.follows for select
  to anon, authenticated
  using (true);

create policy "users can follow others"
  on public.follows for insert
  to authenticated
  with check ((select auth.uid()) = follower_id);

create policy "users can unfollow"
  on public.follows for delete
  to authenticated
  using ((select auth.uid()) = follower_id);

revoke all on public.follows from anon, authenticated;
grant select on public.follows to anon, authenticated;
grant insert, delete on public.follows to authenticated;
