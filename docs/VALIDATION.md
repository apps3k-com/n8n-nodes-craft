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
The URL/key were loaded directly into process memory using the existing
1Password service account. `op whoami` confirmed `SERVICE_ACCOUNT`; no desktop
approval is needed. No credential values are included in logs or this report.

The initial Python urllib requests returned HTTP 403. Follow-up response
inspection identified Cloudflare Error 1010 (`browser_signature_banned`).
Node.js native fetch with the same URL/key returned HTTP 200 for all five
read-only requests below. The earlier 403 was not proof of invalid credentials.

| Read-only request | Observed result |
|---|---|
| GET /connection | HTTP 200; space, utc and urlTemplates present |
| GET /folders | HTTP 200; 8 root entries |
| GET /documents | HTTP 200; 510 documents |
| GET /collections | HTTP 200; 23 collections |
| GET /tasks?scope=inbox | HTTP 200; empty inbox |

The compiled branch's actual load-options/search functions were then invoked
with a minimal n8n context adapter backed by Node.js fetch and the live API:

- Document picker: 510 unique IDs across 6 pages; every result has a label.
- Folder picker: 9 flattened entries; virtual trash/templates/unsorted excluded.
- Collection picker: 23 entries.
- Task picker: active, upcoming, inbox, logbook, and document scopes all succeeded
  with empty results. Document scope used an ID from the live document picker.

These checks prove live read-response compatibility and picker transformations,
not execution through the shared n8n runtime. Empty task responses do not prove
mapping of populated live tasks. No document/task was created, updated, moved
or deleted. Live writes and readback remain unproven.

## n8n runtime/editor boundary

The user permitted `n8n.apps3k.com`. Read-only connected node-catalog inspection
found the installed apps3k Craft Documents and Daily Notes nodes at version 1.
The new v2 code was not deployed to that shared instance. Its catalog is not
proof that the branch works there.

An isolated loopback-only local n8n startup was attempted with a temporary user
folder and this branch's dist directory. The initial `npx n8n@latest` install
stalled in `@confluentinc/kafka-javascript` native dependency configuration and
was stopped. Direct startup from the interrupted install failed on the missing
`@n8n/expression-runtime` module. Recovery succeeded: installed n8n 2.38.7 under Node 24.19.0 with dependency
scripts disabled, rebuilt only sqlite3, then started on 127.0.0.1:5689.
Health check returned `{status:"ok"}`. The browser loaded Craft Documents v2,
its document locator, explicit Space selector, Task CRUD, scoped task picker
and From List/By ID modes. This is a local editor smoke check, not a Craft
live-write test.

`scripts/runtime-smoke.cjs` then imported fixture-only credentials and a
workflow into a separate temporary n8n profile. Ten steps executed successfully:
folder listing with its default operation, document create/move/trash, task
add/document-scoped get/update/delete, selected collection-row update, and a
legacy v1 collection read. The loopback server checked Bearer authentication;
the harness asserted exact request methods, query keys and bodies. No network
request in this fixture workflow targets Craft.

Reproduce after building the package, using a Node version supported by the
installed n8n:

```sh
N8N_BINARY=/absolute/path/to/n8n/bin/n8n node scripts/runtime-smoke.cjs
```

The script uses a random loopback HTTP port, a temporary n8n profile, and task
broker port 5691 (must be free). It prints the evidence directory containing
execution logs and synthetic request captures. Credentials contain only the
literal `fixture-only`; never replace them with production credentials.

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

The owner designated [Plane Craft Nodes](https://plane.apps3k.com/apps3k/projects/dfb3aaf5-3acc-4aa7-ba52-0fd9c2589ad6/issues/) as the authoritative tracker.
AGENTS.md, shared PR guards and wiki now require a direct issue URL from that
project rather than a GitHub closing reference. CRNO-1 tracks implementation,
CRNO-2 tracks this workflow migration, and CRNO-3 tracks remaining live acceptance.
No merge, release, npm publish, or production package replacement was performed.
