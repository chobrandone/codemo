"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { initialResult, type ActionResult } from "@/lib/admin/result";
import { useToast } from "./toast";

const FormCtx = createContext<{ pending: boolean; errors: Record<string, string> }>({ pending: false, errors: {} });
export const useFormErrors = () => useContext(FormCtx).errors;

/**
 * Wraps a server action with pending state, field errors and toast feedback.
 * On success it refreshes the route (or follows `redirectTo`).
 */
export function AdminForm({
  action,
  children,
  className,
  onSuccess,
  resetOnSuccess,
}: {
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
  onSuccess?: (r: ActionResult) => void;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, initialResult);
  const toast = useToast();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.at) return;
    if (state.message) toast(state.message, state.ok);
    if (state.ok) {
      if (resetOnSuccess) ref.current?.reset();
      onSuccess?.(state);
      if (state.redirectTo) router.push(state.redirectTo);
      else router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.at]);

  return (
    <FormCtx.Provider value={{ pending, errors: state.ok ? {} : (state.errors ?? {}) }}>
      <form
        ref={ref}
        className={className}
        // Submitting manually avoids React 19's automatic form reset, so edits survive validation errors.
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => formAction(fd));
        }}
      >
        {children}
      </form>
    </FormCtx.Provider>
  );
}

export function SubmitButton({ children = "Save changes", ...props }: ButtonProps) {
  const { pending } = useContext(FormCtx);
  return (
    <Button type="submit" disabled={pending || props.disabled} {...props}>
      {pending && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}

/** Small inline error for a named field inside an AdminForm. */
export function FieldError({ name }: { name: string }) {
  const errors = useFormErrors();
  if (!errors[name]) return null;
  return <p className="text-xs text-destructive">{errors[name]}</p>;
}
