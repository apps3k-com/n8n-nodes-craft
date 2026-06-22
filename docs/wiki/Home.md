# n8n-nodes-craft-apps3k — Documentation

**Single source of truth for the technical documentation of this package.** Docs
live in **`docs/wiki/`** in this repo (PR-reviewed, versioned with the code) and
are **published to this GitHub Wiki automatically** on merge to `main`.

This is an n8n community-node package for **Craft's Connect API** — two nodes
(Craft Documents + Craft Daily Notes) covering blocks, collections, search, tasks
and file upload, usable as AI agent tools. Published to npm as
`n8n-nodes-craft-apps3k`.

## How this is organized
- **Technical documentation — English** (the development language): see the
  sidebar →
- **End-user guide (with screenshots)** is published separately at
  **[craft-n8n.apps3k.com](https://craft-n8n.apps3k.com)** and summarised in the
  repo `README.md`.

## Conventions
- **`docs/wiki/` in the repo is the source of truth** — this GitHub Wiki is a
  generated, read-only mirror. **Don't edit wiki pages directly** (the next sync
  overwrites them); edit `docs/wiki/**` via a pull request.
- Don't duplicate doc bodies in the task tracker (GitHub Projects) — that holds *tasks*,
  not docs.
- **Agent-runtime instructions stay in the repo** (`CLAUDE.md` / `AGENTS.md`) and
  stay slim; they point here for depth.
