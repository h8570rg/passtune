"use client";

import { Toast } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PlayerProvider } from "@/components/player-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <PlayerProvider>{children}</PlayerProvider>
      <Toast.Provider />
    </NextThemesProvider>
  );
}
