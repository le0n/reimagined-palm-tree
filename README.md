// README.md
# DateDash

DateDash is a playful map companion that helps couples choose their next outing without the decision fatigue. Mix and match filters like radius, rating, cuisine, and vibe, then let the app suggest nearby spots—or gamble on a “Surprise us!” pick for serendipitous adventures.

## Features
- Map-first explore view powered by MapLibre GL JS (Mapbox compatible).
- Friendly landing page that funnels visitors into the explore experience.
- Mock data provider with a typed interface so real APIs can plug in later.
- Dynamic filters for radius, rating, cuisine, themes, and “open now.”
- Random suggestion drawer with call-to-action links to open locations in your favorite maps app.
- Light/Dark/DateDash theme toggle backed by daisyUI themes and local storage.
- Strict TypeScript, TailwindCSS, ESLint, Prettier, and Vitest configured out of the box.

## Tech Stack
- **Framework**: Next.js 15 App Router (TypeScript)
- **UI**: TailwindCSS + daisyUI
- **State Management**: Zustand store (with room for React Context fallback)
- **Maps**: MapLibre GL JS (client side)
- **Testing**: Vitest + React Testing Library
- **Deployment Target**: Vercel

## Getting Started
### Prerequisites
- Node.js 18.18+ or 20+
- pnpm 8 (enable via `corepack enable pnpm` if not installed)

### Installation
```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to explore the app.

## Available Scripts
- `pnpm dev` – run the Next.js development server.
- `pnpm build` – create a production build.
- `pnpm start` – start the production server locally.
- `pnpm lint` – lint the codebase with ESLint.
- `pnpm test` – execute unit tests with Vitest.
- `pnpm test:watch` – run tests in watch mode.
- `pnpm format` – format files with Prettier.

## Project Structure
```
src/
  app/
    layout.tsx            # Root layout with metadata, global shell, and navbar
    page.tsx              # Hero landing page
    explore/page.tsx      # Map, filters, and suggestion drawer
    api/
      places/route.ts     # Placeholder REST handler for fetching places
      suggest/route.ts    # Placeholder REST handler for surprise suggestions
  components/
    Navbar.tsx            # App navigation with CTA and theme toggle
    ThemeToggle.tsx       # Accessible theme switcher with persistence
    FiltersPanel.tsx      # Filter controls (radius, rating, cuisine, themes, open now)
    Map.tsx               # MapLibre GL JS component wrapper
    SuggestionDrawer.tsx  # Drawer showing the selected suggestion
    PlaceCard.tsx         # Reusable place detail card
  lib/
    places/
      mock.ts             # Mock place provider for local development
      types.ts            # Shared types for places and filters
      random.ts           # Random/weighted suggestion picking logic
      utils.ts            # Helpers for filtering, distance, formatting
    store.ts              # Zustand store wiring filters, state, and selection
  styles/
    globals.css           # Tailwind layers and global resets

tests/
  random.test.ts          # Unit tests for the suggestion picker
```

## Environment Variables
Configure map providers in `.env`:
```
NEXT_PUBLIC_MAP_PROVIDER=maplibre
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

- When `NEXT_PUBLIC_MAP_PROVIDER` is `maplibre`, MapLibre runs without an API key.
- Populate `NEXT_PUBLIC_MAPBOX_TOKEN` when switching to Mapbox.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is reserved for future geocoding/directions integrations.

## Testing
Run the test suite once components and logic are in place:
```bash
pnpm test
```
Add new test files under `tests/` (or alongside source files) to keep coverage close to the implementation.

## Deployment
- Ready for Vercel out of the box. Add the environment variables in the Vercel dashboard.
- For self-hosting, run `pnpm build` and `pnpm start` on your server.

## Roadmap Highlights
- Replace mock provider with real API integrations (Mapbox, Google Places, Yelp, etc.).
- Add persistence for favorite spots and past adventures.
- Layer in collaborative suggestion modes (weighted by both partners’ preferences).
- Introduce event/weather awareness to tailor recommendations.

Questions, ideas, or feedback? Open an issue and help shape the future of DateDash.
