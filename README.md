# MagicStory

MagicStory is a kid-friendly Next.js app that generates personalized stories and illustrations for children using the Google Gemini API.

## Features

- Bright, playful landing page and creator flow
- Story creator form with:
  - Photo upload (drag/drop + click)
  - Age group selector
  - Favorite character input
  - Story style selection cards
- Gemini text generation (kid-safe prompting)
- Gemini image generation (Nano Banana / image preview model) using the uploaded photo as a reference
- Story reader page with:
  - Title, metadata badges, illustration, and readable story text
  - Empty/error/loading states

## Tech Stack

- Next.js App Router (project currently on `Next.js 16`)
- React 19
- Tailwind CSS v4
- TypeScript
- Gemini API (text + image generation)

## Environment Variables

Copy `.env.local.example` to `.env.local` and set at least `GEMINI_API_KEY`.

```bash
cp .env.local.example .env.local
```

Required / supported variables:

- `GEMINI_API_KEY` (required unless you provide only `NANO_BANANA_API_KEY`)
- `NANO_BANANA_API_KEY` (optional; falls back to `GEMINI_API_KEY`)
- `GEMINI_TEXT_MODEL` (default: `gemini-flash-latest`)
- `NANO_BANANA_MODEL` (default: `gemini-3.1-flash-image-preview`)

## Node Setup

```bash
nvm use
pnpm install
```

## Scripts

```bash
pnpm dev     # start local dev server
pnpm lint    # run eslint
pnpm build   # production build
pnpm start   # run production server after build
```

## Local Run Flow

1. Open `/` for the landing page.
2. Go to `/create` and fill the form.
3. Submit to call `/api/story`.
4. The generated response is stored in session storage and displayed on `/story`.

## Notes / Limitations

- The reader page currently stores the latest generated story in `sessionStorage` (per-tab/session). Closing the tab/session may clear it.
- Production builds using `next/font/google` may require network access to fetch `Fredoka` and `Quicksand` during build.
- In restricted/offline environments, `pnpm build` can fail because Google Fonts cannot be fetched.

## API Docs Used

- Gemini text generation
- Gemini structured output
- Gemini image generation

Official docs:
- https://ai.google.dev/gemini-api/docs/text-generation
- https://ai.google.dev/gemini-api/docs/structured-output
- https://ai.google.dev/gemini-api/docs/image-generation
