"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Trash2 } from "lucide-react";
import { deleteUser, resetUserPassword, setUserActive, setUserRole } from "@/app/admin/actions/users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, Input, NativeSelect } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AdminForm, FieldError, SubmitButton } from "@/components/admin/admin-form";
import { useToast } from "@/components/admin/toast";
import { formatDate } from "@/lib/utils";

type U = { id: string; email: string; name: string | null; role: "ADMIN" | "EDITOR"; active: boolean; lastLoginAt: string | null };

export function UserTable({ users, meId }: { users: U[]; meId: string }) {
  const [, start] = useTransition();
  const [resetFor, setResetFor] = useState<U | null>(null);
  const toast = useToast();
  const router = useRouter();
  const run = (p: Promise<{ ok: boolean; message?: string }>) =>
    start(async () => {
      const r = await p;
      toast(r.message ?? "", r.ok);
      router.refresh();
    });

  return (
    <>
      <ul className="divide-y divide-zinc-100">
        {users.map((u) => {
          const me = u.id === meId;
          return (
            <li key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600">
                {(u.name || u.email).slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {u.name || u.email} {me && <Badge>You</Badge>} {!u.active && <Badge tone="red">Disabled</Badge>}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {u.email} · {u.lastLoginAt ? `last login ${formatDate(u.lastLoginAt)}` : "never signed in"}
                </p>
              </div>
              <NativeSelect
                aria-label="Role"
                className="h-8 w-32 text-xs"
                value={u.role}
                disabled={me}
                onChange={(e) => run(setUserRole(u.id, e.target.value as U["role"]))}
              >
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Administrator</option>
              </NativeSelect>
              <Switch checked={u.active} disabled={me} aria-label="Active" onCheckedChange={(v) => run(setUserActive(u.id, v))} />
              <Button variant="ghost" size="icon" aria-label="Reset password" title="Reset password" onClick={() => setResetFor(u)}>
                <KeyRound />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:bg-red-50"
                disabled={me}
                aria-label="Delete user"
                onClick={() => confirm(`Delete ${u.email}?`) && run(deleteUser(u.id))}
              >
                <Trash2 />
              </Button>
            </li>
          );
        })}
      </ul>
      <Dialog open={!!resetFor} onOpenChange={(o) => !o && setResetFor(null)}>
        {resetFor && (
          <DialogContent title={`Reset password — ${resetFor.email}`} description="Set a new temporary password and share it securely.">
            <AdminForm action={resetUserPassword} onSuccess={() => setResetFor(null)} className="space-y-4">
              <input type="hidden" name="id" value={resetFor.id} />
              <Field label="New password" htmlFor="reset-pw">
                <Input id="reset-pw" name="password" type="password" autoComplete="new-password" required />
                <FieldError name="password" />
              </Field>
              <div className="flex justify-end">
                <SubmitButton>Reset password</SubmitButton>
              </div>
            </AdminForm>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
