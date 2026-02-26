"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, PlayfulLoader } from "@/components/ui";
import { STORY_SESSION_STORAGE_KEY } from "@/lib/story-session";
import type { StoryGenerationResponse } from "@/types/story";

type ReaderState =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ready"; story: StoryGenerationResponse };

function isStoryResponse(value: unknown): value is StoryGenerationResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  const metadata = record.metadata as Record<string, unknown> | undefined;

  return (
    typeof record.title === "string" &&
    typeof record.storyText === "string" &&
    (!!record.imageUrl || !!record.imageBase64) &&
    !!metadata &&
    typeof metadata.ageGroup === "string" &&
    typeof metadata.storyStyle === "string" &&
    typeof metadata.favoriteCharacter === "string"
  );
}

function normalizeStoryImageUrl(story: StoryGenerationResponse) {
  if (story.imageUrl && story.imageUrl.startsWith("data:")) {
    return story.imageUrl;
  }

  if (story.imageBase64) {
    return `data:image/png;base64,${story.imageBase64}`;
  }

  return null;
}

export function StoryReader() {
  const [state, setState] = useState<ReaderState>({ status: "loading" });

  useEffect(() => {
    const nextState = (() => {
      try {
        const raw = window.sessionStorage.getItem(STORY_SESSION_STORAGE_KEY);

        if (!raw) {
          return { status: "empty" } satisfies ReaderState;
        }

        const parsed = JSON.parse(raw) as unknown;

        if (!isStoryResponse(parsed)) {
          return {
            status: "error",
            message:
              "We found saved story data, but it is in an unexpected format. Please create a new story.",
          } satisfies ReaderState;
        }

        return { status: "ready", story: parsed } satisfies ReaderState;
      } catch {
        return {
          status: "error",
          message: "We could not load the saved story. Please create a new one.",
        } satisfies ReaderState;
      }
    })();

    const timeoutId = window.setTimeout(() => {
      setState(nextState);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const paragraphs = useMemo(() => {
    if (state.status !== "ready") {
      return [];
    }

    return state.story.storyText
      .split(/\n\s*\n/g)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [state]);

  if (state.status === "loading") {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl leading-tight text-foreground sm:text-4xl">MagicStory Reader</h1>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              Loading your latest story...
            </p>
          </div>
          <PlayfulLoader label="Opening story..." />
        </div>
      </Card>
    );
  }

  if (state.status === "empty" || state.status === "error") {
    return (
      <Card className="overflow-hidden p-0">
        <div className="border-b border-line bg-gradient-to-r from-sun/20 via-white to-sky/20 px-6 py-5">
          <p className="text-sm font-semibold text-sky-deep">Story Reader</p>
          <h1 className="mt-1 text-3xl leading-tight text-foreground sm:text-4xl">
            No story ready yet
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
            {state.status === "error"
              ? state.message
              : "Create a story first. The generated result will appear here after the creator flow finishes."}
          </p>
        </div>

        <div className="grid gap-5 p-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="rounded-3xl border border-dashed border-line bg-white p-6">
            <p className="font-display text-lg text-foreground">How the reader works</p>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-ink-soft">
              <li>1. Create a story on the `/create` page.</li>
              <li>2. MagicStory saves the generated result in session storage.</li>
              <li>3. This page loads and displays the saved title, image, and story text.</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6">
            <p className="font-display text-lg text-foreground">Next step</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              Go to the creator page, fill the form, and generate a story. If you refresh after
              closing the tab/session, the saved story may no longer be available.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/create">
                <Button variant="sun">Create My Story</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const { story } = state;
  const imageUrl = normalizeStoryImageUrl(story);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0 print:shadow-none">
        <div className="border-b border-line bg-gradient-to-r from-sun/20 via-white to-sky/20 px-6 py-5 print:bg-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-deep print:text-foreground">
                Story Reader
              </p>
              <h1 className="mt-1 text-3xl leading-tight text-foreground sm:text-4xl">
                {story.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink-soft">
                  Age {story.metadata.ageGroup}
                </span>
                <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink-soft">
                  {story.metadata.storyStyle}
                </span>
                <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink-soft">
                  Character: {story.metadata.favoriteCharacter}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.05fr] print:grid-cols-1 print:p-5">
          <div className="print:mb-4">
            <div className="overflow-hidden rounded-3xl border border-line bg-white">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`Illustration for ${story.title}`}
                  width={1200}
                  height={900}
                  unoptimized
                  className="h-auto w-full object-cover"
                />
              ) : (
                <div className="grid h-80 place-items-center bg-muted/40 text-sm font-semibold text-ink-soft">
                  No illustration available
                </div>
              )}
            </div>
          </div>

          <article className="rounded-3xl border border-line bg-white p-5 print:border-none print:p-0">
            <h2 className="text-xl text-foreground">Story</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-foreground/90">
              {(paragraphs.length > 0 ? paragraphs : [story.storyText]).map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </Card>
    </div>
  );
}
