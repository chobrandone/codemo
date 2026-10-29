import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Gatekeeper for /admin. Every admin page and server action also re-checks the
// session server-side (lib/auth-guard.ts), so this is defence in depth.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*"],
};
