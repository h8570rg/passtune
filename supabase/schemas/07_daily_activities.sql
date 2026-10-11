-- 計測: 日ごとのアクティブ利用者（日本時間の日付）
create table public.daily_activities (
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_date date not null,
  primary key (user_id, activity_date)
);

alter table public.daily_activities enable row level security;

create policy "users can view their own activities"
  on public.daily_activities for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users can record their own activities"
  on public.daily_activities for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on public.daily_activities from anon, authenticated;
grant select, insert on public.daily_activities to authenticated;

-- 今日の利用を記録する（既にあれば何もしない）
create or replace function public.record_daily_activity()
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.daily_activities (user_id, activity_date)
  select (select auth.uid()), (now() at time zone 'Asia/Tokyo')::date
  where (select auth.uid()) is not null
    and exists (select 1 from public.profiles where id = (select auth.uid()))
  on conflict do nothing;
$$;

revoke all on function public.record_daily_activity() from public;
grant execute on function public.record_daily_activity() to authenticated;
