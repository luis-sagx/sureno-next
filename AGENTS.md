# AGENTS.md

## Start here
- The active app is the repo root Next.js project (`package.json`, `src/`, `prisma/`). The `Sureno/` subdirectory is a separate legacy Flask app; ignore it unless a task explicitly targets it.
- Trust config and scripts over `README.md`. The README is partly stale: it still says Next.js 15, describes `src/actions/`, and uses `NEXT_PUBLIC_SITE_URL`; current code is Next 16.2.7, server actions live in `src/lib/actions/`, and Stripe checkout reads `NEXT_PUBLIC_BASE_URL`.

## Commands
- Package manager: pnpm 11 (`packageManager` in `package.json`, lockfile `pnpm-lock.yaml`). Settings live in `pnpm-workspace.yaml`; a new native dependency with install scripts must be approved in `allowBuilds` or `pnpm install` fails.
- `pnpm run dev` — Next dev server.
- `pnpm run lint`
- `pnpm run test` / `pnpm run test:run` / `pnpm run test:coverage`
- `pnpm run test:e2e` — Playwright; it auto-starts `pnpm run dev` on `http://localhost:3000`.
- `pnpm run build` / `pnpm run start`
- `pnpm run db:generate` / `pnpm run db:push` / `pnpm run db:migrate` / `pnpm run db:setup` / `pnpm run db:seed` / `pnpm run db:studio`
- There is no `pnpm run typecheck` script.
- There are no CI workflows under `.github/workflows`; local commands are the source of truth.

## Architecture
- App Router entrypoints: `src/app/layout.tsx` (fonts + `next-themes`, default dark), `src/app/page.tsx` (home), `src/app/admin/**`, `src/app/auth/**`, `src/app/api/webhooks/stripe/route.ts`.
- Route protection lives in `src/middleware.ts` and currently only matches `/admin/:path*` and `/checkout`.
- Domain and integration code lives under `src/lib/`: `actions/` (server actions), `supabase/` (SSR helpers + middleware adapter), `pricing.ts`, `payments.ts`, `stripe.ts`, `prisma.ts`.
- Feature components are grouped under `src/components/{admin,cart,catalog,checkout,home,layout,motion,product,three,ui}`.
- Client state is `src/store/cart.ts` (Zustand persisted cart).
- Unit/integration tests live beside source as `*.test.ts(x)`; Playwright specs live in `e2e/`.

## Data and env gotchas
- Copy `.env.example`. Prisma loads `DATABASE_URL` through `prisma.config.ts`; Supabase and Stripe keys are also required for auth and checkout flows.
- `src/lib/prisma.ts` uses `@prisma/adapter-pg`, not the default Prisma driver.
- `prisma/setup.ts` does **not** match the current Prisma schema or checkout code: it omits `payment_status`, `stripe_session_id`, and `paid_at`, and gives `payment_method` a different default. Verify DB setup before relying on `pnpm run db:setup`.
- There is no checked-in `prisma/migrations/` directory. Do not assume `pnpm run db:migrate` replays an existing migration history.

## Testing and UI gotchas
- Vitest runs in `jsdom`, and `vitest.setup.ts` mocks `IntersectionObserver`; keep that in place for `motion` / `whileInView` components.
- If you touch auth, checkout, admin routing, or Stripe webhook behavior, run Playwright in addition to unit tests.
- For UI work, consult `DESIGN.md` and `DESIGN-dark.md` before changing visual tokens or typography.
