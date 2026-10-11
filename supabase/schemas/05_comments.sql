-- コメント（返信なし）
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null
    constraint comments_body_length check (char_length(btrim(body)) between 1 and 200),
  created_at timestamptz not null default now()
);

create index comments_post_id_created_at_idx on public.comments (post_id, created_at);
create index comments_user_id_idx on public.comments (user_id);

alter table public.comments enable row level security;

create policy "comments are viewable by everyone"
  on public.comments for select
  to anon, authenticated
  using (true);

create policy "users can create their own comments"
  on public.comments for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users can delete their own comments"
  on public.comments for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.comments from anon, authenticated;
grant select on public.comments to anon, authenticated;
grant insert, delete on public.comments to authenticated;
