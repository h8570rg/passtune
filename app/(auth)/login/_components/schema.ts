import { coerceFormValue } from "@conform-to/zod/v4/future";
import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const sendOtpSchema = coerceFormValue(z.object({ email: schema.email }));

export const verifyOtpSchema = coerceFormValue(
  z.object({
    email: schema.email,
    token: schema.otp,
    next: z.string().optional(),
  }),
);
