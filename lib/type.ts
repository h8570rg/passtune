import type { Database } from "@/lib/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type Profile = {
  id: string;
  handle: string;
  displayName: string;
  avatarPath: string | null;
  avatarUrl: string | null;
};
