# n8n-nodes-craft-apps3k

n8n community nodes for [Craft](https://www.craft.do)'s Connect API. Two nodes — **Craft Documents** (selected documents or an entire Space) and **Craft Daily Notes** (date-based notes & tasks) — covering blocks, collections, search, tasks, and file uploads. Both are usable as AI agent tools.

> **Fork notice:** This is an independent fork of [`n8n-nodes-craft`](https://github.com/yigitkonur/n8n-nodes-craft) by Yigit Konur, published as `n8n-nodes-craft-apps3k` and updated for Craft's current Connect API (separate **API URL** + **API key**, Bearer auth).

## Documentation / Dokumentation

The project wiki is maintained in Craft in two matching language editions:

- **[Deutsch — Benutzerhandbuch](craftdocs://open?blockId=7BB4EA02-A628-45A2-BC16-539C59724748&spaceId=795ef48a-f554-14a8-afa5-a503c41068a6)** · [Markdown im Repo](docs/wiki/de/README.md)
- **[English — User Documentation](craftdocs://open?blockId=F04E0ABB-8657-47F4-8350-A20206E0A6FB&spaceId=795ef48a-f554-14a8-afa5-a503c41068a6)** · [Repository Markdown](docs/wiki/en/README.md)

Each edition covers quick start, connections/nodes, tasks, collections, blocks/files,
troubleshooting, development and releases. Craft links open the app and require
access to the shared space. The repository copies can be read without Craft access.
The [existing screenshot guide](https://craft-n8n.apps3k.com) is supplementary.

GitHub Wiki is no longer used. See [documentation maintenance](docs/wiki/Home.md)
for the paired-language update procedure.

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
| Document list | ✅ | — |
| Document create, move, trash; folder discovery | Space connections, node v2 | — |
| Block (get, insert, update, delete, move, search) | ✅ | ✅ |
| Collection (list, schema, items CRUD) | ✅ | ✅ |
| Task get, add, update, delete | Space connections, node v2 (also document scope) | ✅ |
| Search (across the space) | ✅ | ✅ |
| **File (upload)** | ✅ | ✅ |

Documents are addressed by document / page IDs; daily notes by date (`today`, `tomorrow`, `yesterday`, or `YYYY-MM-DD`).

## Version 2: choose by name

The features below are implemented on **main** after PR #14; package publication and host installation must be verified separately. The automatic 2.3.2 publish attempt on 2026-09-11 failed, so that run does not establish availability. Saved version-1 nodes retain their parameter layout and string IDs. New version-2 nodes offer searchable **From List** and **By ID** modes for documents and collections; expressions remain available. Lists page locally over the resources returned by Craft, which does not document server pagination.

For **Craft Documents**, set **Connection Scope** to match the connection created in Craft. **Selected Documents** is the default. **All Documents (Space)** enables folder discovery, document creation/moving/trashing, and Space tasks. Selecting Space does not grant permissions to a Selected Documents API URL.

To create a document, choose **Document → Create**, enter a title, then select Unsorted, Templates, or a named folder. **Move** accepts a document and destination; **Delete** moves it to Craft's Trash. Use Move with a known trashed document ID to restore it. Folder paths distinguish nested folders. Folder creation/deletion is not included.

## Working with tasks

**Craft Daily Notes** retains its existing task operations. **Craft Documents → All Documents (Space) → Task** adds Get, Add, Update, and Delete across the Space. Get filters by Active, Upcoming, Inbox, Logbook, or a named document. Update/Delete let you select the task by its content or supply its ID.

Add a task with readable content and choose Inbox, Daily Note (date), or Document as its location. Update can change content, To Do/Done/Canceled state, schedule, deadline, and location. Dates use Craft's documented date strings; leave optional update fields empty to keep their values. One task or document is changed per input item; supply multiple input items for a batch. Delete removes the selected task, so use a dedicated test connection when testing writes.

## Working with collections

Collections are structured tables inside Craft. For **Add Items** and **Update Items**, pick a collection and its columns load automatically as typed fields — text, number, date picker, and dropdowns whose options come from the collection's schema. No JSON required.

To set a **relation** (a link to items in another collection), use the **Relations** section: choose the relation field, then pick one or more target items from the dropdown. For **Update Items**, version 2 offers **Item Selection → Select Item** to pick a row by name. **Map Item ID** remains the default for existing automation and expressions.

Both documented `select` fields with text options and older `singleSelect` object options are recognized. API/authentication errors are shown instead of silently returning an empty picker. Related-item names come from the target collection's title field.

## Uploading files

Upload images, videos, or documents via **File → Upload** (or **Block → Upload File** — the same action).

1. Provide the file as binary data on the incoming item (e.g. from **HTTP Request**, **Read/Write Files from Disk**, or a previous node) and set **Input Binary Field** to that property's name (default `data`).
2. Choose a **Position**:
   - **Start / End** — at the start or end of a page (**Documents**: pick the **Page**) or a daily note (**Daily Notes**: set the **Date**).
   - **Before / After** — relative to a **Sibling Block ID**.
3. Execute. The node returns `blockId`, `assetUrl`, and `fileName`.

Optionally set **File Name** to control the name returned in the output (it defaults to the uploaded file's original name). Note: Craft's API does not display file names on uploaded blocks, so this only affects the node's output — useful for downstream nodes.

One file per input item; feed multiple items to upload several files. Craft marks the upload endpoint experimental; upstream changes may affect it.

## Troubleshooting

- **Credential test fails:** re-check the API URL and API Key (Settings → Connect). The key is the connection's key, not the URL UUID.
- **Nodes not available as tools:** set `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` and restart n8n.
- **Empty collection dropdowns:** make sure the credential points at a connection that has access to the relevant documents and collections.
- **Changes don't take effect after an update (queue mode):** restart the main n8n process *and* all workers — each loads community-node code only at startup.

## Coverage and development

Cross-document search returns Craft's relevance-ranked top 20, not an exhaustive export. See the [API coverage matrix](docs/CONNECT_API_COVERAGE.md), [implementation plan](docs/MODERNIZATION_PLAN.md), and [validation evidence](docs/VALIDATION.md) for supported scopes and remaining limits.

Run `npm test`, `npm run lint`, `npm run build`, and `npm run check:docstrings`. The docstring gate measures JSDoc on named production TypeScript callables (excluding tests and inline callbacks), with a minimum of 80%.

## License

[MIT](LICENSE.md) — see [CHANGELOG.md](CHANGELOG.md) for release history.
