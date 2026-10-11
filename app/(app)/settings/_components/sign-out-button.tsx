"use client";

import { LogOutIcon } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/button";
import { signOut } from "./actions";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="tertiary"
      className="w-full"
      isPending={isPending}
      onPress={() => startTransition(() => signOut())}
    >
      <LogOutIcon className="size-4" />
      ログアウト
    </Button>
  );
}
