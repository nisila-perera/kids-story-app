"use client";

import { cn } from "@/lib/utils";

type SegmentedOption = {
  value: string;
  label: string;
};

type SegmentedControlProps = {
  value: string;
  onChange: (value: string) => void;
  options: SegmentedOption[];
  className?: string;
  ariaLabel: string;
};

export function SegmentedControl({
  value,
  onChange,
  options,
  className,
  ariaLabel,
}: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-full rounded-[999px] border border-line bg-white p-1 bubble-shadow",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex-1 rounded-[999px] px-4 py-2.5 text-sm font-semibold transition",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky/25",
              selected
                ? "bg-sky text-white shadow-[0_6px_12px_rgba(36,148,242,0.25)]"
                : "text-ink-soft hover:bg-sky/8",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

