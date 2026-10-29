"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { guarded, success, type ActionResult } from "@/lib/admin/result";

const ids = z.array(z.string().min(1)).min(1).max(500);

export async function setMessagesRead(list: string[], read: boolean): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    await db.message.updateMany({ where: { id: { in: ids.parse(list) } }, data: { read: Boolean(read) } });
    revalidatePath("/admin", "layout");
    return success(read ? "Marked as read" : "Marked as unread");
  });
}

export async function deleteMessages(list: string[]): Promise<ActionResult> {
  return guarded(async () => {
    await requireUser();
    const n = await db.message.deleteMany({ where: { id: { in: ids.parse(list) } } });
    revalidatePath("/admin", "layout");
    return success(`${n.count} message${n.count === 1 ? "" : "s"} deleted`);
  });
}
