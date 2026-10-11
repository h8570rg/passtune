import { coerceFormValue } from "@conform-to/zod/v4/future";
import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const profileSchema = coerceFormValue(
  z.object({
    handle: schema.handle,
    displayName: schema.displayName,
    avatarPath: schema.avatarPath,
  }),
);
