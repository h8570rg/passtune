import { PlayButton } from "@/components/play-button";

type TrackBlockProps = {
  playKey: string;
  postId?: string;
  appleTrackId: number;
  title: string;
  artistName: string;
  artworkUrl: string | null;
  previewUrl?: string | null;
};

/**
 * 曲の表示（ジャケット・曲名・アーティスト・試聴ボタン）。
 * Apple の利用条件に従い、試聴の近くに Apple Music へのリンクと「provided courtesy of iTunes」を表示する。
 */
export function TrackBlock({
  playKey,
  postId,
  appleTrackId,
  title,
  artistName,
  artworkUrl,
  previewUrl,
}: TrackBlockProps) {
  return (
    <div className="rounded-2xl bg-default/60 p-3">
      <div className="flex items-center gap-3">
        {artworkUrl ? (
          // ジャケット画像は Apple から直接配信する（保存しない）
          // oxlint-disable-next-line nextjs/no-img-element -- 外部の画像を最適化せずそのまま表示する
          <img
            src={artworkUrl}
            alt=""
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="size-16 shrink-0 rounded-lg bg-default" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{title}</p>
          <p className="truncate text-sm text-muted">{artistName}</p>
        </div>
        <PlayButton
          playKey={playKey}
          postId={postId}
          appleTrackId={appleTrackId}
          previewUrl={previewUrl}
          label={title}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
        <a
          href={`https://music.apple.com/jp/song/${appleTrackId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline-offset-2 hover:underline"
        >
          Listen on Apple Music
        </a>
        <span>provided courtesy of iTunes</span>
      </div>
    </div>
  );
}
