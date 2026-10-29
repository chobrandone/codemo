import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { db } from "./lib/db";
import { clientIp, rateLimit, resetRateLimit } from "./lib/rate-limit";

class TooManyAttempts extends CredentialsSignin {
  code = "rate_limited";
}

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

// Constant-time-ish failure path when the user does not exist.
const DUMMY_HASH = "$2b$12$5.Ljr9el1eB4TJXBloe1.u/p.Y0UAjiriziDMdFiMnYlZtBCVFTrW";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: { label: "Email" }, password: { label: "Password", type: "password" } },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const ip = await clientIp();
        const allowedIp = await rateLimit(`login:ip:${ip}`, 20, 15 * 60);
        const allowedUser = await rateLimit(`login:user:${email}`, 8, 15 * 60);
        if (!allowedIp || !allowedUser) throw new TooManyAttempts();

        const user = await db.user.findUnique({ where: { email } });
        const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !ok || !user.active) return null;

        await resetRateLimit(`login:user:${email}`);
        await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
