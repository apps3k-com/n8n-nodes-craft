# 07 · Architecture and development

The package is TypeScript built with @n8n/node-cli. CraftDocuments and CraftDailyNotes contain the node definitions, resources and load-options methods. nodes/shared holds shared mapping and UI helpers; credentials contains the two authentication definitions. Build output is dist/.

Credentials send Authorization: Bearer with the API key and use the configured connection base URL. Keep Selected Documents, Daily Notes and Space contracts separate; a Space-only endpoint is not a missing Selected Documents capability.

Use the Node.js version supported by the installed n8n runtime. package.json declares >=20.15.0; the isolated n8n 2.38.7 check used Node 24.19.0. The repository commits pnpm-lock.yaml. Install dependencies with pnpm install and investigate ignored dependency build scripts instead of changing trust policies blindly.

Before a PR run npm test, npm run build, npm run lint, npm run check:docstrings and bash .claude/hooks/guard-tests.sh. The JSDoc gate measures named production callables with a minimum of 80%.

npm run dev is an optional local development launcher. No local service is assumed. scripts/runtime-smoke.cjs uses a temporary profile and a loopback fixture; N8N_BINARY must point to an installed n8n executable. It uses synthetic credentials and must not be repurposed as a production write test.

Preserve saved v1 parameter and expression behavior when extending v2. Validate request bodies, error propagation and resource selection against the real API and n8n behavior. Read docs/CONNECT_API_COVERAGE.md and docs/VALIDATION.md for the current contract and evidence boundaries.
