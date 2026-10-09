# Prisma 7 client generation

## Objective

Make the root Next.js app generate and import a Prisma 7 client before development starts, align Prisma's schema/bootstrap with the active app contract, and remove the stale Next development cache that surfaced as a missing `next/app.js` module.

## Problem and rationale

`@prisma/client` is installed at version 7.8.0, but `prisma/schema.prisma` has no generator or datasource provider. `src/lib/prisma.ts` imports from the compatibility package path, whose generated `.prisma/client/default` is absent. Next's reported `next/app.js` file exists on disk and resolves through Node; its error is emitted by the existing `.next/dev` output and should be checked after clearing that cache.

## Scope and constraints

- Add the Prisma 7 PostgreSQL datasource and generated-client configuration.
- Point all application, test, and database-script imports to the configured generated output.
- Make `prisma/schema.prisma` represent the models and fields used by active app, admin, checkout, webhook, seed, and import flows; align fresh-database setup SQL to the same contract.
- Generate the client before normal `dev`, `build`, and test commands.
- Clear `.next` and verify the development app starts.
- User authorized inspection and additive schema writes on Supabase project `ygxuoaheldmjaajipsfo` through the configured `DATABASE_URL`; no tables or data may be deleted.
- Do not delete existing tables or data; document any schema change requiring a database operation before attempting it.
- Ignore generated client output; regenerate it through project scripts.
- Preserve the pre-existing untracked root `AGENTS.md`.

## Authorized scope

The user authorized analyzing and applying local changes, then supplied Supabase project `ygxuoaheldmjaajipsfo`, authorized the configured `DATABASE_URL` session, and explicitly authorized inspection plus additive schema changes without data deletion. The local schema/bootstrap are being aligned with active app and data flows; remote metadata inspection is complete and the additive patch is pending.

## Routing and workflow

- Route: delegated direct.
- Trigger: initial implementation spans three non-trivial files; follow-up import migration spans 14 consumer files and used a bounded mapping plus writer.
- Feature forecast: about 430 authored changed lines including schema/bootstrap reconciliation. User selected `single-pr`: all feature work stays on this branch and is intended for one PR; the size heuristic does not split the work.
- TDD mode: enabled by the applicable session skill `/home/luissagnay/.agents/skills/test-driven-development/SKILL.md`; project runner: `npm run test:run` (Vitest 4.1.8). This configuration-only fix uses `npm run db:generate` as its focused RED/GREEN check.
- Engram mirror: pending; no Engram/memory tool is available in this session.
- Receipt-driven development: disabled/unmanaged; no active opt-in state or `gentle-ai` CLI was available in this environment.

## Acceptance criteria

- Prisma 7 client generation succeeds from the repository scripts.
- The Prisma runtime imports the generated client at the configured output.
- Starting `npm run dev` generates the client and clears the reported Next module-resolution error.
- `npm run build` completes TypeScript validation against the generated client.
- A fresh database created from the local setup script matches the Prisma schema and app contract.
- Supabase project `ygxuoaheldmjaajipsfo` is authorized for inspection and additive schema changes through the configured `DATABASE_URL`; no tables or data may be deleted.

## Checks

- `npm run db:generate`
- `npm run build` to confirm client generation and check application types. The sandboxed run could not fetch Google Fonts; rerunning with approved network access passed compilation, TypeScript, and static generation.
- `npm run dev`, then request `/` locally and inspect server output.
- `npm run db:setup` was not run: it executes SQL against `DATABASE_URL` and is a create-if-not-exists bootstrap, not an upgrade migration for the existing database.
- Vitest was not run in this pass.

## Tasks and evidence

- [x] P7-01: Configure and generate Prisma 7 client and wire the core runtime import.
  - Route: delegated direct (writer trigger: 3 implementation files).
  - RED: `npm run db:generate` failed because `schema.prisma` has no datasource, confirming the setup defect before edits.
  - GREEN: `npm run db:generate` generated Prisma Client 7.8.0 at `src/generated/prisma`; `git check-ignore src/generated/prisma/client.ts` confirmed generated output is ignored.
  - Additional schema correction: added inverse `Category.products` and `Brand.products` relation fields required by Prisma validation; these are client navigation fields and do not change database columns.
  - Commit: `88a6bf4` (`fix(prisma): configure Prisma 7 client generation`).
  - RDD assessment: disabled/unmanaged (opt-in mode; no enabled state or tooling observed).
