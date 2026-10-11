-- アイコン画像用の Storage のアクセス制御（ポリシー）。
-- バケット自体はデータのため、マイグレーション（*_avatars_storage.sql）で作る。
-- ポリシーをここにも書いておかないと、宣言的スキーマの同期がポリシーを削除しようとする。

-- 公開バケットのため、画像の取得は公開 URL で行う（select ポリシーは一覧取得用に本人のみ）。
create policy "users can list their own avatars"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users can upload their own avatars"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users can update their own avatars"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users can delete their own avatars"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
