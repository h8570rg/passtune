-- いいね
create table public.likes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create index likes_post_id_idx on public.likes (post_id);

alter table public.likes enable row level security;

create policy "likes are viewable by everyone"
  on public.likes for select
  to anon, authenticated
  using (true);

create policy "users can like posts"
  on public.likes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users can remove their likes"
  on public.likes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.likes from anon, authenticated;
grant select on public.likes to anon, authenticated;
grant insert, delete on public.likes to authenticated;
