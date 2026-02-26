import { cn } from "@/lib/utils";

type PlayfulLoaderProps = {
  label?: string;
  className?: string;
};

export function PlayfulLoader({
  label = "Making magic...",
  className,
}: PlayfulLoaderProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-[999px] border border-line bg-white px-4 py-2 bubble-shadow",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sun [animation-delay:-0.2s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky [animation-delay:-0.1s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-mint" />
      </div>
      <span className="text-sm font-semibold text-ink-soft">{label}</span>
    </div>
  );
}

