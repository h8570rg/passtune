"use client";

import { cn, Spinner } from "@heroui/react";
import { PauseIcon, PlayIcon } from "lucide-react";
import { usePlayer } from "@/components/player-provider";

type PlayButtonProps = {
  playKey: string;
  appleTrackId: number;
  previewUrl?: string | null;
  postId?: string;
  label: string;
  className?: string;
};

/** 試聴の再生・一時停止ボタン（進み具合を円で表示） */
export function PlayButton({
  playKey,
  appleTrackId,
  previewUrl,
  postId,
  label,
  className,
}: PlayButtonProps) {
  const player = usePlayer();
  const isCurrent = player.currentKey === playKey;
  const isPlaying = isCurrent && player.status === "playing";
  const isLoading = isCurrent && player.status === "loading";
  const progress = isCurrent ? player.progress : 0;

  return (
    <button
      type="button"
      aria-label={isPlaying ? `${label} の試聴を一時停止` : `${label} を試聴する`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        player.toggle({ key: playKey, appleTrackId, previewUrl, postId });
      }}
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground",
        className,
      )}
    >
      <svg
        viewBox="0 0 44 44"
        className="pointer-events-none absolute inset-0 -rotate-90"
        aria-hidden
      >
        <circle
          cx="22"
          cy="22"
          r="20.5"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={3}
        />
        <circle
          cx="22"
          cy="22"
          r="20.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeDasharray={2 * Math.PI * 20.5}
          strokeDashoffset={2 * Math.PI * 20.5 * (1 - progress)}
          strokeLinecap="round"
        />
      </svg>
      {isLoading ? (
        <Spinner size="sm" color="current" />
      ) : isPlaying ? (
        <PauseIcon className="size-5 fill-current" />
      ) : (
        <PlayIcon className="ml-0.5 size-5 fill-current" />
      )}
    </button>
  );
}
