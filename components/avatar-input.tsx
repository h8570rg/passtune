"use client";

import { Avatar, toast } from "@heroui/react";
import { CameraIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AVATAR_ALLOWED_TYPES, AVATAR_MAX_SIZE } from "@/lib/config";
import { uploadAvatar } from "@/lib/data/avatar.client";

type AvatarInputProps = {
  name: string;
  defaultPath?: string | null;
  defaultUrl?: string | null;
  onUploadingChange?: (isUploading: boolean) => void;
};

/**
 * 画像を選ぶとすぐに縮小して Storage にアップロードし、保存先のパスを hidden input に入れる。
 * フォームを送信しなかった場合の画像は、次回の保存時に古い画像として削除される。
 */
export function AvatarInput({
  name,
  defaultPath,
  defaultUrl,
  onUploadingChange,
}: AvatarInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [path, setPath] = useState(defaultPath ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const displayUrl = previewUrl ?? defaultUrl ?? undefined;

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (!AVATAR_ALLOWED_TYPES.includes(file.type as (typeof AVATAR_ALLOWED_TYPES)[number])) {
      toast.danger("JPEG・PNG・WebP の画像を選んでください");
      input.value = "";
      return;
    }
    if (file.size > AVATAR_MAX_SIZE * 5) {
      toast.danger("画像が大きすぎます");
      input.value = "";
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      setPath(await uploadAvatar(file));
    } catch {
      toast.danger("画像のアップロードに失敗しました");
      setPreviewUrl(undefined);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
      input.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input type="hidden" name={name} value={path} />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        aria-label="アイコン画像を選ぶ"
        className="relative rounded-full"
      >
        <Avatar className="size-24">
          {displayUrl ? <Avatar.Image src={displayUrl} alt="アイコン画像" /> : null}
          <Avatar.Fallback>
            <CameraIcon className="size-7" />
          </Avatar.Fallback>
        </Avatar>
        <span className="absolute right-0 bottom-0 rounded-full bg-accent p-1.5 text-accent-foreground">
          <CameraIcon className="size-4" />
        </span>
      </button>
      <span className="text-xs text-muted">
        {isUploading ? "アップロード中…" : "タップして画像を選ぶ（任意）"}
      </span>
      <input
        ref={fileInputRef}
        type="file"
        accept={AVATAR_ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
