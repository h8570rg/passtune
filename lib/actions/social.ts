"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/data/user";
import { createCommentSchema } from "@/lib/schemas/post";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string | null };

async function requireUserId(): Promise<string | null> {
  const user = await getAuthUser();
  return user?.id ?? null;
}

/** フォローする / やめる */
export async function setFollowing(followeeId: string, follow: boolean): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { error: "ログインしてください" };
  if (userId === followeeId) return { error: "自分はフォローできません" };
  const supabase = await createClient();
  const { error } = follow
    ? await supabase
        .from("follows")
        .upsert(
          { follower_id: userId, followee_id: followeeId },
          { onConflict: "follower_id,followee_id", ignoreDuplicates: true },
        )
    : await supabase
        .from("follows")
        .delete()
        .eq("follower_id", userId)
        .eq("followee_id", followeeId);
  if (error) return { error: "フォローの状態を変えられませんでした" };
  revalidatePath("/", "layout");
  return { error: null };
}

/** いいねする / 取り消す */
export async function setLiked(postId: string, like: boolean): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { error: "ログインしてください" };
  const supabase = await createClient();
  const { error } = like
    ? await supabase
        .from("likes")
        .upsert(
          { user_id: userId, post_id: postId },
          { onConflict: "user_id,post_id", ignoreDuplicates: true },
        )
    : await supabase.from("likes").delete().eq("user_id", userId).eq("post_id", postId);
  if (error) return { error: "いいねできませんでした" };
  revalidatePath("/", "layout");
  return { error: null };
}

/** コメントする */
export async function createComment(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = createCommentSchema.safeParse(submission.payload);
  if (!result.success) {
    return report(submission, { error: { issues: result.error.issues } });
  }
  const userId = await requireUserId();
  if (!userId) return report(submission, { error: { formErrors: ["ログインしてください"] } });
  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .insert({ post_id: result.data.postId, user_id: userId, body: result.data.body });
  if (error) return report(submission, { error: { formErrors: ["コメントできませんでした"] } });
  revalidatePath(`/posts/${result.data.postId}`);
  return report(submission, { reset: true });
}

/** 自分のコメントを削除する */
export async function deleteComment(commentId: string, postId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) return { error: "削除できませんでした" };
  revalidatePath(`/posts/${postId}`);
  return { error: null };
}
