import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { INVITE_COOKIE_NAME } from "@/lib/config";
import { getAuthUser, getProfileByHandle } from "@/lib/data/user";

const INVITE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * 招待リンク。招待した人を Cookie に記録し、その人のプロフィールを見せる。
 * 招待された人がこのあと登録すると、オンボーディングで招待した人を自動でフォローする。
 * 共有する URL には `?openExternalBrowser=1` を付け、LINE のアプリ内ブラウザではなく通常のブラウザで開かせる。
 */
export async function GET(request: Request, { params }: RouteContext<"/i/[handle]">) {
  const { handle } = await params;
  const origin = new URL(request.url).origin;
  const inviter = await getProfileByHandle(decodeURIComponent(handle));
  if (!inviter) return NextResponse.redirect(`${origin}/`);

  const user = await getAuthUser();
  if (!user) {
    const cookieStore = await cookies();
    cookieStore.set(INVITE_COOKIE_NAME, inviter.handle, {
      httpOnly: true,
      sameSite: "lax",
      secure: origin.startsWith("https://"),
      maxAge: INVITE_COOKIE_MAX_AGE,
      path: "/",
    });
    return NextResponse.redirect(`${origin}/u/${inviter.handle}?invited=1`);
  }
  return NextResponse.redirect(`${origin}/u/${inviter.handle}`);
}
