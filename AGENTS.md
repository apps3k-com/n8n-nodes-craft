# AGENTS.md — n8n-nodes-craft-apps3k

> **No hallucination.** Every assumption, plan, review and diagnosis is verified
> against the real codebase, the live API and connected third-party systems —
> never guessed. If a source is missing, **ask** instead of inventing.

**n8n-nodes-craft-apps3k** — n8n community-node package for Craft's Connect API
(two nodes: Craft Documents + Craft Daily Notes; blocks, collections, search,
tasks, file upload; usable as AI agent tools). Published to npm. Repo:
`apps3k-com/n8n-nodes-craft`. Independent fork of `n8n-nodes-craft` by Yigit Konur.

## Core rules (apps3k common workflow)

- **Language:** chat with the user = German. Code, comments, commits, PRs = English.
- **Memory:** only **apps3k-memory** (`https://mcp-auth.apps3k.com/mcp/apps3k-memory`).
  Search it before any work; if a memory references a GitHub issue, read it. Store
  after each step. If the MCP is down, tell the user, cache memories and add them
  later. Never store secrets (only 1Password paths).
- **Diagnose before assuming:** verify against the code, the Craft Connect API and
  n8n behaviour before claiming a cause.
- **Never** merge a PR to `main` or publish a release yourself. **Never** delete or
  modify data on production systems.
- **Hooks enforce this workflow:** Claude → `.claude/hooks/`, Codex → `.codex/hooks/`.

## Git workflow (main-only)

- One long-lived branch: **`main`**. Short-lived `feature/<scope>` (or `fix/`,
  `chore/`, `docs/`) branch from `main`; the PR targets `main`.
- **Project management:** GitHub Projects. **Conventional Commits**; the PR links its
  GitHub issue with a closing keyword (`Closes #N`); commit `(#N)` optional.
- **Self-review before a PR:** fix every issue found — including ones from earlier
  steps, not just the current diff.
- **CodeRabbit** reviews PRs against `main`: implement valid feedback + confirm,
  reject invalid feedback with reasoning, always mention `@coderabbitai`; push
  valid learnings to apps3k-memory.
- **Releasing:** this package versions/publishes via `n8n-node release` (release-it)
  + the `npm-publish.yml` workflow on push to `main`. Keep `CHANGELOG.md` and the
  README current at every release. The owner cuts releases, not the agent.
- **Docstring coverage >= 80%.**
- The PR to `main` is merged by the owner, not the agent.

## Commands

- `npm run dev` (`n8n-node dev`) · `npm run build` (`n8n-node build`) ·
  `npm run lint` / `npm run lint:fix` · `npm test` (`vitest run`) ·
  `npm run release` (`n8n-node release` — owner only)

## Detail references (read on demand — do not duplicate here)

| Topic | Where |
|---|---|
| Node/credential architecture | GitHub Wiki → `docs/wiki/Architecture.md` |
| Local build/test/release | GitHub Wiki → `docs/wiki/Development-Setup.md` |
| Code/commit/test conventions | GitHub Wiki → `docs/wiki/Conventions.md` |
| End-user guide (with screenshots) | https://craft-n8n.apps3k.com |
