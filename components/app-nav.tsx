"use client";

import { cn } from "@heroui/react";
import { BellIcon, HomeIcon, PlusIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: typeof HomeIcon;
  match: (path: string) => boolean;
};

function navItems(handle: string): NavItem[] {
  return [
    { href: "/", label: "ホーム", icon: HomeIcon, match: (path) => path === "/" },
    { href: "/search", label: "さがす", icon: SearchIcon, match: (path) => path === "/search" },
    { href: "/new", label: "投稿", icon: PlusIcon, match: (path) => path === "/new" },
    { href: "/activity", label: "反応", icon: BellIcon, match: (path) => path === "/activity" },
    {
      href: `/u/${handle}`,
      label: "プロフィール",
      icon: UserIcon,
      match: (path) => path === `/u/${handle}` || path === "/settings",
    },
  ];
}

/** ログイン後の主要ナビゲーション。スマホは画面下のタブ（variant="tabs"）、PC は画面左の縦並び（variant="side"）。 */
export function AppNav({ handle, variant }: { handle: string; variant: "tabs" | "side" }) {
  const pathname = usePathname();
  const items = navItems(handle);

  if (variant === "tabs") {
    return (
      <nav
        aria-label="メイン"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto flex max-w-xl">
          {items.map((item) => {
            const active = item.match(pathname);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2 text-[11px]",
                    active ? "text-accent" : "text-muted",
                  )}
                >
                  <item.icon className="size-6" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="メイン" className="sticky top-20">
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-default",
                  active ? "font-bold text-accent" : "text-foreground",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
