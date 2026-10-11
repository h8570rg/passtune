"use client";

import { cn, toast } from "@heroui/react";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { setLiked } from "@/lib/actions/social";

/** いいねボタン（押したらすぐ反映し、失敗したら戻す）。未ログインならログインへ。 */
export function LikeButton({
  postId,
  liked,
  count,
  isLoggedIn,
}: {
  postId: string;
  liked: boolean;
  count: number;
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const [state, setOptimistic] = useOptimistic({ liked, count });
  const [, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="inline-flex items-center gap-1 hover:text-foreground"
        aria-label="ログインしていいねする"
      >
        <HeartIcon className="size-4" />
        {count}
      </Link>
    );
  }

  const toggle = () => {
    const next = !state.liked;
    startTransition(async () => {
      setOptimistic({ liked: next, count: state.count + (next ? 1 : -1) });
      const result = await setLiked(postId, next);
      if (result.error) toast.danger(result.error);
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={state.liked}
      aria-label={state.liked ? "いいねを取り消す" : "いいねする"}
      className={cn(
        "inline-flex items-center gap-1 hover:text-foreground",
        state.liked && "text-danger",
      )}
    >
      <HeartIcon className={cn("size-4", state.liked && "fill-current")} />
      {state.count}
    </button>
  );
}
