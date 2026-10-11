import { brandIcon } from "@/lib/brand-icon";

const SIZES = new Set(["192", "512"]);

/** PWA の manifest 用アイコン（/icons/192、/icons/512、末尾に -maskable で maskable 版） */
export async function GET(_request: Request, { params }: RouteContext<"/icons/[size]">) {
  const { size } = await params;
  const maskable = size.endsWith("-maskable");
  const pixels = size.replace("-maskable", "");
  if (!SIZES.has(pixels)) return new Response("Not Found", { status: 404 });
  return brandIcon(Number(pixels), { maskable });
}
