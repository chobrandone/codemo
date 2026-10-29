import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { createUser } from "@/app/admin/actions/users";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/ui/card";
import { Field, Input, NativeSelect } from "@/components/ui/form";
import { AdminForm, FieldError, SubmitButton } from "@/components/admin/admin-form";
import { UserTable } from "./user-table";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireUser();
  if (me.role !== "ADMIN") redirect("/admin");
  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, role: true, active: true, lastLoginAt: true, createdAt: true },
  });
  return (
    <>
      <PageHeader
        title="Users"
        description="Administrators manage everything including users. Editors can edit all content and messages but not users."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader title="Team" />
          <UserTable
            meId={me.id}
            users={users.map((u) => ({ ...u, lastLoginAt: u.lastLoginAt?.toISOString() ?? null, createdAt: u.createdAt.toISOString() }))}
          />
        </Card>
        <Card className="h-fit">
          <CardHeader title="Add a user" />
          <CardBody>
            <AdminForm action={createUser} resetOnSuccess className="space-y-4">
              <Field label="Name" htmlFor="new-name">
                <Input id="new-name" name="name" />
              </Field>
              <Field label="Email *" htmlFor="new-email">
                <Input id="new-email" name="email" type="email" required autoComplete="off" />
                <FieldError name="email" />
              </Field>
              <Field label="Role" htmlFor="new-role">
                <NativeSelect id="new-role" name="role" defaultValue="EDITOR">
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Administrator</option>
                </NativeSelect>
              </Field>
              <Field label="Temporary password *" htmlFor="new-password" hint="At least 10 characters with a number.">
                <Input id="new-password" name="password" type="password" required autoComplete="new-password" />
                <FieldError name="password" />
              </Field>
              <SubmitButton className="w-full">Create user</SubmitButton>
            </AdminForm>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