- [ ] P7-02: Migrate remaining Prisma imports and verify build plus the root development route after clearing `.next`.
  - Route: delegated direct (mapping found 15 consumer files; writer trigger applies to multi-file import migration).
  - RED: `npm run build` compiled Next but TypeScript failed in `prisma/add-sureno-products.ts` because `Prisma` was imported from `@prisma/client`.
  - Implementation: migrated the remaining Prisma imports in 14 files and added client generation hooks for all test commands.
  - Build result: Next compiled, then TypeScript failed in `prisma/add-sureno-products.ts` because its `Product` updates use `volumeMl`, `abv`, and `stockStatus`, which are absent from the current Prisma model. This script/schema mismatch predates this import migration; no business-model changes were made.
  - Development result: `npm run dev` generated Prisma Client 7.8.0 and Next reported ready at `http://localhost:3000`. `GET /` returned 500 because the configured database lacks `categories.created_at` (`P2022`). No database was inspected or changed.
  - GREEN: pending database schema alignment and confirmation that `/` serves successfully.
  - Commit: `39e6e5c` (`fix(prisma): migrate imports to generated client`).
  - RDD assessment: disabled/unmanaged (opt-in mode; no enabled state or tooling observed).
- [x] P7-03: Reconcile the Prisma models and fresh-database setup SQL with the active app contract.
  - Route: delegated direct (mapping spans app actions, checkout/webhook, schema, bootstrap SQL, and data scripts).
  - RED: current `npm run build` fails typechecking on Product fields absent from `schema.prisma`; a clean development request fails on schema field `Category.createdAt` absent from the setup SQL/current database.
  - GREEN: `npm run db:generate` generated Prisma Client 7.8.0 and `npm run build` passed Next compilation, TypeScript, and static generation. The SQL bootstrap now describes the app models for fresh databases; it was reviewed but not executed against a database.
  - Database limitation: `npm run dev` previously started successfully but `GET /` returned P2022 because the connected database lacks `categories.created_at`. No existing database was altered.
  - Commit: `778e697` (`fix(prisma): align schema with app data contract`).
  - RDD assessment: disabled/unmanaged (opt-in mode; no enabled state or tooling observed).
- [ ] P7-04: Align the existing Supabase schema with the local app contract and verify the root route.
  - Route: delegated direct (writer trigger: Prisma schema, fresh-database setup, and an additive existing-database patch); remote action uses the explicitly authorized project/session.
  - RED: `GET /` returns 500/P2022 because `categories.created_at` is absent. Read-only metadata inspection of authorized project `ygxuoaheldmjaajipsfo`, with endpoint verification and a read-only transaction, confirmed additional schema drift: missing `categories.created_at`/`updated_at`, `brands.created_at`/`updated_at`, `products.wholesale_price`, `variants.cost`, `wholesale_tiers.created_at`, and table `about_sections`; database `orders.payment_status` is enum `PaymentStatus` (`PENDING`, `PAID`, `FAILED`) while Prisma currently models a string.
  - Implementation: added idempotent SQL patch `prisma/patches/20261009_add_missing_app_schema.sql`; updated Prisma and fresh-database bootstrap to use the already-existing `PaymentStatus` enum.
  - GREEN: `npm run db:generate` passed; `npm run build` passed compilation, TypeScript, and static generation. Applied the SQL patch in one transaction through the authorized `DATABASE_URL`; a read-only metadata query confirmed all seven missing columns and `about_sections` now exist. Started `npm run dev`; `GET /` returned HTTP 200 with no Prisma error in server output.
  - Safety: only schema metadata was inspected; patch added columns/table with defaults and did not delete tables or read/modify existing row values. Newly added non-null columns receive their declared defaults.
  - Authorization: user provided project `ygxuoaheldmjaajipsfo`, authorized use of the repo's configured `DATABASE_URL`, and explicitly authorized inspection plus additive schema writes without data deletion.
  - Commit: pending.
  - RDD assessment: disabled/unmanaged (opt-in mode; no enabled state or tooling observed).

## Progress and next step

P7-01 through P7-03 local implementation work is committed. P7-04's additive schema patch was applied to authorized Supabase project `ygxuoaheldmjaajipsfo`; Prisma client generation and production build pass, and the development route now returns HTTP 200. The user selected `single-pr`. `setup.ts` remains a fresh-database bootstrap, not an existing-database migration. The P7-04 work-unit commit and evidence update are pending.
