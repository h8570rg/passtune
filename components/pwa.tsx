"use client";

import { CloseButton } from "@heroui/react";
import { ShareIcon, SquarePlusIcon } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { isInAppBrowser, isIOS } from "@/lib/utils/user-agent";

const DISMISS_KEY = "passtune:a2hs-dismissed";

/** Service Worker を登録する（Android でのインストールに必要） */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => undefined);
  }, []);
  return null;
}

function subscribeNothing() {
  return () => undefined;
}

function isEligibleForHint(): boolean {
  if (!isIOS(navigator.userAgent) || isStandalone()) return false;
  try {
    return !window.localStorage.getItem(DISMISS_KEY);
  } catch {
    return true;
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * iPhone で「ホーム画面に追加」の手順を案内するバナー（閉じられる。モードレス）。
 * iPhone は自動のインストール提案がないため、手順を見せる（docs/decisions/005-platform.md）。
 */
export function AddToHomeScreenHint() {
  // 端末の判定はブラウザでしかできないため、サーバーでは常に非表示として描画する
  const eligible = useSyncExternalStore(subscribeNothing, isEligibleForHint, () => false);
  const inApp = useSyncExternalStore(
    subscribeNothing,
    () => isInAppBrowser(navigator.userAgent),
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);

  if (!eligible || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // 保存できなくても閉じる
    }
  };

  return (
    <div
      role="note"
      className="mb-4 flex gap-3 rounded-2xl border border-border bg-default/60 p-4 text-sm"
    >
      <div className="flex-1 space-y-1">
        <p className="font-medium">ホーム画面に追加すると、アプリのように使えます</p>
        {inApp ? (
          <p className="text-muted">
            右上のメニューから「Safari で開く」を選んでから、追加してください。
          </p>
        ) : (
          <p className="text-muted">
            画面下の <ShareIcon className="inline size-4 align-text-bottom" aria-label="共有" />{" "}
            を押し、
            <SquarePlusIcon className="mx-0.5 inline size-4 align-text-bottom" aria-hidden />
            「ホーム画面に追加」を選んでください。
          </p>
        )}
      </div>
      <CloseButton aria-label="閉じる" onPress={dismiss} />
    </div>
  );
}
