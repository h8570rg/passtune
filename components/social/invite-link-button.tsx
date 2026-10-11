"use client";

import { toast } from "@heroui/react";
import { LinkIcon } from "lucide-react";
import { Button } from "@/components/button";

/**
 * 自分の招待リンクをコピーする。LINE で送られる前提で、外部ブラウザで開く指定を付ける。
 * ユーザー ID を変えても使えるよう、リンクには変わらない UUID を使う。
 */
export function InviteLinkButton({ userId }: { userId: string }) {
  const copy = async () => {
    const url = `${window.location.origin}/i/${userId}?openExternalBrowser=1`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("招待リンクをコピーしました。LINE などで友人に送りましょう");
    } catch {
      window.prompt("招待リンク", url);
    }
  };
  return (
    <Button size="sm" variant="secondary" onPress={copy}>
      <LinkIcon className="size-4" />
      招待リンクをコピー
    </Button>
  );
}
