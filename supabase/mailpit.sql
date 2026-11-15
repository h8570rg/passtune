-- 一時的な回避策（config.toml の [auth.hook.send_email] を参照）
create extension if not exists pg_net with schema extensions;
create schema if not exists local_dev;
revoke all on schema local_dev from public;

-- mailpit_url は supabase/mailpit.sh が入れる
create table if not exists local_dev.settings (
  key text primary key,
  value text not null
);

create or replace function local_dev.send_auth_email(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  token text := event -> 'email_data' ->> 'token';
  mailpit_url text := (select value from local_dev.settings where key = 'mailpit_url');
begin
  if mailpit_url is null then
    raise exception 'local_dev.settings に mailpit_url がない（pnpm run supabase:start を実行する）';
  end if;
  perform net.http_post(
    url := mailpit_url || '/api/v1/send',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'From', jsonb_build_object('Email', 'noreply@passtune.local', 'Name', 'Passtune'),
      'To', jsonb_build_array(jsonb_build_object('Email', event -> 'user' ->> 'email')),
      'Subject', 'Passtune の確認コード',
      'Text', format(E'Passtune の確認コード: %s\n\nこのコードの有効期限は 10 分です。', token),
      'HTML', format(
        '<h2>Passtune の確認コード</h2><p>次の 6 桁のコードを、ログイン画面に入力してください。</p>'
        '<p style="font-size: 28px; font-weight: bold; letter-spacing: 6px">%s</p>'
        '<p>このコードの有効期限は 10 分です。</p>',
        token)
    )
  );
  return '{}'::jsonb;
end;
$$;

revoke execute on function local_dev.send_auth_email(jsonb) from authenticated, anon, public;
grant usage on schema local_dev to supabase_auth_admin;
grant execute on function local_dev.send_auth_email(jsonb) to supabase_auth_admin;
