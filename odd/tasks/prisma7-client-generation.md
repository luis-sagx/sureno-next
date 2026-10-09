# Prisma 7 client generation

## Objective

Make the root Next.js app generate and import a Prisma 7 client before development starts, and remove the stale Next development cache that surfaced as a missing `next/app.js` module.

## Problem and rationale

`@prisma/client` is installed at version 7.8.0, but `prisma/schema.prisma` has no generator or datasource provider. `src/lib/prisma.ts` imports from the compatibility package path, whose generated `.prisma/client/default` is absent. Next's reported `next/app.js` file exists on disk and resolves through Node; its error is emitted by the existing `.next/dev` output and should be checked after clearing that cache.

## Scope and constraints

- Add the Prisma 7 PostgreSQL datasource and generated-client configuration.
- Point all application, test, and database-script imports to the configured generated output.
- Generate the client before normal `dev` and `build` commands.
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
- Starting `npm run dev` generates the client and serves `/` without the reported Prisma or Next module errors.
- No database migration or schema push is performed.

## Checks

- `npm run db:generate`
- `npm run build` to confirm the build lifecycle generates the client.
- `npm run dev`, then request `/` locally and inspect server output.
- No Vitest test is planned for this configuration-only change; report any additional check that becomes necessary.

## Tasks and evidence

- [x] P7-01: Configure and generate Prisma 7 client and wire the core runtime import.
  - Route: delegated direct (writer trigger: 3 implementation files).
  - RED: `npm run db:generate` failed because `schema.prisma` has no datasource, confirming the setup defect before edits.
  - GREEN: `npm run db:generate` generated Prisma Client 7.8.0 at `src/generated/prisma`; `git check-ignore src/generated/prisma/client.ts` confirmed generated output is ignored.
  - Additional schema correction: added inverse `Category.products` and `Brand.products` relation fields required by Prisma validation; these are client navigation fields and do not change database columns.
  - Commit: pending.
  - RDD assessment: disabled/unmanaged (opt-in mode; no enabled state or tooling observed).
- [ ] P7-02: Migrate remaining Prisma imports and verify build plus the root development route after clearing `.next`.
  - Route: delegated direct (mapping found 15 consumer files; writer trigger applies to multi-file import migration).
  - RED: `npm run build` compiled Next but TypeScript failed in `prisma/add-sureno-products.ts` because `Prisma` was imported from `@prisma/client`.
  - GREEN: pending.
  - Commit: pending.
  - RDD assessment: disabled/unmanaged (opt-in mode; no enabled state or tooling observed).

## Progress and next step

Exploration confirmed the missing generated Prisma client and found that `next/app.js` and its target exist. The user approved the bounded design. A feature branch has been created. P7-01 is implemented and generation is green. Build verification exposed remaining imports across application, test, and database-script files; P7-02 tracks that follow-up before `.next` cleanup and route verification.
