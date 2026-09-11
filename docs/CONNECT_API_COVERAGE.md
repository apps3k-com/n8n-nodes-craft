# Craft Connect API coverage

Status: read-only documentation audit, performed 2026-09-11. No live Craft API
requests were made and no production data was changed.

## Sources

- [Craft API documentation index](https://connect.craft.do/api-docs)
- [Space API](https://connect.craft.do/api-docs/space)
- [Selected Documents API](https://connect.craft.do/api-docs/documents/)
- [Daily Notes and Tasks API](https://connect.craft.do/api-docs/daily-notes/)

The three API pages are distinct connection scopes. The selected-documents API
is not a full-space document-management API. The Space API adds folders and
document lifecycle operations. This audit does not infer that the latter should
be exposed by the selected-documents node without an explicit connection-mode
decision.

## Coverage matrix

| API area | Current documented contract | Repository coverage | Assessment |
|---|---|---|---|
| Blocks | `GET/POST/PUT/DELETE /blocks`; `PUT /blocks/move`. Structured requests use `blocks`, `blockIds`, and `position`. Position is `pageId` or `siblingId` for selected documents; Space/Daily Notes also document `date` where applicable. | Both nodes implement get, insert, update, delete, move under `nodes/CraftDocuments/resources/block/` and `nodes/CraftDailyNotes/resources/block/`. | Covered |
| Search within one document/note | Selected Documents: `GET /blocks/search` with `documentId`, `pattern`, `caseSensitive`, `beforeBlockCount`, `afterBlockCount`. Daily Notes: `date` instead of `documentId`. Space API documentation names the query parameter `blockId`. | Selected Documents uses `documentId` in `nodes/CraftDocuments/resources/block/search.ts`; Daily Notes uses `date` in `nodes/CraftDailyNotes/resources/block/search.ts`. | Covered for the selected-documents and daily-notes scopes. Do not change to `blockId` without changing the connection contract. |
| Cross-document search | Selected Documents: `GET /documents/search`; Daily Notes: `GET /daily-notes/search`; Space: `GET /documents/search`. Search is relevance-ranked and documented as top 20 results. | Implemented in `nodes/CraftDocuments/resources/search/` and `nodes/CraftDailyNotes/resources/search/`. | Covered; document the top-20 result boundary. |
| Collections | List, schema, get items, add, update, delete items. Bodies are `items`, `itemsToUpdate`, and `idsToDelete`; `allowNewSelectOptions` is optional. The downloadable current schema describes collection-schema success as the schema object itself (the rendered page labels it `response?unknown`, which is less precise). | Both nodes implement all listed collection item operations under their `resources/collection/` trees, with shared mapping in `nodes/shared/collectionMethods.ts`. | Covered |
| Upload | `POST /upload`, raw `application/octet-stream`; selected documents target `pageId`/`siblingId`, Daily Notes target `date`/`siblingId`; response contains `blockId` and `assetUrl`. Official docs label this experimental. | Shared upload hooks and routing in `nodes/shared/uploadUi.ts`; both nodes expose File and Block upload. | Covered; experimental status should be visible to users. |
| Tasks | Daily Notes: `GET/POST/PUT/DELETE /tasks`; scopes active/upcoming/inbox/logbook. Space adds `scope=document` plus `documentId`, and Space task writes can target inbox, daily note, or document. | Daily Notes task resource is implemented in `nodes/CraftDailyNotes/resources/task/`. Documents node intentionally declares no Task resource (`nodes/CraftDocuments/CraftDocuments.node.ts:8-11`). | Covered for Daily Notes. Space/document task support is a product-scope gap only if a Space connection mode is intended. |
| Selected documents | `GET /documents`, with optional `fetchMetadata`; response items contain document IDs/titles/deletion status. | `nodes/CraftDocuments/resources/document/index.ts:2-38`. | Covered |
| Space document lifecycle | Space API additionally documents `POST /documents` with `documents` body, `DELETE /documents` with `documentIds` (soft-delete to trash), and `PUT /documents/move` with `documentIds` plus `{destination:"unsorted"|"templates"}` or `{folderId}`. | No corresponding operations in the selected-documents resource. | P1 candidate only for an explicit Space API connection/resource. |
| Space folders | Space API documents `GET/POST/DELETE /folders` and `PUT /folders/move`. The page says deletion moves contained documents/subfolders to the parent (or Unsorted for a top-level folder), but its request-field description also says folders must be empty. Built-in locations cannot be deleted. | No folder resource found under `nodes/CraftDocuments/` or `nodes/CraftDailyNotes/`. | P1 candidate only for an explicit Space API connection/resource; resolve the published deletion-contract conflict before implementing destructive UI. |
| Comments | Experimental `POST /comments`, body `comments: array<object>`, response `commentId`. | No comments resource found. | P2 optional feature. |
| Connection metadata | Experimental `GET /connection`, returning `space`, `utc`, and `urlTemplates`. | Credential tests already call `/connection`; no user-facing connection resource exists. | P2 optional diagnostics/deep-link feature. |

## Pagination and response boundaries

The current official pages do not document cursor, offset, limit, or page-token
parameters for document, collection, task, or block list responses. Search
endpoints explicitly describe relevance-ranked top-20 results. The repository
therefore has no confirmed missing pagination parameter to implement; server-side pagination would require a later Craft API specification
or observed server contract. Local editor paging is independent of this boundary.

Most successful responses are documented as an object containing an `items`
array. Upload instead returns `{blockId, assetUrl}`. Collection schema returns
a `response` value. These shapes should remain operation-specific rather than
being normalized speculatively.

## Exact high-value extension schemas

If a Space API mode is approved, the minimum operations and request shapes from
the current docs are:

The current downloadable schema and the rendered official page specify these
request fields:

- `POST /documents`: `documents` array of document objects (the schema exposes
  `title`); optional `destination`, represented as either
  `{destination: "unsorted"|"templates"}` or `{folderId: "..."}`.
- `DELETE /documents`: `documentIds` array.
- `PUT /documents/move`: `documentIds` array plus the same destination forms.
- `POST /folders`: `folders` array of folder objects (the schema exposes the
  folder name and optional parent-folder placement).
- `DELETE /folders`: `folderIds` array.
- `PUT /folders/move`: `folderIds` array plus either
  `{destination: "root"}` or `{parentFolderId: "..."}`.

The rendered HTML omits some array-item details even though the downloadable
schema exposes them. The Space page also contains the folder-deletion
contradiction recorded above; implementation should wait for clarification or
a verified server contract before adding destructive folder UI.

## Search parameter distinction

This is a material compatibility boundary:

- `nodes/CraftDocuments/resources/block/search.ts` sends `documentId`, matching
  the Selected Documents API page.
- `nodes/CraftDailyNotes/resources/block/search.ts` sends `date`, matching the
  Daily Notes API page.
- The Space API page describes `blockId` for its single-document search. That
  does not establish that `blockId` is valid for the selected-documents URL.

No code change is recommended from this audit alone.

## Implementation outcome in this branch

The matrix above records the baseline audit. This branch adds an explicit v2
Space scope with document create/move/trash, folder listing, and task
get/add/update/delete (including document scope). Implementations live under
`nodes/CraftDocuments/resources/{document,folder,task}`. Selected Documents
and Daily Notes version 1 remain available.

Version 2 adds searchable document/collection locators, folder paths, task
pickers and an optional Collection Update Item picker. These use n8n's documented
[listSearch/resourceLocator UI](https://docs.n8n.io/integrations/creating-nodes/reference/node-ui-elements/).
The installed `n8n-workflow@1.113.0` parameter-display and expression engines are
exercised in `nodes/shared/versionCompatibility.test.ts`.

Picker pagination is local UI paging over the returned `items` array; it adds
no undocumented cursor/query parameters to Craft requests. Collection schema
mapping accepts both the current documented `select`/string-options shape and
older `singleSelect`/object-options inputs.

Remaining gaps are explicit: folder mutations, experimental comments, a
user-facing connection-info operation, richer block-type authoring, and
server-side list pagination are not provided. Block update/delete/move and
relative upload targets still support manual IDs; this release does not claim
that every operation is completely ID-free. Collection field clearing and
multi-select-specific editor controls remain outside this change.

Live verification status is recorded separately in [VALIDATION.md](VALIDATION.md);
contract and unit tests must not be mistaken for successful live API execution.
