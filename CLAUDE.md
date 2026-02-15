# CLAUDE.md — Productivity Dashboard

## Project

Productivity Dashboard — a year-round daily productivity PWA by GuidedBarakah. React 19 + Vite 7, Tailwind CSS v4, IndexedDB persistence, offline-capable PWA.

## Commands

```bash
cd productivity-dashboard

npm run dev        # Start Vite dev server (localhost:5173)
npm run dev --host # Expose to local network (for phone testing)
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint (flat config)
```

## Architecture

### Tech Stack
- **React 19** with Vite 7, JSX (no TypeScript)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (uses `@theme` directive in CSS)
- **IndexedDB** via `idb` library — database: `productivity-dashboard-db` with 5 object stores
- **PWA**: `vite-plugin-pwa` with Workbox, `autoUpdate` + `skipWaiting` + `clientsClaim`
- **Routing**: React Router v7, BrowserRouter, lazy-loaded pages
- **Icons**: Lucide React
- **Font**: Plus Jakarta Sans (Google Fonts)
- **PDF export**: jsPDF + jspdf-autotable (dynamically imported)

### Data Layer (`src/lib/db.js`)

All user data persists in IndexedDB. The `idb` wrapper exposes: `getData`, `setData`, `getAllData`, `getSetting`, `setSetting`, `exportAllData`, `importAllData`, `clearAllData`.

**Object stores**: `settings`, `dailyPages`, `habits`, `goals`, `weeklyReviews`.

### Auto-Save Pattern (`src/hooks/useAutoSave.js`)

Every page uses `useAutoSave(storeName, id, defaultFactory)` which returns `{ data, update, loaded, showSaved }`. Calls to `update()` are debounced 500ms before writing to IndexedDB.

### Theming

Three themes: `teal` (default), `slate`, `earth`. Theme selection sets `data-theme` attribute on `<html>`. CSS custom properties in `src/index.css`. Gold accent (`#C9A84C`) is shared across all themes.

### Routing & Navigation

5-tab bottom nav: Home (`/`), Daily (`/daily/:date`), Habits (`/habits`), Reflect (`/reflect`), Settings (`/settings`).

Sub-routes: `/reflect/goals`, `/reflect/weekly/:weekOf`.

### Content Data (`src/lib/data.js`)

Static content arrays: `HADITHS` (30), `MUHASABAH` (30 reflection prompts), `MUHASABAH_QUESTIONS` (5 quick checks), `HABITS` (10 Sunnah habits), `SALAH_BLOCKS` (5 prayers), `SECTION_VERSES`. Also exports `getDefault*()` factory functions.

### Unlock System

Same GB-XXXX-XXXX code format as Ramadan Planner but with different secret key (`barakah2026dashboard`). Generate codes via `node scripts/generate-codes.js <count>`.

## Styling Conventions

- Theme colors via CSS custom properties (`var(--primary)`, etc.)
- Card pattern: `.card` wrapper + `.section-bar.section-bar-{variant}` header + `.card-body`
- Section bar variants: `primary`, `gold`, `olive`, `dark`, `secondary`
- Animations: `.animate-fade-in-up`, `.animate-fade-in`, `.animate-slide-in`
- Tailwind for layout, custom CSS for component styles

## Conventions

- No backend, no auth, no server — everything client-side
- Mobile-first responsive design (375-428px primary target)
- Page structure: geo-pattern hero header → max-w-2xl content → Footer
- Every input auto-saves — no manual save buttons
- Pushes to `main` will auto-deploy once Vercel is configured
