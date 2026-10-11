import type { Metadata } from "next";
import { requireProfile } from "@/lib/data/user";
import { Compose } from "./_components/compose";

export const metadata: Metadata = { title: "投稿する" };

export default async function NewPostPage() {
  await requireProfile("/new");
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">1 曲を投稿する</h1>
      <Compose />
    </div>
  );
}
