import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={cn(
        "relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 sm:py-6",
        "print:min-h-0 print:overflow-visible print:bg-white print:px-0 print:py-0",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 print:hidden">
        <span className="confetti-orb left-[4%] top-[7%] h-11 w-11 bg-sun/45" />
        <span className="confetti-orb right-[8%] top-[11%] h-16 w-16 bg-sky/30" />
        <span className="confetti-orb left-[10%] bottom-[14%] h-12 w-12 bg-mint/35" />
        <span className="confetti-orb right-[14%] bottom-[18%] h-10 w-10 bg-peach/45" />
      </div>
      <div className="relative">{children}</div>
    </main>
  );
}
