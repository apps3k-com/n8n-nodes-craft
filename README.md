# n8n-nodes-craft-apps3k

n8n community nodes for [Craft](https://www.craft.do)'s Connect API. Two nodes — **Craft Documents** (multi-document spaces) and **Craft Daily Notes** (date-based notes & tasks) — covering blocks, collections, search, tasks, and file uploads. Both are usable as AI agent tools.

> Fork of [`n8n-nodes-craft`](https://github.com/yigitkonur/n8n-nodes-craft) by Yigit Konur, updated for Craft's Bearer-token Connect API.

## Installation

In n8n: **Settings → Community Nodes → Install**, then enter `n8n-nodes-craft-apps3k`.

To use the nodes as AI agent tools, set `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` on the n8n host.

## Authentication

Craft's Connect API uses two parts: a connection **URL** plus a separate **API key** (sent as a Bearer token).

1. In Craft, go to **Settings → Connect** and create or open a connection.
2. Copy the **API URL** (looks like `https://connect.craft.do/links/{UUID}/api/v1`).
3. Copy the **API Key** for that connection.
4. In n8n, create the matching credential — **Craft Documents API** or **Craft Daily Notes API** — and paste both the **API URL** and the **API Key**.

The key is stored as a secret and sent as `Authorization: Bearer <key>` on every request. Saving the credential runs a quick `GET /connection` test.

## Nodes & resources

| Resource | Craft Documents | Craft Daily Notes |
|----------|:---:|:---:|
| Document (list, create, move, delete) | ✅ | — |
| Block (get, insert, update, delete, move, search) | ✅ | ✅ |
| Collection (list, schema, items CRUD) | ✅ | ✅ |
| Task (inbox / active / upcoming / logbook) | — | ✅ |
| Search (across the space) | ✅ | ✅ |
| **File (upload)** | ✅ | ✅ |

Documents are addressed by document / page IDs; daily notes by date (`today`, `tomorrow`, `yesterday`, or `YYYY-MM-DD`).

## Working with collections

Collections are structured tables inside Craft. For **Add Items** and **Update Items**, pick a collection and its columns load automatically as typed fields — text, number, date picker, and dropdowns whose options come from the collection's schema. No JSON required.

To set a **relation** (a link to items in another collection), use the **Relations** section: choose the relation field, then pick one or more target items from the dropdown. For **Update Items**, map the **Item ID** field to identify the row to change.

## Uploading files

Upload images, videos, or documents via **File → Upload** (or **Block → Upload File** — the same action).

1. Provide the file as binary data on the incoming item (e.g. from **HTTP Request**, **Read/Write Files from Disk**, or a previous node) and set **Input Binary Field** to that property's name (default `data`).
2. Choose a **Position**:
   - **Start / End** — at the start or end of a page (**Documents**: pick the **Page**) or a daily note (**Daily Notes**: set the **Date**).
   - **Before / After** — relative to a **Sibling Block ID**.
3. Execute. The node returns `blockId`, `assetUrl`, and `fileName`.

Optionally set **File Name** to control the name returned in the output (it defaults to the uploaded file's original name). Note: Craft's API does not display file names on uploaded blocks, so this only affects the node's output — useful for downstream nodes.

One file per input item; feed multiple items to upload several files.

## Troubleshooting

- **Credential test fails:** re-check the API URL and API Key (Settings → Connect). The key is the connection's key, not the URL UUID.
- **Nodes not available as tools:** set `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` and restart n8n.
- **Empty collection dropdowns:** make sure the credential points at a connection that has access to the relevant documents and collections.

## License

[MIT](LICENSE.md) — see [CHANGELOG.md](CHANGELOG.md) for release history.
