# MagicStory TODO Plan (Phase 1)

Project: Build a kid-friendly AI story generator web app ("MagicStory") with Next.js App Router, Tailwind CSS, and Gemini + Nano Banana integrations.

## Scope / Assumptions to Confirm Before Phase 2

- [x] Confirm whether to keep current `Next.js 16` setup (App Router) or pin to `14/15` for compatibility reasons. (Kept Next.js 16 App Router)
- [x] Confirm component library choice: `shadcn/ui` (recommended for speed) vs `Magic UI` (more visual flair, may require more customization). (Implemented local shadcn-style primitives)
- [ ] Confirm image handling approach for uploaded child photos:
  - [x] Temporary in-memory upload (simpler MVP)
  - [ ] Persistent storage (e.g., local temp / cloud bucket) if needed later
- [x] Confirm whether "Nano Banana" is accessed directly via API or via a wrapper/provider SDK already chosen. (Gemini API image generation model)
- [x] Confirm if "Print to PDF" is required in MVP or deferred. (Included in MVP)

## Phase 2 Execution Order (with feedback checkpoints)

### 1. Project Initialization & Folder Structure

- [x] Review current scaffold (`src/app`, Tailwind v4, TS config, lint setup).
- [x] Define folder structure for features and reusable UI:
  - [x] `src/components/ui` (library components)
  - [x] `src/components/magic-story` (app-specific UI)
  - [x] `src/lib` (helpers, API clients, validators)
  - [x] `src/types` (shared TS types)
  - [x] `src/app/api/story/route.ts` (story generation endpoint)
  - [x] `src/app/story/page.tsx` or dynamic route for result view
- [x] Add environment variable placeholders and docs (`.env.local.example`):
  - [x] `GEMINI_API_KEY`
  - [x] `NANO_BANANA_API_KEY` (or provider equivalent)
- [x] Add base type definitions for form data and generated story payload.
- [x] Add utility functions for prompt-building and request validation scaffolding.
- [x] Feedback checkpoint: confirm structure and naming before UI work.

### 2. Component Library Setup (Shadcn/UI or Magic UI)

- [x] Set up component foundation (local shadcn-style primitives fallback; CLI install deferred due local Node runtime issue).
- [x] Add playful base primitives with rounded styles:
  - [x] `Button`
  - [x] `Card`
  - [x] `Input`
  - [ ] `Textarea` (if needed)
  - [x] `Tabs` / segmented control for age group
  - [x] `RadioGroup` or selectable cards for story style
  - [x] `Progress` / loading indicator
- [x] Define global design tokens in `globals.css` (soft primary palette):
  - [x] Yellow
  - [x] Sky Blue
  - [x] Mint Green
  - [x] Neutral background / text colors for readability
- [x] Add playful typography (e.g., `Fredoka` or `Quicksand`) via Next font setup.
- [x] Create shared visual styles:
  - [x] Large button variants
  - [x] Bubbly corner radius tokens
  - [x] Soft shadow utilities
  - [x] Focus/keyboard-visible states for accessibility
- [x] Feedback checkpoint: approve visual direction before building full pages.

### 3. UI Layout & Navigation (Landing + App Flow Shell)

- [x] Replace starter homepage with kid-friendly landing page.
- [x] Build hero section:
  - [x] App title/logo area ("MagicStory")
  - [x] Short value proposition for parents/kids
  - [x] "Create My Story" CTA button
  - [x] Decorative playful background elements/shapes
- [x] Add basic page layout structure:
  - [x] Header branding
  - [x] Main content container
  - [x] Optional footer/safety note
- [x] Create route(s) for story creation and story reading:
  - [ ] Option A: single-page flow with sections
  - [x] Option B: `/create` + `/story` pages (recommended for clarity)
- [x] Add navigation behavior from landing CTA to creator flow.
- [x] Ensure mobile-first responsive layout and large tap targets.
- [x] Feedback checkpoint: approve structure/navigation before form logic.

### 4. Story Creator Form (Inputs + Photo Upload Logic)

