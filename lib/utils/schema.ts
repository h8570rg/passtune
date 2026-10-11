import { z } from "zod";
import {
  COMMENT_MAX_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
  HANDLE_MAX_LENGTH,
  HANDLE_MIN_LENGTH,
  HANDLE_PATTERN,
  OTP_LENGTH,
  POST_COMMENT_MAX_LENGTH,
} from "@/lib/config";

export const schema = {
  email: z
    .string("メールアドレスを入力してください")
    .trim()
    .pipe(z.email("メールアドレスを正しい形式で入力してください")),
  otp: z
    .string("確認コードを入力してください")
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `${OTP_LENGTH} 桁の数字を入力してください`),
  handle: z
    .string("ユーザー ID を入力してください")
    .trim()
    .toLowerCase()
    .min(HANDLE_MIN_LENGTH, `ユーザー ID は ${HANDLE_MIN_LENGTH} 文字以上で入力してください`)
    .max(HANDLE_MAX_LENGTH, `ユーザー ID は ${HANDLE_MAX_LENGTH} 文字以内で入力してください`)
    .regex(
      HANDLE_PATTERN,
      "ユーザー ID は半角英小文字・数字・アンダースコア（_）で入力してください",
    ),
  displayName: z
    .string("表示名を入力してください")
    .trim()
    .min(1, "表示名を入力してください")
    .max(DISPLAY_NAME_MAX_LENGTH, `表示名は ${DISPLAY_NAME_MAX_LENGTH} 文字以内で入力してください`),
  avatarPath: z.string().trim().optional(),
  postComment: z
    .string()
    .trim()
    .max(POST_COMMENT_MAX_LENGTH, `一言は ${POST_COMMENT_MAX_LENGTH} 文字以内で入力してください`)
    .optional()
    .transform((value) => value ?? ""),
  commentBody: z
    .string("コメントを入力してください")
    .trim()
    .min(1, "コメントを入力してください")
    .max(COMMENT_MAX_LENGTH, `コメントは ${COMMENT_MAX_LENGTH} 文字以内で入力してください`),
};
