import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe part of the Auth.js config (used by middleware). The credentials
 * provider — which needs Prisma and bcrypt — is added in auth.ts.
 */
export const authConfig = {
  // Accept the Auth.js v4 variable name too, in case it was set that way.
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || undefined,
  // Configuration errors land on the login page, which explains what to fix.
  pages: { signIn: "/admin/login", error: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/admin/login")) return true;
      if (pathname.startsWith("/admin")) return !!auth?.user;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
