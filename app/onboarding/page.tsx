import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { SERVICE_NAME } from "@/lib/config";
import { getAuthUser, getMyProfile } from "@/lib/data/user";
import { createProfile } from "./_components/actions";

export const metadata: Metadata = { title: "プロフィールを作る" };

export default async function OnboardingPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login?next=/onboarding");
  if (await getMyProfile()) redirect("/");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-8 px-4 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-bold">{SERVICE_NAME} へようこそ</h1>
        <p className="text-sm text-muted">友人に見せるプロフィールを作りましょう</p>
      </div>
      <ProfileForm action={createProfile} submitLabel="はじめる" />
    </main>
  );
}
