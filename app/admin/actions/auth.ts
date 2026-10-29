"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  // Only allow redirects back into the admin area of this site (the host is discarded).
  let callbackUrl = "/admin";
  try {
    const u = new URL(String(fd.get("callbackUrl") ?? ""), "http://local");
    if (u.pathname.startsWith("/admin") && !u.pathname.startsWith("/admin/login")) callbackUrl = u.pathname + u.search;
  } catch {
    // keep default
  }
  try {
    await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirectTo: callbackUrl,
    });
    return {};
  } catch (e) {
    if (e instanceof AuthError) {
      const code = (e as AuthError & { code?: string }).code;
      if (code === "rate_limited") return { error: "Too many sign-in attempts. Please wait 15 minutes and try again." };
      return { error: "Invalid email or password." };
    }
    throw e; // redirect on success
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
