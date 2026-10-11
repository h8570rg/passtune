import Link from "next/link";
import { SERVICE_NAME } from "@/lib/config";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-lg font-bold">
        {SERVICE_NAME}
      </Link>
      <article className="mt-6 space-y-4 text-sm leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </article>
    </div>
  );
}
