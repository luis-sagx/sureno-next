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
- Supabase read-only inspection is authorized by the user; exact project and configured credential/session are still required before remote access. Schema writes require explicit scope confirmation for the exact target/session.
- Do not delete existing tables or data; document any schema change requiring a database operation before attempting it.
- Ignore generated client output; regenerate it through project scripts.
- Preserve the pre-existing untracked root `AGENTS.md`.

## Authorized scope

The user authorized analyzing and applying the corresponding local changes, including trying Supabase if applicable, and later explicitly authorized read-only Supabase inspection. The schema recommendation is to align Prisma with active app/seed/import flows and make bootstrap SQL consistent. Remote execution remains pending the exact Supabase target and configured credential/session; schema writes also need their scope confirmed.

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
- The existing Supabase database is not changed until its exact target and write operation are explicitly confirmed.

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
- [ ] P7-04: Verify the aligned local contract and apply any required Supabase schema change after explicit target/operation authorization.
  - Route: delegated direct for local verification; remote inspection cannot proceed until the user identifies the exact project and configured session.
  - RED: `GET /` returns 500/P2022 while the existing database lacks `categories.created_at`.
  - GREEN: pending. The local production build passes; an application request still needs a compatible database schema.
  - User authorized read-only Supabase inspection. Remote authorization pending: exact project and configured credential/session. A schema write still requires scope confirmation for that target/session.
  - Commit: pending.
  - RDD assessment: disabled/unmanaged (opt-in mode; no enabled state or tooling observed).

## Progress and next step

P7-01 through P7-03 local implementation work is committed; the production build and client generation pass. The dev server starts without the original Next module-resolution error, but `/` still returns P2022 against the configured database because `categories.created_at` is missing. `setup.ts` is for fresh databases and is not an existing-database migration. P7-04 remains open for database-backed verification and any authorized Supabase schema operation. The user selected `single-pr` and authorized read-only Supabase inspection; exact remote target and configured session remain pending, as does write scope confirmation.
