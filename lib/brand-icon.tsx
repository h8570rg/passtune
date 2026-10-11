import { ImageResponse } from "next/og";

const ACCENT = "#5b5bd6";

/**
 * Passtune のアイコン（インディゴの背景に、曲を「パス」する矢印付きの再生マーク）。
 * 画像ファイルを持たず、Next.js の ImageResponse で PNG を生成する。
 * maskable 用は、端末が丸く切り抜いても欠けないよう余白を大きく取る。
 */
export function brandIcon(size: number, { maskable = false }: { maskable?: boolean } = {}) {
  const glyph = Math.round(size * (maskable ? 0.5 : 0.62));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: ACCENT,
        borderRadius: maskable ? 0 : Math.round(size * 0.22),
      }}
    >
      <svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none">
        <path d="M6 4.5v15l11-7.5z" fill="#ffffff" />
        <path
          d="M15 5h5v5"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    { width: size, height: size },
  );
}