- [x] Build form UI with React hooks/state:
  - [x] Photo upload area (drag/drop + click-to-upload)
  - [x] Age group segmented selector (`3-5`, `6-8`, `9-12`)
  - [x] Favorite character input
  - [x] Story style selection grid (`Space Adventure`, `Fairy Tale`, `Jungle Quest`, etc.)
  - [x] "Generate Story" submit button
- [x] Add client-side image preview and remove/reset action.
- [x] Validate form inputs before submit:
  - [x] Required photo
  - [x] Age group selected
  - [x] Character name length/safety checks
  - [x] Story style selected
- [x] Implement upload handling strategy (MVP):
  - [x] Convert image to base64 or `FormData` for API route submission
  - [x] File size/type checks (`png`, `jpg`, `webp`)
- [x] Add friendly inline validation messages.
- [x] Add loading state UX:
  - [x] Disabled form during generation
  - [x] Playful animation/progress indicator
  - [x] Rotating status messages ("Writing...", "Drawing...", etc.)
- [x] Feedback checkpoint: approve form UX before API integration.

### 5. API Route Setup (Gemini + Nano Banana)

- [x] Create `POST` API route for story generation (`src/app/api/story/route.ts`).
- [x] Implement request parsing and validation (multipart or JSON + base64).
- [x] Add prompt builder for Gemini text generation:
  - [x] Include age group tone/reading level
  - [x] Include favorite character
  - [x] Include selected story style
  - [x] Add safety-friendly constraints (kid-safe, positive, non-scary)
- [x] Integrate Gemini API call for story text.
- [x] Integrate Nano Banana image generation call:
  - [x] Pass style/context prompt
  - [x] Use child photo as reference input (if supported by selected endpoint)
  - [x] Handle output image URL/base64 response
- [x] Normalize response shape returned to frontend:
  - [x] `title`
  - [x] `storyText`
  - [x] `imageUrl` or `imageBase64`
  - [x] `metadata` (style, age group)
- [x] Implement robust error handling:
  - [x] Missing API keys
  - [x] Invalid image
  - [x] Provider timeout/rate limit
  - [x] Fallback user-friendly error messages
- [x] Add server logging (minimal, non-sensitive).
- [x] Feedback checkpoint: test API responses before story reader page integration.

### 6. Story Reader Page (Result Display + Optional Print to PDF)

- [x] Build result page/layout to display generated story:
  - [x] Story title
  - [x] Large AI-generated illustration
  - [x] Easy-to-read story text blocks
  - [x] Metadata badges (style, age group)
- [x] Implement frontend flow from form -> API -> reader page:
  - [x] Pass response via route state, query, or local storage/session storage
  - [x] Handle refresh/no-data fallback gracefully
- [x] Add "Create Another Story" action.
- [x] Add optional "Print to PDF" support:
  - [x] Browser print stylesheet (`@media print`) for clean output
  - [x] Print button using `window.print()`
  - [x] Hide non-essential UI in print mode
- [x] Add loading/error/empty states on reader page.
- [x] Feedback checkpoint: approve end-to-end MVP flow and print behavior.

### 7. QA, Polish, and Handoff (Final pass after all major tasks)

- [ ] Test core flow on desktop and mobile viewport sizes.
- [x] Verify accessibility basics:
  - [x] Labels and keyboard navigation
  - [x] Focus states
  - [x] Color contrast for legibility
- [x] Confirm environment setup docs and run instructions in `README.md`.
- [ ] Optional polish:
  - [x] Animated background accents
  - [ ] Story page entrance animation
  - [ ] Saved recent stories (future enhancement, not MVP)

## Deliverable Milestones (for step-by-step execution)

- [x] Milestone A: Structure + design system foundation
- [x] Milestone B: Landing page + navigation
- [x] Milestone C: Story creator form + upload UX
- [x] Milestone D: API integration (Gemini + Nano Banana)
- [x] Milestone E: Story reader + optional print to PDF
- [ ] Milestone F: QA + cleanup
