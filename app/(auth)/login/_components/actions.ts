"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils/redirect";
import { getURL } from "@/lib/utils/url";
import { sendOtpSchema, verifyOtpSchema } from "./schema";

function callbackUrl(next: string | null): string {
  const url = new URL("auth/callback", getURL());
  url.searchParams.set("next", safeNextPath(next));
  return url.toString();
}

/**
 * メールに 6 桁の確認コードを送る。未登録のメールアドレスなら、ここでアカウントが作られる。
 * @see https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp
 */
export async function sendOtp(_prevState: unknown, formData: FormData) {
  const next = formData.get("next");
  const submission = parseSubmission(formData);
  const result = sendOtpSchema.safeParse(submission.payload);
  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
      sentEmail: null,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.email,
    options: {
      shouldCreateUser: true,
      // メールのリンクを同じブラウザで開いた場合もログインできるようにする（PKCE）
      emailRedirectTo: callbackUrl(typeof next === "string" ? next : null),
    },
  });
  if (error) {
    return {
      result: report(submission, {
        error: {
          formErrors: [
            error.status === 429
              ? "確認コードの送信回数が多すぎます。しばらく待ってから試してください。"
              : "確認コードを送れませんでした。時間をおいて試してください。",
          ],
        },
      }),
      sentEmail: null,
    };
  }
  return { result: report(submission), sentEmail: result.data.email, sentAt: Date.now() };
}

/** 確認コードを検証してログインする */
export async function verifyOtp(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = verifyOtpSchema.safeParse(submission.payload);
  if (!result.success) {
    return report(submission, { error: { issues: result.error.issues } });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: result.data.email,
    token: result.data.token,
    type: "email",
  });
  if (error) {
    return report(submission, {
      error: { fieldErrors: { token: ["確認コードが正しくないか、期限が切れています"] } },
    });
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(result.data.next));
}

/**
 * Google でログインする（PKCE）。
 * @see https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
 */
export async function signInWithGoogle(next: string | null) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(next) },
  });
  if (error || !data.url) {
    return { error: "Google でのログインを開始できませんでした" };
  }
  redirect(data.url);
}
