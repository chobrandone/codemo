import type { Metadata } from "next";
import { requireUser } from "@/lib/auth-guard";
import { changeOwnPassword, updateProfile } from "@/app/admin/actions/users";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { AdminForm, FieldError, SubmitButton } from "@/components/admin/admin-form";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const me = await requireUser();
  return (
    <>
      <PageHeader title="My account" description={`${me.email} · ${me.role.toLowerCase()}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Profile" />
          <CardBody>
            <AdminForm action={updateProfile} className="space-y-4">
              <Field label="Display name" htmlFor="name">
                <Input id="name" name="name" defaultValue={me.name ?? ""} />
              </Field>
              <SubmitButton>Save profile</SubmitButton>
            </AdminForm>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Change password" />
          <CardBody>
            <AdminForm action={changeOwnPassword} resetOnSuccess className="space-y-4">
              <Field label="Current password" htmlFor="current">
                <Input id="current" name="current" type="password" autoComplete="current-password" />
                <FieldError name="current" />
              </Field>
              <Field label="New password" htmlFor="password" hint="At least 10 characters with a number.">
                <Input id="password" name="password" type="password" autoComplete="new-password" />
                <FieldError name="password" />
              </Field>
              <Field label="Confirm new password" htmlFor="confirm">
                <Input id="confirm" name="confirm" type="password" autoComplete="new-password" />
                <FieldError name="confirm" />
              </Field>
              <SubmitButton>Change password</SubmitButton>
            </AdminForm>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
