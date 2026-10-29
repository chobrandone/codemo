import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "./auth.config";

// Gatekeeper for /admin. Every admin page and server action also re-checks the
// session server-side (lib/auth-guard.ts), so this is defence in depth.
const { auth } = NextAuth(authConfig);

// Without a secret Auth.js answers every request with a bare JSON error. Instead,
// send admins to the login page, which explains what is missing.
const misconfigured = (req: NextRequest) =>
  req.nextUrl.pathname.startsWith("/admin/login")
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/admin/login", req.url));

export const middleware = authConfig.secret ? auth : misconfigured;

export const config = {
  matcher: ["/admin/:path*"],
};
