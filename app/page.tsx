import { Button } from "@heroui/react";
import { SERVICE_NAME } from "@/lib/config";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">{SERVICE_NAME}</h1>
      <p className="text-muted">準備中</p>
      <Button>HeroUI</Button>
    </main>
  );
}
