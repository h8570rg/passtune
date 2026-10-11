import { ImageResponse } from "next/og";
import { SERVICE_NAME } from "@/lib/config";

export const alt = SERVICE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#5b5bd6";

/**
 * LINE や X でリンクを共有したときの画像。
 * 日本語フォントを読み込まずに済むよう、画像内の文字は英語にする（日本語の説明はタイトルと説明文で出る）。
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        background: "linear-gradient(135deg, #0b0b12 0%, #1d1b4b 60%, #3b2a6b 100%)",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: 160,
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ACCENT,
          borderRadius: 36,
        }}
      >
        <svg width={100} height={100} viewBox="0 0 24 24" fill="none">
          <path d="M6 4.5v15l11-7.5z" fill="#ffffff" />
          <path
            d="M15 5h5v5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>{SERVICE_NAME}</div>
      <div style={{ fontSize: 40, color: "#c7c7f5" }}>Pass your favorite tunes to friends.</div>
    </div>,
    size,
  );
}
