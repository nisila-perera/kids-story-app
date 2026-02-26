import Link from "next/link";
import {
  PageShell,
  SiteHeader,
} from "@/components/magic-story";
import { buttonStyles } from "@/components/ui";

export default function Home() {
  return (
    <PageShell>
      <SiteHeader active="home" />

      <section className="mx-auto mt-6 w-full max-w-6xl">
        <div className="bubble-card soft-grid-bg relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-sun/35 blur-xl" />
          <div className="absolute bottom-6 left-8 h-16 w-16 rounded-full bg-mint/35 blur-xl" />

          <p className="inline-flex rounded-full border border-sky/20 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-deep">
            AI-powered bedtime & adventure stories
          </p>

          <h1 className="mt-4 text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Turn your child into the hero of a magical story
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
            Upload a photo, choose an age group and story style, then MagicStory creates
            a personalized tale with a matching illustration in a bright, kid-friendly format.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/create" className={buttonStyles({ variant: "sun", size: "lg" })}>
              Create My Story
            </Link>
            <Link href="/story" className={buttonStyles({ variant: "outline", size: "lg" })}>
              Story Reader Preview
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white/85 p-4">
              <p className="font-display text-lg text-foreground">1. Upload Photo</p>
              <p className="mt-1 text-sm text-ink-soft">Simple drag-and-drop or tap-to-upload.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white/85 p-4">
              <p className="font-display text-lg text-foreground">2. Choose Style</p>
              <p className="mt-1 text-sm text-ink-soft">Space, fairy tales, jungle quests, and more.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white/85 p-4">
              <p className="font-display text-lg text-foreground">3. Read Together</p>
              <p className="mt-1 text-sm text-ink-soft">A playful story page with large readable text.</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
