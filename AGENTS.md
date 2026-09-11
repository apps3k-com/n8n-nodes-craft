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
  The Craft wiki and its repository counterparts are maintained in German and English.
- **Memory:** only **apps3k-memory** (`https://mcp-auth.apps3k.com/mcp/apps3k-memory`).
  Search it before any work; if a memory references a work item, read it. Store
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
- **Project management:** [Plane Craft Nodes](https://plane.apps3k.com/apps3k/projects/dfb3aaf5-3acc-4aa7-ba52-0fd9c2589ad6/issues/) is authoritative
  (workspace `apps3k`, project `dfb3aaf5-3acc-4aa7-ba52-0fd9c2589ad6`, prefix `CRNO`).
  Create and maintain work items there; GitHub Issues/Projects are not required.
- **Conventional Commits**; every PR must include a direct Plane issue URL from
  this project and its `CRNO-N` identifier. Link the PR back to the Plane issue.
  GitHub closing keywords are not required and do not close Plane work items.
  Keep items open until their acceptance criteria are verified; commit IDs are optional.
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

## Documentation workflow and audience boundary

- The wiki lives in the existing Craft pages: [Deutsch](craftdocs://open?blockId=7BB4EA02-A628-45A2-BC16-539C59724748&spaceId=795ef48a-f554-14a8-afa5-a503c41068a6) and [English](craftdocs://open?blockId=F04E0ABB-8657-47F4-8350-A20206E0A6FB&spaceId=795ef48a-f554-14a8-afa5-a503c41068a6).
  Space: `795ef48a-f554-14a8-afa5-a503c41068a6`. Preserve these page IDs and their language assignment.
- These German/English handbooks, README, CHANGELOG and `docs/` are public.
  Include product usage and generic examples only. Never publish internal hosts,
  account/vault identifiers, credential procedures, private tracker references,
  customer inventory, deployment logs or organization-specific runbooks there.
- Internal operations, architecture/runbooks, access procedures and detailed test
  evidence belong only in [Internal Documentation](craftdocs://open?blockId=D74221B9-E838-4693-B53B-78574BBB39B6&spaceId=795ef48a-f554-14a8-afa5-a503c41068a6).
  Do not mirror those details into public Markdown or link to this page from the
  public handbooks. This agent instruction file records the destination only.
- The [public Changelog](craftdocs://open?blockId=3E5464FC-C3C6-4387-ADFB-DE3D5CAFC8C7&spaceId=795ef48a-f554-14a8-afa5-a503c41068a6)
  is the Craft counterpart of `CHANGELOG.md`. Keep user-facing release notes in
  sync, retain historical version/date boundaries and keep Unreleased separate.
- Before publication, review both languages and the changelog for internal data.
  Inspect the intended Craft page first, preserve existing IDs and read changes back.
- Use the **Craft apps3k shared** MCP. Resolve the link and read the target before
  edits; use the existing chapters instead of creating duplicate roots. Updates
  to the user-designated documentation are authorized within the requested scope.
- Keep the same numbered chapter structure in both languages. Update the Craft
  text and `docs/wiki/de/` / `docs/wiki/en/` counterparts together, then verify
  content by reading it back. If access fails, finish the repo draft and clearly
  report which Craft updates remain pending; never claim they were published.
- Craft is the maintained wiki; repository Markdown is its versioned counterpart.
  Read both before changes and reconcile differences without overwriting edits.
  `docs/wiki/craft-pages.json` maps chapters to stable Craft block IDs.
- Update README entry links and CHANGELOG for meaningful documentation changes.
  Keep unreleased implementation separate from verified npm/host availability.
- GitHub Wiki is retired. Do not initialize it or restore the old wiki-sync job.
  There is no automatic Craft publishing workflow. Plane remains the task tracker.

## Detail references (read on demand — do not duplicate here)

| Topic | Where |
|---|---|
| Wiki and navigation | Craft roots above; `docs/wiki/Home.md` |
| User guide: setup, tasks, collections, uploads | `docs/wiki/de/` / `docs/wiki/en/`, chapters 1–5 |
| Troubleshooting and validation | Chapter 6; `docs/VALIDATION.md` |
| User workflow examples | Public chapter 7 |
| Internal architecture, operations and development | Internal Documentation above |
| User versions and updates | Public chapter 8 |
| Internal release and contribution workflow | Internal Documentation above |
| Supplemental screenshot guide | https://craft-n8n.apps3k.com |
