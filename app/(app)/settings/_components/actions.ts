"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { profileSchema } from "@/app/onboarding/_components/schema";
import { isOwnAvatarPath, removeUnusedAvatars } from "@/lib/data/profile-mutations";
import { getAuthUser } from "@/lib/data/user";
import { createClient } from "@/lib/supabase/server";

/** プロフィールを更新する */
export async function updateProfile(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = profileSchema.safeParse(submission.payload);
  if (!result.success) {
    return report(submission, { error: { issues: result.error.issues } });
  }
  const user = await getAuthUser();
  if (!user) redirect("/login?next=/settings");

  const supabase = await createClient();
  const avatarPath = isOwnAvatarPath(user.id, result.data.avatarPath)
    ? result.data.avatarPath
    : null;
  const { error } = await supabase
    .from("profiles")
    .update({
      handle: result.data.handle,
      display_name: result.data.displayName,
      avatar_path: avatarPath,
    })
    .eq("id", user.id);
  if (error) {
    if (error.code === "23505") {
      return report(submission, {
        error: { fieldErrors: { handle: ["このユーザー ID はすでに使われています"] } },
      });
    }
    return report(submission, { error: { formErrors: ["プロフィールを保存できませんでした"] } });
  }
  await removeUnusedAvatars(supabase, user.id, avatarPath);

  revalidatePath("/", "layout");
  redirect(`/u/${result.data.handle}`);
}

/** ログアウトする */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
