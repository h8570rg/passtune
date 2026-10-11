"use client";

import { toast } from "@heroui/react";
import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/button";
import { setFollowing } from "@/lib/actions/social";

export function FollowButton({ userId, following }: { userId: string; following: boolean }) {
  const [state, setOptimistic] = useOptimistic(following);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      setOptimistic(!state);
      const result = await setFollowing(userId, !state);
      if (result.error) toast.danger(result.error);
    });
  };

  return (
    <Button
      size="sm"
      variant={state ? "tertiary" : "primary"}
      onPress={toggle}
      isDisabled={isPending}
    >
      {state ? "フォロー中" : "フォローする"}
    </Button>
  );
}
