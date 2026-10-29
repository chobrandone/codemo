import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { LogoMark } from "@/components/site/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

/** Plain-language checks for the usual first-deploy mistakes (shown instead of Auth.js' generic error). */
async function findSetupProblems(error?: string): Promise<string[]> {
  const problems: string[] = [];
  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    problems.push("AUTH_SECRET is not set. Add it in your hosting environment variables (a long random string).");
  }
  try {
    if ((await db.user.count()) === 0) {
      problems.push("No admin account exists yet. Set ADMIN_EMAIL and ADMIN_PASSWORD, then redeploy so the build creates it.");
    }
  } catch {
    problems.push("The database can't be reached. Check DATABASE_URL.");
  }
  if (error === "Configuration" && problems.length === 0) {
    problems.push("Auth.js reported a server configuration error. Check the server logs for the line starting with [auth][error].");
  }
  return problems;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const setupProblems = await findSetupProblems(error);
  const session = setupProblems.length ? null : await auth().catch(() => null);
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
          {setupProblems.length > 0 && (
            <div role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">
              <p className="font-semibold">Sign-in isn&apos;t configured on this deployment yet</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4">
                {setupProblems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className="mt-2 text-red-700/80">After changing environment variables, redeploy for them to take effect.</p>
            </div>
          )}
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
