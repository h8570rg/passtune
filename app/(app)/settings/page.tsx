import type { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "@/components/profile-form";
import { requireProfile } from "@/lib/data/user";
import { updateProfile } from "./_components/actions";
import { SignOutButton } from "./_components/sign-out-button";

export const metadata: Metadata = { title: "設定" };

export default async function SettingsPage() {
  const profile = await requireProfile("/settings");

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <h1 className="text-lg font-bold">プロフィールを編集</h1>
        <ProfileForm
          action={updateProfile}
          submitLabel="保存する"
          defaultValue={{
            handle: profile.handle,
            displayName: profile.displayName,
            avatarPath: profile.avatarPath,
            avatarUrl: profile.avatarUrl,
          }}
        />
      </section>
      <section className="space-y-3">
        <SignOutButton />
        <div className="flex justify-center gap-4 text-xs text-muted">
          <Link href="/terms" className="underline">
            利用規約
          </Link>
          <Link href="/privacy" className="underline">
            プライバシーポリシー
          </Link>
        </div>
      </section>
    </div>
  );
}
