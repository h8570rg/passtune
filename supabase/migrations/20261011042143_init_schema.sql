SET local check_function_bodies = off;

CREATE TABLE "public"."comments" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "post_id"    uuid                     NOT NULL,
  "user_id"    uuid                     NOT NULL,
  "body"       text                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "comments_body_length" CHECK (((char_length(btrim(body)) >= 1) AND (char_length(btrim(body)) <= 200))),
  CONSTRAINT "comments_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."comments"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."daily_activities" (
  "user_id"       uuid NOT NULL,
  "activity_date" date NOT NULL,
  CONSTRAINT "daily_activities_pkey" PRIMARY KEY (user_id, activity_date)
);

ALTER TABLE "public"."daily_activities"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."daily_activities" FROM "anon";

CREATE TABLE "public"."follows" (
  "follower_id" uuid                     NOT NULL,
  "followee_id" uuid                     NOT NULL,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "follows_no_self_follow" CHECK ((follower_id <> followee_id)),
  CONSTRAINT "follows_pkey" PRIMARY KEY (follower_id, followee_id)
);

ALTER TABLE "public"."follows"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."likes" (
  "user_id"    uuid                     NOT NULL,
  "post_id"    uuid                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "likes_pkey" PRIMARY KEY (user_id, post_id)
);

ALTER TABLE "public"."likes"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."post_play_counts" (
  "post_id"    uuid                     NOT NULL,
  "play_count" bigint                   NOT NULL DEFAULT 0,
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "post_play_counts_non_negative" CHECK ((play_count >= 0)),
  CONSTRAINT "post_play_counts_pkey" PRIMARY KEY (post_id)
);

ALTER TABLE "public"."post_play_counts"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."post_play_counts" FROM "anon";

CREATE TABLE "public"."posts" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"        uuid                     NOT NULL,
  "apple_track_id" bigint                   NOT NULL,
  "title"          text                     NOT NULL,
  "artist_name"    text                     NOT NULL,
  "album_name"     text,
  "artwork_url"    text,
  "duration_ms"    integer,
  "comment"        text                     NOT NULL DEFAULT ''::text,
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "posts_comment_length" CHECK ((char_length(comment) <= 140)),
  CONSTRAINT "posts_duration_ms_positive" CHECK (((duration_ms IS NULL) OR (duration_ms >= 0))),
  CONSTRAINT "posts_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."posts"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"           uuid                     NOT NULL,
  "handle"       text                     NOT NULL,
  "display_name" text                     NOT NULL,
  "avatar_path"  text,
  "invited_by"   uuid,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "profiles_display_name_length" CHECK (((char_length(btrim(display_name)) >= 1) AND (char_length(btrim(display_name)) <= 30))),
  CONSTRAINT "profiles_handle_format" CHECK ((handle ~ '^[a-z0-9_]{3,20}$'::text)),
  CONSTRAINT "profiles_handle_key" UNIQUE (handle),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.increment_play_count (
  p_post_id uuid
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.record_daily_activity()
  RETURNS void
  LANGUAGE sql
  SET search_path TO ''
  AS $function$
  insert into public.daily_activities (user_id, activity_date)
  select (select auth.uid()), (now() at time zone 'Asia/Tokyo')::date
  where (select auth.uid()) is not null
    and exists (select 1 from public.profiles where id = (select auth.uid()))
  on conflict do nothing;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

ALTER TABLE "public"."comments"
  ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE "public"."likes"
  ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE "public"."post_play_counts"
  ADD CONSTRAINT "post_play_counts_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."comments"
  ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."daily_activities"
  ADD CONSTRAINT "daily_activities_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."follows"
  ADD CONSTRAINT "follows_followee_id_fkey" FOREIGN KEY (followee_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."follows"
  ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."likes"
  ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."posts"
  ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX comments_post_id_created_at_idx ON public.comments USING btree (post_id, created_at);

CREATE INDEX comments_user_id_idx ON public.comments USING btree (user_id);

CREATE INDEX follows_followee_id_idx ON public.follows USING btree (followee_id);

CREATE INDEX likes_post_id_idx ON public.likes USING btree (post_id);

CREATE INDEX posts_created_at_idx ON public.posts USING btree (created_at DESC);

CREATE INDEX posts_user_id_created_at_idx ON public.posts USING btree (user_id, created_at DESC);

CREATE INDEX profiles_invited_by_idx ON public.profiles USING btree (invited_by);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "comments are viewable by everyone" ON "public"."comments"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "users can create their own comments" ON "public"."comments"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "users can delete their own comments" ON "public"."comments"
  FOR DELETE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "users can record their own activities" ON "public"."daily_activities"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "users can view their own activities" ON "public"."daily_activities"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "follows are viewable by everyone" ON "public"."follows"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "users can follow others" ON "public"."follows"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = follower_id));

