# Validation evidence

Date: 2026-09-11. Scope: `feature/connect-api-modernization`, based on main `a61ee9c`.

## Automated checks

- Baseline: 12 tests, build and lint passed.
- Current behavior suite: 54 tests in 12 files passed; final build, lint and diff checks passed.
- `nodes/shared/versionCompatibility.test.ts` runs n8n's actual parameter visibility/default resolution and expression engine for saved v1 strings and v2 locators. This is integration evidence for the installed `n8n-workflow@1.113.0`, not a browser/editor test.
- Request-builder tests cover document creation/moving/trashing, task creation/updating/deleting and document-scope reads, missing targets and invalid task states.
- Picker/mapping tests cover authentication/schema failures, empty lists, schema-derived relation labels, encoded path IDs, tokenized local paging, and mapped/selected update item IDs.
- `npm run check:docstrings` measures JSDoc for named TypeScript functions/methods/function-valued declarations under nodes and credentials. It excludes tests, declaration files and inline callbacks; minimum 80%. Final result: 62/62 documented (100%).

## Live Craft checks

The user designated a test connection in 1Password (item title
`craft-node-test-instance-api`). No credential values are included here.
The provided URL/key were loaded directly in memory from the CLI.

| Read-only request | Observed result |
|---|---|
| GET /connection | HTTP 403 |
| GET /folders | HTTP 403 |
| GET /documents | HTTP 403 |
| GET /collections | HTTP 403 |
| GET /tasks?scope=inbox | HTTP 403 |

These responses do **not** prove successful authentication or request/response
compatibility. The cause is unconfirmed. Follow-up credential retrieval failed
with `authorization timeout`; the user was asked to approve CLI access.
No test document/task was created, updated, moved or deleted. No production
content was changed. Live writes and readback remain unproven.

## n8n runtime/editor boundary

The user permitted `n8n.apps3k.com`. Read-only connected node-catalog inspection
found the installed apps3k Craft Documents and Daily Notes nodes at version 1.
The new v2 code was not deployed to that shared instance. Its catalog is not
proof that the branch works there.

An isolated loopback-only local n8n startup was attempted with a temporary user
folder and this branch's dist directory. The initial `npx n8n@latest` install
stalled in `@confluentinc/kafka-javascript` native dependency configuration and
was stopped. Direct startup from the interrupted install failed on the missing
`@n8n/expression-runtime` module. A separate installation without dependency
scripts is being evaluated; final status is recorded below. No editor E2E pass
is claimed from these attempts.

## Independent review

Terra reviewed Space operations and the integrated node contracts. Fixed findings:

- Space create destination belongs beside the documents array, not inside an item.
- Exactly one document operation selector is visible per version/scope.
- Folder picker excludes virtual destinations and propagates errors.
- v2 sibling-only block inserts no longer require a parent document in the editor.
- Collection paths encode direct IDs; list pickers expose subsequent local pages.
- Task state is `canceled`; document-scope task reads use `documentId`.
- Update/Delete task pickers expose their own scope/document context.

## Delivery constraint

GitHub Issues are disabled for `apps3k-com/n8n-nodes-craft`, while AGENTS.md and
the PR hook require a real closing issue reference. No issue number has been
invented and no hook disabled. Owner action is required to enable Issues or
explicitly change that requirement before a conforming PR can be created.
No merge, release, npm publish, or production package replacement was performed.
