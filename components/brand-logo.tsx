import Image from "next/image";
import { SERVICE_NAME } from "@/lib/config";

/** ヘッダーなどに置くロゴ（アイコン＋サービス名）。アイコンの元データは public/brand/ */
export function BrandLogo() {
  return (
    <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
      <Image src="/brand/icon.svg" alt="" width={28} height={28} unoptimized className="size-7" />
      {SERVICE_NAME}
    </span>
  );
}
