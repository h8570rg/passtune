-- 延べ再生回数。投稿者だけが読める（列単位では RLS をかけられないため posts から分ける）。
create table public.post_play_counts (
  post_id uuid primary key references public.posts (id) on delete cascade,
  play_count bigint not null default 0
    constraint post_play_counts_non_negative check (play_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.post_play_counts enable row level security;

create policy "post owners can view play counts"
  on public.post_play_counts for select
  to authenticated
  using (
    exists (
      select 1
      from public.posts
      where posts.id = post_play_counts.post_id
        and posts.user_id = (select auth.uid())
    )
  );

revoke all on public.post_play_counts from anon, authenticated;
grant select on public.post_play_counts to authenticated;

-- 再生回数を 1 増やす。ログインなしの閲覧者の再生も数えるため SECURITY DEFINER で anon からも呼べるようにする。
create or replace function public.increment_play_count(p_post_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.posts where id = p_post_id) then
    return;
  end if;

  insert into public.post_play_counts (post_id, play_count, updated_at)
  values (p_post_id, 1, now())
  on conflict (post_id)
  do update set
    play_count = public.post_play_counts.play_count + 1,
    updated_at = now();
end;
$$;

revoke all on function public.increment_play_count(uuid) from public;
grant execute on function public.increment_play_count(uuid) to anon, authenticated;
