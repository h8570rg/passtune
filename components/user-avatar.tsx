import { Avatar, type AvatarProps } from "@heroui/react";

/** アイコン画像。未設定なら表示名の頭文字を出す。 */
export function UserAvatar({
  avatarUrl,
  name,
  ...avatarProps
}: {
  avatarUrl: string | null;
  name: string;
} & AvatarProps) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? "?";
  return (
    <Avatar {...avatarProps}>
      {avatarUrl ? <Avatar.Image src={avatarUrl} alt={name} /> : null}
      <Avatar.Fallback>{initial}</Avatar.Fallback>
    </Avatar>
  );
}
