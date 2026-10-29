"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { fail, formToObject, guarded, success, zodErrors, type ActionResult } from "@/lib/admin/result";

const password = z
  .string()
  .min(10, "Password must be at least 10 characters.")
  .max(200)
  .refine((p) => /[a-zA-Z]/.test(p) && /\d/.test(p), "Use letters and at least one number.");

const createSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  role: z.enum(["ADMIN", "EDITOR"]),
  password,
});

export async function createUser(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser("ADMIN");
    const parsed = createSchema.safeParse(formToObject(fd));
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    const { email, name, role, password: pw } = parsed.data;
    if (await db.user.findUnique({ where: { email } })) return fail("A user with this email already exists.", { email: "Already in use." });
    await db.user.create({ data: { email, name: name || null, role, passwordHash: await bcrypt.hash(pw, 12) } });
    revalidatePath("/admin/users");
    return success("User created");
  });
}

/** Prevents locking everyone out by removing/disabling the last active admin. */
async function assertNotLastAdmin(userId: string) {
  const target = await db.user.findUnique({ where: { id: userId } });
  if (target?.role !== "ADMIN" || !target.active) return;
  const admins = await db.user.count({ where: { role: "ADMIN", active: true } });
  if (admins <= 1) throw new Error("You cannot disable or demote the last active administrator.");
}

export async function setUserActive(id: string, active: boolean): Promise<ActionResult> {
  return guarded(async () => {
    const me = await requireUser("ADMIN");
    if (id === me.id) return fail("You cannot disable your own account.");
    if (!active) await assertNotLastAdmin(id);
    await db.user.update({ where: { id }, data: { active: Boolean(active) } });
    revalidatePath("/admin/users");
    return success(active ? "User enabled" : "User disabled");
  });
}

export async function setUserRole(id: string, role: "ADMIN" | "EDITOR"): Promise<ActionResult> {
  return guarded(async () => {
    const me = await requireUser("ADMIN");
    if (id === me.id) return fail("You cannot change your own role.");
    const r = z.enum(["ADMIN", "EDITOR"]).parse(role);
    if (r === "EDITOR") await assertNotLastAdmin(id);
    await db.user.update({ where: { id }, data: { role: r } });
    revalidatePath("/admin/users");
    return success("Role updated");
  });
}

export async function resetUserPassword(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser("ADMIN");
    const parsed = z.object({ id: z.string().min(1), password }).safeParse(formToObject(fd));
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    await db.user.update({ where: { id: parsed.data.id }, data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) } });
    return success("Password reset — share it with the user securely.");
  });
}

export async function deleteUser(id: string): Promise<ActionResult> {
  return guarded(async () => {
    const me = await requireUser("ADMIN");
    if (id === me.id) return fail("You cannot delete your own account.");
    await assertNotLastAdmin(id);
    await db.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return success("User deleted");
  });
}

export async function changeOwnPassword(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    const me = await requireUser();
    const parsed = z
      .object({ current: z.string().min(1, "Enter your current password."), password, confirm: z.string() })
      .refine((d) => d.password === d.confirm, { message: "Passwords do not match.", path: ["confirm"] })
      .safeParse(formToObject(fd));
    if (!parsed.success) return fail("Please fix the highlighted fields.", zodErrors(parsed.error));
    const user = await db.user.findUniqueOrThrow({ where: { id: me.id } });
    if (!(await bcrypt.compare(parsed.data.current, user.passwordHash)))
      return fail("Current password is incorrect.", { current: "Incorrect password." });
    await db.user.update({ where: { id: me.id }, data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) } });
    return success("Password changed");
  });
}

export async function updateProfile(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  return guarded(async () => {
    const me = await requireUser();
    const name = z.string().trim().max(120).parse(fd.get("name") ?? "");
    await db.user.update({ where: { id: me.id }, data: { name: name || null } });
    return success("Profile updated");
  });
}
