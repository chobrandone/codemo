import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LogoMark } from "@/components/site/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  if (session?.user && error !== "disabled") redirect("/admin");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-farmers.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div className="absolute bottom-0 p-12 text-white">
          <LogoMark className="h-12 w-12" />
          <p className="mt-6 max-w-md font-display text-3xl leading-tight">
            Manage the CODEMO website — pages, activities, projects and messages.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="rounded-full bg-ink p-1">
              <LogoMark />
            </span>
            <span className="text-lg font-extrabold tracking-[0.2em] text-ink">CODEMO</span>
          </div>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight lg:mt-0">Sign in to the admin</h1>
          <p className="mt-1 text-sm text-zinc-500">Use the email and password provided by your administrator.</p>
          {error === "disabled" && (
            <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Your account is disabled. Contact an administrator.
            </p>
          )}
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}
