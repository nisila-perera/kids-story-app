import {
  PageShell,
  SiteHeader,
  StoryCreatorForm,
} from "@/components/magic-story";

export default function CreatePage() {
  return (
    <PageShell>
      <SiteHeader active="create" />

      <section className="mx-auto mt-6 w-full max-w-6xl">
        <StoryCreatorForm />
      </section>

    </PageShell>
  );
}
