"use client";

import { useActionState, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { submitContact, type ContactState } from "@/app/(site)/contact/actions";
import { cn } from "@/lib/utils";

const fieldCls =
  "mt-2 w-full border border-input bg-white px-4 py-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-0";

export function ContactForm({
  options,
  submitLabel,
  successMessage,
}: {
  options: string[];
  submitLabel: string;
  successMessage: string;
}) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [ts, setTs] = useState("");
  useEffect(() => setTs(String(Date.now())), [state]);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 border-l-2 border-leaf bg-mist p-8">
        <CheckCircle2 className="h-8 w-8 text-leaf" aria-hidden />
        <p className="font-display text-2xl text-ink">Message sent</p>
        <p className="text-[15px] leading-relaxed text-muted-foreground">{successMessage}</p>
      </div>
    );
  }

  const err = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} noValidate className="space-y-6">
      {state.status === "error" && state.message && (
        <p role="alert" className="border-l-2 border-destructive bg-red-50 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" error={err.name}>
          <input id="name" name="name" autoComplete="name" required defaultValue={v.name} className={fieldCls} aria-invalid={!!err.name} aria-describedby={err.name ? "name-error" : undefined} />
        </Field>
        <Field label="Email" name="email" error={err.email}>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={fieldCls} aria-invalid={!!err.email} aria-describedby={err.email ? "email-error" : undefined} />
        </Field>
      </div>
      <Field label="I am contacting you as" name="inquiryType" error={err.inquiryType}>
        <select id="inquiryType" name="inquiryType" required defaultValue={v.inquiryType ?? options[0]} className={cn(fieldCls, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23667066%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10")} aria-invalid={!!err.inquiryType}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message" name="message" error={err.message}>
        <textarea id="message" name="message" rows={6} required defaultValue={v.message} className={cn(fieldCls, "resize-y")} aria-invalid={!!err.message} aria-describedby={err.message ? "message-error" : undefined} />
      </Field>

      {/* Honeypot + timing field (bots) */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="ts" value={ts} />

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex h-[54px] items-center justify-center gap-2.5 bg-primary px-9 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        {pending ? "Sending…" : submitLabel}
        {!pending && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[10px] font-bold uppercase tracking-[0.22em] text-earth">
        {label}
        <span className="text-gold">*</span>
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
