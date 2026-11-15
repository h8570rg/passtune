#!/bin/sh
# 一時的な回避策（config.toml の [auth.hook.send_email] を参照）
set -e

. ./.env.local

supabase db query "insert into local_dev.settings values ('mailpit_url', '$MAILPIT_URL')
  on conflict (key) do update set value = excluded.value" > /dev/null
