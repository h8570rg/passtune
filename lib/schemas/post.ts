import { coerceFormValue } from "@conform-to/zod/v4/future";
import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const createPostSchema = coerceFormValue(
  z.object({
    appleTrackId: z.coerce.number("曲を選んでください").int().positive("曲を選んでください"),
    comment: schema.postComment,
  }),
);

export const createCommentSchema = coerceFormValue(
  z.object({
    postId: z.uuid(),
    body: schema.commentBody,
  }),
);
