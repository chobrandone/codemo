"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login, type LoginState } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/admin"} />
      {state.error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />} Sign in
      </Button>
    </form>
  );
}
