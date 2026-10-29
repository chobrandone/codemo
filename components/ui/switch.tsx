"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/** Radix switch that also submits its value through a hidden input when `name` is given. */
export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, name, defaultChecked, checked, onCheckedChange, ...props }, ref) => {
  const [on, setOn] = React.useState(checked ?? defaultChecked ?? false);
  const value = checked ?? on;
  return (
    <>
      <SwitchPrimitives.Root
        ref={ref}
        checked={value}
        onCheckedChange={(v) => {
          setOn(v);
          onCheckedChange?.(v);
        }}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-zinc-300",
          className,
        )}
        {...props}
      >
        <SwitchPrimitives.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
      </SwitchPrimitives.Root>
      {name && <input type="hidden" name={name} value={value ? "on" : ""} />}
    </>
  );
});
Switch.displayName = "Switch";
