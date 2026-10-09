# Prisma 7 client generation

## Objective

Make the root Next.js app generate and import a Prisma 7 client before development starts, and remove the stale Next development cache that surfaced as a missing `next/app.js` module.

## Problem and rationale

`@prisma/client` is installed at version 7.8.0, but `prisma/schema.prisma` has no generator or datasource provider. `src/lib/prisma.ts` imports from the compatibility package path, whose generated `.prisma/client/default` is absent. Next's reported `next/app.js` file exists on disk and resolves through Node; its error is emitted by the existing `.next/dev` output and should be checked after clearing that cache.

## Scope and constraints

- Add the Prisma 7 PostgreSQL datasource and generated-client configuration.
- Point all application, test, and database-script imports to the configured generated output.
- Generate the client before normal `dev`, `build`, and test commands.
- Clear `.next` and verify the development app starts.
- Preserve existing database models and mappings; relation navigation fields needed for Prisma validation are allowed. Do not migrate/push the database or alter external services.
- Ignore generated client output; regenerate it through project scripts.
- Preserve the pre-existing untracked root `AGENTS.md`.

## Authorized scope

The user approved this design: configure Prisma 7, generate before `dev`, clear `.next`, and check startup.

## Routing and workflow

- Route: delegated direct.
- Trigger: implementation spans three non-trivial files (`prisma/schema.prisma`, `src/lib/prisma.ts`, and `package.json`); delegate one bounded writer.
- Feature forecast: about 35 authored changed lines, below the ~400-line delivery budget; strategy `ask-on-risk`.
- TDD mode: enabled by the applicable session skill `/home/luissagnay/.agents/skills/test-driven-development/SKILL.md`; project runner: `npm run test:run` (Vitest 4.1.8). This configuration-only fix uses `npm run db:generate` as its focused RED/GREEN check.
- Engram mirror: pending; no Engram/memory tool is available in this session.
- Receipt-driven development: not assessed; `gentle-ai` CLI is unavailable in this environment.

## Acceptance criteria

- Prisma 7 client generation succeeds from the repository scripts.
- The Prisma runtime imports the generated client at the configured output.
- Starting `npm run dev` generates the client and clears the reported Next module-resolution error.
- Serving `/` requires the configured database to match the Prisma schema.
- No database migration or schema push is performed.

## Checks

- `npm run db:generate`
- `npm run build` to confirm client generation and check application types.
- `npm run dev`, then request `/` locally and inspect server output.
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
  - Commit: pending.
  - RDD assessment: disabled/unmanaged (opt-in mode; no enabled state or tooling observed).

## Progress and next step

P7-01 is committed and Prisma client generation is green. All remaining imports now target the generated client. Clearing `.next` removed the original Next module error, and the dev server starts. The root route remains blocked by the configured database missing `categories.created_at`; the production build also exposes an existing mismatch between `prisma/add-sureno-products.ts` and the current Product model. Both follow-ups require scope decisions; no database operation has been authorized.
