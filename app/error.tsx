"use client";

import { Button } from "@heroui/react";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-xl font-bold">問題が発生しました</h1>
      <p className="text-sm text-muted">時間をおいて、もう一度試してください。</p>
      <Button onPress={reset}>もう一度読み込む</Button>
    </main>
  );
}
