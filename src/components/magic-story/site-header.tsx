import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  active?: "home" | "create" | "story";
};

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-2 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky/25",
        active ? "bg-white text-sky-deep bubble-shadow" : "text-ink-soft hover:bg-white/70",
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="relative z-10 print:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-[1.25rem] border border-line bg-white/80 px-4 py-3 shadow-[0_10px_24px_rgba(22,48,71,0.08)] backdrop-blur sm:px-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky/25"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full border border-sky/30 bg-gradient-to-br from-sun via-white to-mint text-sm font-bold tracking-tight text-foreground shadow-[0_6px_14px_rgba(22,48,71,0.08)]">
            MS
          </span>
          <span className="min-w-0">
            <span className="block font-display text-xl leading-none text-foreground">
              MagicStory
            </span>
            <span className="block text-xs font-semibold text-ink-soft">
              Personalized stories for kids
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-line bg-muted/50 p-1 md:flex">
          <NavLink href="/" label="Home" active={active === "home"} />
          <NavLink href="/create" label="Create" active={active === "create"} />
          <NavLink href="/story" label="Reader" active={active === "story"} />
        </div>

        <Link href="/create" className={buttonStyles({ variant: "sun", size: "md" })}>
          Create My Story
        </Link>
      </div>
    </header>
  );
}
