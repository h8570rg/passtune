import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SERVICE_NAME } from "@/lib/config";

export const alt = SERVICE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * LINE や X でリンクを共有したときの画像。アイコンは public/brand/icon.svg を使う。
 * 日本語フォントを読み込まずに済むよう、画像内の文字は英語にする（日本語の説明はタイトルと説明文で出る）。
 */
export default async function OpengraphImage() {
  const icon = await readFile(join(process.cwd(), "public/brand/icon.svg"));
  const iconSrc = `data:image/svg+xml;base64,${icon.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        background: "linear-gradient(135deg, #12122a 0%, #1d1d3a 55%, #2b2b5c 100%)",
        color: "#ffffff",
      }}
    >
      {/* oxlint-disable-next-line nextjs/no-img-element -- ImageResponse の中では img を使う */}
      <img src={iconSrc} width={200} height={200} alt="" />
      <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>{SERVICE_NAME}</div>
      <div style={{ fontSize: 40, color: "#c4c4fb" }}>Pass your favorite tunes to friends.</div>
    </div>,
    size,
  );
}
