import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "sun" | "sky" | "mint" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  sun: "bg-sun text-[#533900] border border-[#f1bf00] hover:brightness-95 active:translate-y-px",
  sky: "bg-sky text-white border border-sky-deep hover:brightness-95 active:translate-y-px",
  mint: "bg-mint text-[#0e5637] border border-mint-deep hover:brightness-95 active:translate-y-px",
  outline:
    "bg-white/80 text-foreground border border-line hover:bg-white hover:border-sky/50 active:translate-y-px",
  ghost: "bg-transparent text-foreground border border-transparent hover:bg-white/70 active:translate-y-px",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-6 text-lg",
};

export function buttonStyles({
  variant = "sun",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[999px] font-semibold transition will-change-transform",
    "shadow-[0_8px_16px_rgba(22,48,71,0.08)]",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky/30",
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "sun", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonStyles({ variant, size, className })}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
