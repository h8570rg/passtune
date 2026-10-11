"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser, getMyProfile } from "@/lib/data/user";
import { lookupTracks } from "@/lib/music/itunes";
import { createPostSchema } from "@/lib/schemas/post";
import { createClient } from "@/lib/supabase/server";

/**
 * 投稿を作る。曲の情報はブラウザから送られた値を信用せず、サーバーで iTunes Lookup API から取り直す。
 */
export async function createPost(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = createPostSchema.safeParse(submission.payload);
  if (!result.success) {
    return report(submission, { error: { issues: result.error.issues } });
  }
  const user = await getAuthUser();
  if (!user || !(await getMyProfile())) redirect("/login?next=/new");

  let track;
  try {
    track = (await lookupTracks([result.data.appleTrackId], { cache: "no-store" })).get(
      result.data.appleTrackId,
    );
  } catch {
    return report(submission, {
      error: { formErrors: ["曲の情報を取得できませんでした。時間をおいて試してください。"] },
    });
  }
  if (!track) {
    return report(submission, { error: { formErrors: ["この曲は投稿できません"] } });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      apple_track_id: track.trackId,
      title: track.title,
      artist_name: track.artistName,
      album_name: track.albumName,
      artwork_url: track.artworkUrl,
      duration_ms: track.durationMs,
      comment: result.data.comment,
    })
    .select("id")
    .single();
  if (error) {
    return report(submission, { error: { formErrors: ["投稿できませんでした"] } });
  }

  revalidatePath("/", "layout");
  redirect(`/posts/${data.id}`);
}

/** 自分の投稿を削除する（他人の投稿は RLS で削除できない） */
export async function deletePost(postId: string, redirectTo?: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) return { error: "削除できませんでした" };
  revalidatePath("/", "layout");
  if (redirectTo) redirect(redirectTo);
  return { error: null };
}
