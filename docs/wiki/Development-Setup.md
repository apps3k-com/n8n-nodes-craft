# Development Setup

_Source: `package.json`, `README.md`. Verify against the repo before relying on
details here._

## Prerequisites

- Node.js — see `engines` in `package.json` (`>=20.15.0`)
- A package manager (the repo uses **pnpm**; `pnpm-lock.yaml` is committed)
- [`jq`](https://jqlang.github.io/jq/) — required by the `.claude/hooks/` git
  guards (they parse the tool input as JSON); the informational hooks degrade
  gracefully if it's missing.
- A Craft Connect API URL + key to test the nodes against a live space.

## Install & develop

```shell
pnpm install
npm run dev      # n8n-node dev — runs the nodes in a local n8n for iteration
```

## Quality gates (run before a PR)

```shell
npm run lint     # n8n-node lint   (npm run lint:fix to autofix)
npm test         # vitest run
npm run build    # n8n-node build → dist/
```

## Releasing (owner only)

```shell
npm run release  # n8n-node release (release-it): version bump + tag + npm publish
```

Pushing to `main` also triggers `.github/workflows/npm-publish.yml` (skips
markdown/docs-only changes). Keep `CHANGELOG.md` + `README.md` current at each
release.

## Using as AI agent tools

Set `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` on the n8n host so the nodes can
be used as agent tools.
