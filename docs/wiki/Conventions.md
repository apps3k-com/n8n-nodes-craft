# Conventions

_Source: `AGENTS.md` / `CLAUDE.md` / `.claude/hooks/`. These are the binding
rules; this page is the human-readable summary._

## Language
- Chat with the user: **German**. Code, comments, commits, PRs: **English**.

## Git workflow (main-only)
- One long-lived branch **`main`**; short-lived `feature/<scope>` (or `fix/`,
  `chore/`, `docs/`) branches off `main`, PR targets `main`.
- Never commit/push/merge `main` directly; the **owner** merges PRs and cuts
  releases.

## Commits & PRs
- **Conventional Commits** (`type(scope): subject`).
- Every commit and PR carries the plane.so **work-item ID**; the **PR title**
  references the main work item in **square brackets** `[<ID>]` (links the PR for
  status sync). Secondary items are mentioned without brackets.
- Enforced by `.claude/hooks/` (commit-guard, push-guard, pr-validate, …).

## Review
- **Self-review before every PR** — fix issues from earlier steps too.
- **CodeRabbit** reviews PRs to `main`; address valid feedback, reject invalid
  feedback with reasoning, always mention `@coderabbitai`.

## Code style
- TypeScript, `strict` n8n node mode. Lint via `n8n-node lint`; Prettier in the
  repo. **Docstring coverage >= 80%.**

## Releases
- `n8n-node release` (release-it) handles version/tag/npm-publish; the
  `npm-publish.yml` workflow publishes on push to `main`. Keep `CHANGELOG.md` and
  the README current.
