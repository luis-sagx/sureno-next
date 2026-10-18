# Admin orders table rendering

## Objective

Restore `/admin/orders` by keeping database access in the server page and moving the interactive table callbacks into a client component.

## Problem and rationale

The server-rendered orders page passes column `render` functions and an `onPageChange` callback to `DataTable`, which is a Client Component. Next.js rejects those function props during serialization and returns HTTP 500. The root `/admin` redirect to `/admin/orders` and Supabase sign-in are working.

## Scope and constraints

- Keep order queries, summary calculations, and URL search parameter handling in the server page where possible.
- Move the order column renderers and pagination callback into an interactive Client Component. Pass only serializable rows and pagination values across the boundary.
- Preserve existing table appearance and pagination behavior.
- Do not change authentication, database behavior, design tokens, or the unrelated `ThemeProvider` console warning.

## Authorized scope

The user explicitly requested the orders-page fix after the failure was diagnosed.

## Routing and workflow

- Route: delegated direct.
- Trigger: the fix changes the server orders page and adds a non-trivial client table component; the mandatory writer trigger applies.
- Feature branch: `fix/admin-orders-table-render`.
- Forecast: about 340 authored changed lines; delivery strategy: `ask-on-risk` (default).
- TDD mode: enabled by `/home/luissagnay/.agents/skills/test-driven-development/SKILL.md`; project runner: `pnpm run test:run`. The active higher-priority instruction prohibits adding or running tests unless the user asks to test or verify, so test steps are pending and will not be run in this task.
- Engram mirror topic: `odd/admin-orders-table-render/tasks`.
- Receipt-driven development: unavailable; `gentle-ai` is not installed in this environment.

## Acceptance criteria

- `/admin/orders` no longer passes functions from the Server Component to `DataTable`.
- Order cell rendering and pagination continue to work through the client component.
- The server page continues to supply database-backed rows and summary data.
- Applicable lint/build checks pass; any unavailable checks are recorded.

## Tasks

- [x] AOT-01 (delegated): move order table renderers and pagination into a client component, keeping server data loading in the page.
  - Implementation: `OrdersTable` owns the cell renderers and pagination callback. The server page passes a minimal DTO with `createdAt` as ISO text and `total` as a number. The filter reset uses Next `Link`.
  - Initial build exposed the Prisma `Decimal` type retained by `serializeDecimal<T>`; the server now explicitly converts the table DTO fields before crossing the client boundary.
  - Targeted lint: `pnpm exec eslint src/app/admin/orders/page.tsx src/components/admin/OrdersTable.tsx` passed.
  - Build: `pnpm build` passed, including Next compilation and TypeScript.
  - Full lint: `pnpm lint` still fails on five existing errors: two in `src/app/admin/inventory/page.tsx`, two in `src/app/admin/users/UserDirectoryClient.tsx`, and one in `src/components/admin/UserDetailDrawer.tsx`. The changed files pass targeted lint.
  - Tests: not run and not added under the active higher-priority instruction; TDD RED/GREEN evidence remains unavailable.
  - Commit: pending.

## Progress and verification

- Root cause confirmed from the runtime error and source: `src/app/admin/orders/page.tsx` passes function-valued columns and a callback to `src/components/ui/DataTable.tsx`, which starts with `use client`.
- `/admin` redirects to `/admin/orders` by design. The 500 occurs when the orders table props cross the Server/Client boundary.
- RED/GREEN test evidence: pending; tests were not authorized by the active instruction.
- Engram save #33 succeeded; read-back verification is pending because the sandbox denied access to the Engram instance lock during export.
- Commit: pending.
- RDD assessment: unavailable (`gentle-ai` command not found).

## Next step

Commit the verified AOT-01 work unit and record its commit identity; retry Engram read-back if approved.
