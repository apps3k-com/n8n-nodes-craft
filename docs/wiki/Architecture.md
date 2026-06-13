# Architecture

_Source: `package.json`, `README.md`, `nodes/`, `credentials/`. Verify against the
code before relying on details here._

## Overview

An n8n community-node package exposing **Craft's Connect API** as two n8n nodes.
Built with `@n8n/node-cli` (`n8n-node` build/dev/lint/release); TypeScript →
`dist/` (the published artifact). Targets n8n nodes-API version 1, `strict` mode.

## Nodes

- **Craft Documents** (`nodes/CraftDocuments`) — multi-document spaces:
  Document (list/create/move/delete), Block (get/insert/update/delete/move/search),
  Collection (list/schema/items CRUD), Search, File upload.
- **Craft Daily Notes** (`nodes/CraftDailyNotes`) — date-based notes & tasks:
  Block, Collection, Task (inbox/active/upcoming/logbook), Search, File upload.
  Daily notes are addressed by date (`today`/`tomorrow`/`yesterday`/`YYYY-MM-DD`).
- **`nodes/shared`** — code shared between the two nodes.

Both nodes are usable as **AI agent tools** (requires
`N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` on the n8n host).

## Credentials

- **Craft Documents API** (`credentials/CraftDocumentsApi.credentials.ts`)
- **Craft Daily Notes API** (`credentials/CraftDailyNotesApi.credentials.ts`)

Each holds a connection **API URL**
(`https://connect.craft.do/links/{UUID}/api/v1`) plus a separate **API key**, sent
as `Authorization: Bearer <key>`. Saving the credential runs a `GET /connection`
test.

## External dependency

- **Craft Connect API** — the upstream service the nodes call. `peerDependencies`:
  `n8n-workflow`.
