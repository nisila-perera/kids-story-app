import { PageShell, SiteHeader, StoryReader } from "@/components/magic-story";

export default function StoryPage() {
  return (
    <PageShell>
      <SiteHeader active="story" />

      <section className="mx-auto mt-6 w-full max-w-6xl">
        <StoryReader />
      </section>

    </PageShell>
  );
}
