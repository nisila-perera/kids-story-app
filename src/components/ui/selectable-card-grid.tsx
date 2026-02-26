"use client";

import { cn } from "@/lib/utils";

export type SelectableCardOption = {
  id: string;
  label: string;
  description?: string;
  accent?: "sun" | "sky" | "mint" | "peach";
};

type SelectableCardGridProps = {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectableCardOption[];
  className?: string;
};

const ACCENT_STYLES: Record<
  NonNullable<SelectableCardOption["accent"]>,
  { chip: string; ring: string; bg: string }
> = {
  sun: {
    chip: "bg-sun/30 text-[#6c4d00]",
    ring: "border-[#f6c936]",
    bg: "from-sun/15 to-white",
  },
  sky: {
    chip: "bg-sky/20 text-sky-deep",
    ring: "border-sky/60",
    bg: "from-sky/15 to-white",
  },
  mint: {
    chip: "bg-mint/25 text-[#0e6b45]",
    ring: "border-mint/70",
    bg: "from-mint/20 to-white",
  },
  peach: {
    chip: "bg-peach/25 text-[#924c2c]",
    ring: "border-peach/70",
    bg: "from-peach/20 to-white",
  },
};

export function SelectableCardGrid({
  ariaLabel,
  value,
  onChange,
  options,
  className,
}: SelectableCardGridProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}
    >
      {options.map((option) => {
        const selected = value === option.id;
        const accent = ACCENT_STYLES[option.accent ?? "sky"];

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative text-left rounded-3xl border bg-gradient-to-br p-4 transition bubble-shadow",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky/25",
              accent.bg,
              selected
                ? cn(accent.ring, "scale-[1.01] bg-white")
                : "border-line hover:border-sky/40 hover:-translate-y-0.5",
            )}
          >
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                accent.chip,
              )}
            >
              {selected ? "Selected" : "Pick me"}
            </span>
            <div className="mt-3">
              <div className="font-display text-lg text-foreground">{option.label}</div>
              {option.description ? (
                <p className="mt-1 text-sm leading-5 text-ink-soft">
                  {option.description}
                </p>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}

