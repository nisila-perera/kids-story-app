"use client";

import { useState } from "react";
import { AGE_GROUPS, STORY_STYLE_OPTIONS } from "@/types/story";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  PlayfulLoader,
  SegmentedControl,
  SelectableCardGrid,
} from "@/components/ui";

const DEMO_DESCRIPTIONS: Record<string, string> = {
  "space-adventure": "Zoom through stars with friendly robots and glowing planets.",
  "fairy-tale": "Kind magic, sparkling forests, and a sweet happy ending.",
  "jungle-quest": "Animal helpers, hidden paths, and brave jungle discoveries.",
  "underwater-mission": "Colorful reefs, ocean friends, and a splashy rescue mission.",
};

const ACCENTS = ["sky", "sun", "mint", "peach"] as const;

export function MagicStoryUiPreview() {
  const [ageGroup, setAgeGroup] = useState<(typeof AGE_GROUPS)[number]>("6-8");
  const [storyStyle, setStoryStyle] = useState<string>(STORY_STYLE_OPTIONS[0].id);
  const [character, setCharacter] = useState("A brave dragon");

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <span className="confetti-orb left-[8%] top-[10%] h-10 w-10 bg-sun/50" />
        <span className="confetti-orb right-[10%] top-[14%] h-14 w-14 bg-sky/35" />
        <span className="confetti-orb left-[15%] bottom-[18%] h-12 w-12 bg-mint/40" />
        <span className="confetti-orb right-[18%] bottom-[20%] h-9 w-9 bg-peach/45" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <section className="bubble-card soft-grid-bg relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-sun via-sky to-mint" />
          <p className="inline-flex rounded-full border border-sky/30 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-deep">
            Task 2 Preview • UI Foundation
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight text-foreground sm:text-5xl">
            MagicStory visual system with playful, rounded building blocks
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
            This is a style preview, not the final landing page. It shows the shared fonts,
            colors, buttons, selectors, and loading UI that will be reused in the next tasks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="sun" size="lg">Create My Story</Button>
            <Button variant="sky" size="lg">Try Demo</Button>
            <Button variant="outline" size="lg">See Styles</Button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="p-1">
            <CardHeader>
              <CardTitle>Input Primitives</CardTitle>
              <p className="mt-1 text-sm text-ink-soft">
                Base form controls for the story creator flow.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Favorite Character
                </label>
                <Input
                  value={character}
                  onChange={(event) => setCharacter(event.target.value)}
                  placeholder="A brave dragon"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Age Group</p>
                <SegmentedControl
                  ariaLabel="Select age group"
                  value={ageGroup}
                  onChange={(value) => setAgeGroup(value as (typeof AGE_GROUPS)[number])}
                  options={AGE_GROUPS.map((group) => ({ value: group, label: group }))}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="mint">Generate Story</Button>
                <Button variant="ghost">Reset</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="p-1">
            <CardHeader>
              <CardTitle>Loading Treatment</CardTitle>
              <p className="mt-1 text-sm text-ink-soft">
                Playful feedback style for the generation phase.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <PlayfulLoader label="Writing a magical adventure..." />
              <PlayfulLoader label="Drawing the story picture..." />
              <div className="rounded-3xl border border-line bg-white p-4">
                <p className="text-sm font-semibold text-foreground">
                  Recommended rotating status messages
                </p>
                <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                  <li>Writing the beginning...</li>
                  <li>Adding a happy twist...</li>
                  <li>Painting the illustration...</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <Card className="p-1">
            <CardHeader>
              <CardTitle>Story Style Selection Cards</CardTitle>
              <p className="mt-1 text-sm text-ink-soft">
                Selectable cards with strong color cues and large touch targets.
              </p>
            </CardHeader>
            <CardContent>
              <SelectableCardGrid
                ariaLabel="Select story style"
                value={storyStyle}
                onChange={setStoryStyle}
                options={STORY_STYLE_OPTIONS.map((style, index) => ({
                  id: style.id,
                  label: style.label,
                  description: DEMO_DESCRIPTIONS[style.id],
                  accent: ACCENTS[index % ACCENTS.length],
                }))}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

