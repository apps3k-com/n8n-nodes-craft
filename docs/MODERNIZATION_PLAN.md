# Connect API modernization

Date: 2026-09-11. Baseline: `a61ee9c` / package 2.3.1. Branch: `feature/connect-api-modernization`.

## Evidence and compatibility contract

Compare the current official [Selected Documents](https://connect.craft.do/api-docs/documents/), [Daily Notes](https://connect.craft.do/api-docs/daily-notes/), and [Space](https://connect.craft.do/api-docs/space) contracts separately. See [coverage matrix](CONNECT_API_COVERAGE.md). A Space-only operation is an extension, not a missing Selected Documents endpoint.

Keep saved node version 1 and string parameters supported. Introduce node version 2 for searchable list/direct-ID inputs. Default the Documents connection scope to Selected Documents; require an explicit Space selection for document lifecycle and folder discovery. This selection does not expand the credential's permissions.

## Implementation sequence

1. **Baseline and contracts:** inspect actual operation routing and schemas, current PRs, official n8n locator conventions; run baseline tests/build/lint. Baseline: 12 tests pass; build/lint pass. Issues are disabled in GitHub; PR #12 (issue templates) and #13 (dependency bump) are unrelated.
2. **Selection UX:** searchable document/collection locators with direct IDs, version-aware UI, string/locator normalization in custom hooks, client-side list paging without invented Craft pagination parameters. Show authentication/schema failures instead of empty dropdowns. Label related items using the target collection's schema.
3. **Functional extension:** Space document create/move/trash operations with named document/folder selection, folder discovery and documented list filters. Keep unsupported connection scopes out of the UI. Never execute writes against production.
4. **Behavior and reliability:** test resolved request bodies, selection errors, list pagination, dependent fields and version-1 compatibility; verify any contract mismatches found in the initial audit. Add repeatable docstring measurement (production TypeScript callables; minimum 80%).
5. **Integration and review:** run all tests, lint, build, docstring gate; independent review and fix findings. Attempt isolated local n8n execution/editor validation, distinguish contract fixtures from live Craft evidence. Update README, wiki and unreleased changelog.
6. **Delivery:** self-review and prepare PR to main. Do not merge, release, publish or modify production data. Use the owner-designated Plane Craft Nodes project (CRNO) as the authoritative tracker. Link CRNO-1/CRNO-2 in the PR and track outstanding live acceptance in CRNO-3. Read and address CodeRabbit findings.

## Validation boundaries

At preflight no test connection was provided. The user subsequently designated a Craft test connection and n8n.apps3k.com; see the resulting live checks and isolated local runtime evidence in VALIDATION.md. The connected production Craft tool is not a substitute for node credential tests. Unit/contract tests prove local behavior only. Live API observations require real read-only calls; writing tests require an explicitly designated test environment.

The committed pnpm lockfile installs dependencies, but pnpm 11 reports ignored dependency build scripts (`eslint-plugin-n8n-nodes-base`, `unrs-resolver`) and exits nonzero. Baseline tests/build/lint nevertheless pass; no dependency upgrades or policy changes are needed for these checks.

## Final implementation decisions

- Implemented versioned selectors, Space document organization, and folder discovery.
- User explicitly added full task support and designated n8n.apps3k.com plus a Craft test connection; implemented Space task CRUD and document scope with named task selection.
- Added optional named Collection Update Item selection while retaining mapped IDs by default.
- Independent review findings fixed; final gates and external-test constraints are in [VALIDATION.md](VALIDATION.md).
- Deferred folder mutations because of the published deletion-contract conflict, experimental comments, and richer block authoring; no speculative API pagination.
