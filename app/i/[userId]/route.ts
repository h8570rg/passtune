import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { INVITE_COOKIE_NAME } from "@/lib/config";
import { getAuthUser, getProfileById } from "@/lib/data/user";
import { isUuid } from "@/lib/utils/uuid";

const INVITE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * 招待リンク（`/i/<利用者の UUID>`）。招待した人を Cookie に記録し、その人のプロフィールを見せる。
 * 招待された人がこのあと登録すると、オンボーディングで招待した人を自動でフォローする。
 * ユーザー ID（handle）は変更できるため、リンクと Cookie には変わらない UUID を使う。ID を変えても古い招待リンクが使える。
 * 共有する URL には `?openExternalBrowser=1` を付け、LINE のアプリ内ブラウザではなく通常のブラウザで開かせる。
 */
export async function GET(request: Request, { params }: RouteContext<"/i/[userId]">) {
  const { userId } = await params;
  const origin = new URL(request.url).origin;
  const inviter = isUuid(userId) ? await getProfileById(userId) : null;
  if (!inviter) return NextResponse.redirect(`${origin}/`);

  const user = await getAuthUser();
  if (!user) {
    const cookieStore = await cookies();
    cookieStore.set(INVITE_COOKIE_NAME, inviter.id, {
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
