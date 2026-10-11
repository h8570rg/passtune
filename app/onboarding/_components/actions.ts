"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { INVITE_COOKIE_NAME } from "@/lib/config";
import { isOwnAvatarPath, removeUnusedAvatars } from "@/lib/data/profile-mutations";
import { getAuthUser } from "@/lib/data/user";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/utils/uuid";
import { profileSchema } from "./schema";

const HANDLE_TAKEN_MESSAGE = "このユーザー ID はすでに使われています";

/** 初回ログイン後にプロフィールを作る。招待リンクから来た場合は、招待した人を自動でフォローする。 */
export async function createProfile(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = profileSchema.safeParse(submission.payload);
  if (!result.success) {
    return report(submission, { error: { issues: result.error.issues } });
  }

  const user = await getAuthUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const cookieStore = await cookies();
  // 招待リンクで記録した、招待した人の UUID（ユーザー ID は変わりうるので UUID で持つ）
  const invitedBy = cookieStore.get(INVITE_COOKIE_NAME)?.value;

  let inviterId: string | null = null;
  if (isUuid(invitedBy) && invitedBy !== user.id) {
    const { data: inviter } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", invitedBy)
      .maybeSingle();
    inviterId = inviter?.id ?? null;
  }

  const avatarPath = isOwnAvatarPath(user.id, result.data.avatarPath)
    ? result.data.avatarPath
    : null;
  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    handle: result.data.handle,
    display_name: result.data.displayName,
    avatar_path: avatarPath,
    invited_by: inviterId,
  });
  if (error) {
    if (error.code === "23505") {
      return report(submission, { error: { fieldErrors: { handle: [HANDLE_TAKEN_MESSAGE] } } });
    }
    return report(submission, { error: { formErrors: ["プロフィールを保存できませんでした"] } });
  }

  if (inviterId) {
    await supabase.from("follows").insert({ follower_id: user.id, followee_id: inviterId });
  }
  cookieStore.delete(INVITE_COOKIE_NAME);
  await removeUnusedAvatars(supabase, user.id, avatarPath);

  revalidatePath("/", "layout");
  redirect("/");
}
