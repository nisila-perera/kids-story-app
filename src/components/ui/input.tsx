import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-line bg-white px-4 text-base text-foreground shadow-[0_4px_12px_rgba(22,48,71,0.05)]",
        "placeholder:text-ink-soft/70",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky/25",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

