import { NextResponse } from "next/server";
import { getPost } from "@/lib/data/post";
import { spotifySearchUrl } from "@/lib/music/service-links";
import { findSpotifyTrackId } from "@/lib/music/spotify";

/**
 * 「Spotify で開く」の転送。押された時点で Spotify を検索し、見つかれば曲ページへ、
 * 見つからない・Spotify の認証情報が未設定なら Spotify の検索結果へ転送する。
 */
export async function GET(_request: Request, { params }: RouteContext<"/go/spotify/[postId]">) {
  const { postId } = await params;
  const post = await getPost(postId);
  if (!post) return new NextResponse("Not Found", { status: 404 });

  const { title, artistName, durationMs } = post.track;
  try {
    const trackId = await findSpotifyTrackId({ title, artistName, durationMs });
    if (trackId) return NextResponse.redirect(`https://open.spotify.com/track/${trackId}`, 302);
  } catch {
    // 検索に失敗しても、検索結果への転送で代える
  }
  return NextResponse.redirect(spotifySearchUrl(title, artistName), 302);
}