CREATE POLICY "users can unfollow" ON "public"."follows"
  FOR DELETE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = follower_id));

CREATE POLICY "likes are viewable by everyone" ON "public"."likes"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "users can like posts" ON "public"."likes"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "users can remove their likes" ON "public"."likes"
  FOR DELETE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "post owners can view play counts" ON "public"."post_play_counts"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.posts
  WHERE ((posts.id = post_play_counts.post_id) AND (posts.user_id = ( SELECT auth.uid() AS uid))))));

CREATE POLICY "posts are viewable by everyone" ON "public"."posts"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "users can create their own posts" ON "public"."posts"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "users can delete their own posts" ON "public"."posts"
  FOR DELETE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "profiles are viewable by everyone" ON "public"."profiles"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "users can create their own profile" ON "public"."profiles"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "users can update their own profile" ON "public"."profiles"
  FOR UPDATE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = id));

REVOKE ALL ON FUNCTION "public"."increment_play_count"(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."increment_play_count"(uuid) TO "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."increment_play_count"(uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."increment_play_count"(uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."increment_play_count"(uuid) TO "service_role";

REVOKE ALL ON FUNCTION "public"."record_daily_activity"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."record_daily_activity"() TO "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."record_daily_activity"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."record_daily_activity"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."record_daily_activity"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."set_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "service_role";

REVOKE ALL ON TABLE "public"."comments" FROM "anon";

GRANT SELECT ON TABLE "public"."comments" TO "anon";

REVOKE ALL ON TABLE "public"."comments" FROM "authenticated";

GRANT DELETE, INSERT, SELECT ON TABLE "public"."comments" TO "authenticated";

REVOKE ALL ON TABLE "public"."comments" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."comments" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."comments" TO "service_role";

REVOKE ALL ON TABLE "public"."daily_activities" FROM "authenticated";

GRANT INSERT, SELECT ON TABLE "public"."daily_activities" TO "authenticated";

REVOKE ALL ON TABLE "public"."daily_activities" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."daily_activities" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."daily_activities" TO "service_role";

REVOKE ALL ON TABLE "public"."follows" FROM "anon";

GRANT SELECT ON TABLE "public"."follows" TO "anon";

REVOKE ALL ON TABLE "public"."follows" FROM "authenticated";

GRANT DELETE, INSERT, SELECT ON TABLE "public"."follows" TO "authenticated";

REVOKE ALL ON TABLE "public"."follows" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."follows" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."follows" TO "service_role";

REVOKE ALL ON TABLE "public"."likes" FROM "anon";

GRANT SELECT ON TABLE "public"."likes" TO "anon";

REVOKE ALL ON TABLE "public"."likes" FROM "authenticated";

GRANT DELETE, INSERT, SELECT ON TABLE "public"."likes" TO "authenticated";

REVOKE ALL ON TABLE "public"."likes" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."likes" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."likes" TO "service_role";

REVOKE ALL ON TABLE "public"."post_play_counts" FROM "authenticated";

GRANT SELECT ON TABLE "public"."post_play_counts" TO "authenticated";

REVOKE ALL ON TABLE "public"."post_play_counts" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."post_play_counts" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."post_play_counts" TO "service_role";

REVOKE ALL ON TABLE "public"."posts" FROM "anon";

GRANT SELECT ON TABLE "public"."posts" TO "anon";

REVOKE ALL ON TABLE "public"."posts" FROM "authenticated";

GRANT DELETE, INSERT, SELECT ON TABLE "public"."posts" TO "authenticated";

REVOKE ALL ON TABLE "public"."posts" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."posts" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."posts" TO "service_role";

REVOKE ALL ON TABLE "public"."profiles" FROM "anon";

GRANT SELECT ON TABLE "public"."profiles" TO "anon";

REVOKE ALL ON TABLE "public"."profiles" FROM "authenticated";

GRANT INSERT, SELECT, UPDATE ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";
