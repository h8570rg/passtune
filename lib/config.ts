export const SERVICE_NAME = "Passtune";
export const SERVICE_DESCRIPTION = "友人と好きな曲を 1 曲ずつ届け合う音楽共有 SNS";
export const SERVICE_NAME_KANA = "パスチューン";
/** LP（検索エンジンに載せる唯一のページ）の説明文。docs/technical/ui-design.md の「LP」 */
export const LANDING_DESCRIPTION =
  "Passtune（パスチューン）は、好きな曲を 1 曲と一言で友だちに届ける音楽共有 SNS。Apple Music・Spotify・YouTube Music・LINE MUSIC、使っている音楽サービスが違っても、届いた曲をその場で試聴できます。";
export const OPERATOR_NAME = "h8570rg";
// TODO(launch): 問い合わせ先のメールアドレスが決まったら差し替える
export const CONTACT_EMAIL = "contact@example.com";

export const HANDLE_PATTERN = /^[a-z0-9_]{3,20}$/;
export const HANDLE_MIN_LENGTH = 3;
export const HANDLE_MAX_LENGTH = 20;
export const DISPLAY_NAME_MAX_LENGTH = 30;
export const POST_COMMENT_MAX_LENGTH = 140;
export const COMMENT_MAX_LENGTH = 200;

export const AVATAR_BUCKET = "avatars";
export const AVATAR_MAX_SIZE = 2 * 1024 * 1024;
export const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const AVATAR_OUTPUT_SIZE = 256;

export const OTP_LENGTH = 6;
export const INVITE_COOKIE_NAME = "passtune_invite";
export const TIMELINE_PAGE_SIZE = 20;
