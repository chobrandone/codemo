import "server-only";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "./db";

/**
 * Verifies the session AND that the account still exists and is active, so
 * disabling a user takes effect immediately. Use in every admin page/action.
 */
export async function requireUser(role?: Role) {
  const session = await auth().catch(() => null);
  if (!session?.user?.id) redirect("/admin/login");
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, active: true },
  });
  if (!user || !user.active) redirect("/admin/login?error=disabled");
  if (role === "ADMIN" && user.role !== "ADMIN") throw new Error("Only administrators can perform this action.");
  return user;
}

export type AdminUser = Awaited<ReturnType<typeof requireUser>>;
