# Admin（運用の手順）

- Phase: 11
- Last updated: 2026-10-11
- 根拠: [mvp](../product/mvp.md)（管理者による削除手段・計測）、[database](database.md)

管理画面は作らない。Supabase の管理画面（Studio）の SQL Editor で、service role（RLS を通らない）として操作する。手元では http://127.0.0.1:54423 。

## 不適切な投稿・コメント・ユーザーの削除

```sql
-- 投稿を削除（いいね・コメント・再生回数も連鎖して消える）
delete from public.posts where id = '<投稿 ID>';

-- コメントを削除
delete from public.comments where id = '<コメント ID>';

-- ユーザーを削除（auth.users から消すと、プロフィール・投稿・フォローなどが連鎖して消える）
-- アイコン画像は Storage の avatars/<ユーザー ID>/ を管理画面から削除する
delete from auth.users where id = '<ユーザー ID>';
```

- 投稿 ID は URL（`/posts/<投稿 ID>`）から分かる。ユーザー ID は `select id from public.profiles where handle = '<ID>';` で調べる。
- 問い合わせ先は `contact@passtune.com`。利用規約とプライバシーポリシーに載せている（`lib/config.ts` の `CONTACT_EMAIL`）。Cloudflare の Email Routing で開発者の普段のアドレスに転送する。返信は普段のアドレスから送る。

## 計測（公開後に確かめること）

[mvp](../product/mvp.md) の「確かめたいこと」を見るための SQL。

```sql
-- 登録者数（プロフィールを作った人）と、招待経由の人数
select count(*) as profiles, count(invited_by) as invited from public.profiles;

-- 週ごとの投稿数
select date_trunc('week', created_at at time zone 'Asia/Tokyo') as week, count(*) as posts
from public.posts group by 1 order by 1 desc;

-- 投稿あたりの延べ再生回数（平均・合計）
select count(p.id) as posts, coalesce(sum(c.play_count), 0) as plays,
       round(coalesce(avg(c.play_count), 0), 1) as avg_plays_per_post
from public.posts p left join public.post_play_counts c on c.post_id = p.id;

-- 週ごとのいいね・コメント数
select date_trunc('week', created_at at time zone 'Asia/Tokyo') as week, 'likes' as kind, count(*)
from public.likes group by 1
union all
select date_trunc('week', created_at at time zone 'Asia/Tokyo'), 'comments', count(*)
from public.comments group by 1
order by 1 desc, 2;

-- 週に 1 回以上開いた人の数（直近 8 週）
select date_trunc('week', activity_date) as week, count(distinct user_id) as weekly_active_users
from public.daily_activities
where activity_date >= current_date - interval '8 weeks'
group by 1 order by 1 desc;

-- 成功基準: 直近 7 日間に投稿または試聴（＝アプリを開いた）した人の数
select count(distinct user_id) from public.daily_activities
where activity_date >= (now() at time zone 'Asia/Tokyo')::date - 6;
```

- 「試聴した人」は個人を記録していない（再生回数は投稿ごとの合計のみ）。成功基準の判定は「アプリを開いた人（daily_activities）」で代用する。

## バックアップ

- GitHub Actions の「本番 DB のバックアップ」（`.github/workflows/backup-production.yml`）が、週 1 回スキーマ・データ・ロールを書き出し、Artifacts に 90 日保存する。
- 復元するときは、Artifacts の `schema.sql` → `data.sql` の順に、新しいプロジェクトの SQL Editor か `psql` で流す。

## Supabase の停止防止

- 無料プランは 1 週間アクセスがないと停止する。GitHub Actions の「Supabase の停止防止」が毎日 1 回アクセスする（jankiroku と同じ方法）。
