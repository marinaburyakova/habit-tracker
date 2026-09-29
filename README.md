# Habit Tracker

<<<<<<< HEAD
![CI](https://github.com/marinaburyakova/habit-tracker/actions/workflows/ci.yml/badge.svg)

A minimal, dark-first habit tracker with streaks, achievements, and a month calendar. Built with **Next.js 16**, **React 19**, **TypeScript**, and **Zustand**.


---

## Screenshots

### Onboarding

![Onboarding — first slide](./public/screenshots/onboarding.png)

### Light theme

![Main screen — light theme with dial and habit list](./public/screenshots/light.png)

### Dark theme

![Main screen — dark theme](./public/screenshots/dark.png)
![Main screen — delete](./public/screenshots/delete.png)

---

## Features

- **Onboarding** — 3-slide intro with PNG art, shown only on the first visit
- **Two themes** — light and dark, FOUC-free hydration via inline script + Zustand `persist`
- **Streak dial** — Apple Watch-style segmented dial with gradient ring and glow
- **Habit list** — one row per habit, tap the check to mark done
- **Quick stats** — total habits, done today, completion progress bar
- **Week strip** — 7-day rolling window around today, today highlighted
- **Achievements** — next milestone card with 3D badge art
- **Month calendar** — expandable per habit, navigable months, today highlighted
- **Confirm dialog** — native `<dialog>` for deletion
- **Keyboard accessible** — Enter/Space to toggle, Esc to close dialog, ARIA labels
- **Reduced motion** — respects `prefers-reduced-motion`

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript (strict) |
| State | Zustand 5 + `persist` (`skipHydration`, manual `rehydrate`) |
| Styling | CSS Modules + CSS variables (two themes) |
| Fonts | Jost (via `next/font/google`) |
| Icons | lucide-react |
| Tests | Vitest + Testing Library + jsdom |
| CI | GitHub Actions (lint · typecheck · test · build) |

---



## Architecture Decisions

### One route, many states

Habit Tracker has **one URL**: `/`. Everything else — onboarding, main screen, expanded habit, open modal — is **local UI state** (Zustand or `useState`). This is intentional:

- No auth → no route groups.
- No server data → no `fetch`, no Server Actions.
- No sharing → no URL-driven state (except theme, which persists in `localStorage`).

This keeps the app small and fast. **Adding routes** would mean adding **page-level concerns** (loading, error, metadata) that don't apply here.

### Zustand with `skipHydration`

The app is client-only, but Next.js still renders it on the server first. `localStorage` is unavailable on the server — a naive `useState(() => localStorage.getItem(...))` causes **hydration mismatch**.

The pattern used everywhere:

1. `persist(..., { skipHydration: true })` — store is created **empty** on both server and client.
2. `mounted` is read via `useSyncExternalStore` — `false` on server, `true` on client.
3. Until `mounted`, the UI renders a **placeholder**.
4. After mount, `useHabitsStore.persist.rehydrate()` reads `localStorage` once.

This is the **standard SSR-safe pattern** for client state in Next.js. No `setState` in `useEffect` (React 19 warns about that), no hydration mismatch.

### Two themes, no FOUC

The theme (light/dark) is stored in Zustand + `persist`. To avoid a flash of the wrong theme:

- An **inline `<script>` in `<head>`** reads `localStorage` **before** the first paint and sets `data-theme` on `<html>`.
- `ThemeApplier` syncs the store → DOM **after** mount (only if the user toggles).

Result: no flicker on load, no hydration mismatch.

### UTC everywhere

All dates are **UTC strings** (`YYYY-MM-DD`). Functions use `getUTCFullYear` / `getUTCMonth` / `getUTCDate`, never local variants. Formatting uses `Intl.DateTimeFormat` with an explicit `timeZone`.

Why: mixing local and UTC in a calendar or streak calculation produces off-by-one-day bugs that only show up around midnight in some timezone. UTC everywhere is boring but correct.

### Pure logic in `lib/`

`habits.ts` and `date-utils.ts` contain **only pure functions**. No React, no Zustand, no side effects. This makes them:

- Trivial to test (see below).
- Reusable on the server (if we ever add SSR).
- Easy to reason about (input → output).

---

## Testing

```bash
npm test              # watch mode
npm run test:run      # single run
npm run test:coverage # coverage report
```

Coverage targets: **100% statements** for `lib/` and `stores/`, **80%+ branches**.



## Roadmap

### UX
- [ ] Habit icons (emoji / PNG) — currently text-only
- [ ] Swipe to delete a habit row
- [ ] Drag to reorder habits
- [ ] Roving tabindex for the calendar (WAI-ARIA grid pattern)
- [ ] Toast after delete (undo instead of confirm dialog)
- [ ] Import / export JSON
- [ ] Weekly / monthly statistics view

### Architecture
- [ ] IndexedDB for larger datasets
- [ ] Optional backend sync (auth + cloud)
- [ ] Habit categories and tags
- [ ] Web Notifications for daily reminders

### Testing
- [ ] E2E test for the full flow — Playwright
- [ ] Visual regression tests
- [ ] Coverage gate in CI (>80%)

---

## Author

**Marina Dev** — Fullstack Developer  
GitHub: [@marinaburyakova](https://github.com/marinaburyakova)  
Portfolio: [mint-apps.com](https://portfolio.mint-apps.com)
=======
A personal habit tracker built with **Next.js 16**, **React 19**, and **TypeScript**.

Track daily habits, build streaks, and stay motivated with milestone badges.
![CI](https://github.com/marinaburyakova/habit-tracker/actions/workflows/ci.yml/badge.svg)

![Habit Tracker](./public/screenshots/habits.png)

## Features

- **Track habits** — create, complete, and delete habits
- **Weekly grid** — mark any of the last 7 days
- **Streak tracking** — current streak with soft recovery (a missed day doesn't reset until tomorrow)
- **Motivation badges** — milestones at 1, 2, 3, 5, 7, 14, 30 days
- **Cascade delete** — removing a habit removes all its completions
- **Accessibility** — ARIA attributes, `prefers-reduced-motion` support
- **Dark theme** — comfortable for daily use

## Tech Stack

| Layer        | Tech                       |
| ------------ | -------------------------- |
| Framework    | Next.js 16 (App Router)    |
| UI           | React 19                   |
| Language     | TypeScript (strict)        |
| Styling      | CSS Modules                |
| Architecture | Server + Client Components |

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout
    page.tsx                # Server Component — static shell
    globals.css             # Global styles
  components/
    HabitTrackerClient.tsx  # Client Component — state + logic
    HabitList.tsx           # Renders list of habits
    HabitItem.tsx           # Single habit card
    WeekGrid.tsx            # 7-day grid
    MotivationBadge.tsx     # Milestone badge
    AddHabitForm.tsx        # New habit form
    Button.tsx              # Reusable button
  lib/
    habits.ts               # Pure functions — all business logic
```

## Architecture Decisions

### Server vs Client Components

`page.tsx` is a **Server Component** — it renders the static shell (`<h1>`, layout) on the server.

`HabitTrackerClient` is the **only** Client Component boundary. Everything below it is client too. This keeps JS bundle small and the initial HTML server-rendered.

### Pure functions in `lib/habits.ts`

All business logic lives in **pure, testable functions**:

- `formatDate`, `parseDate`, `daysBetween` — date utilities (UTC-based)
- `addCompletion`, `removeCompletion`, `toggleCompletion` — immutable state updates
- `calculateStreak`, `longestStreak`, `getCompletionRate` — analytics
- `getMotivation` — milestone messages

These functions **never mutate** their inputs. React can rely on reference equality to detect changes.

### Soft streak

If you complete a habit today, streak counts today. If you miss today but completed yesterday, streak stays alive until end of day — no accidental reset.

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Install

```bash
git clone <repo-url> habit-tracker
cd habit-tracker
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## What's Next

- [ ] Persist data in `localStorage`
- [ ] Migrate to PostgreSQL + Prisma
- [ ] Yearly heatmap view
- [ ] Analytics dashboard
- [ ] Light / dark theme toggle
- [ ] PWA for offline use

## Author

**Marina Dev** — Fullstack Developer

- GitHub: [@marinaburyakova](https://github.com/marinaburyakova)
- Portfolio: [mint-apps.com](https://mint-apps.com)

## License

MIT
>>>>>>> bd87b9c1badc72757f5b2135981fde4c88ba3a43
