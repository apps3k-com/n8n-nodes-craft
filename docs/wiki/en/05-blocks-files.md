# 05 · Blocks, files and workflows

Block operations read, insert, update, move, delete or search content. Select the document/page or the daily-note date required by the chosen node. For insertion, Start/End targets the parent page; Before/After targets a sibling block. Do not supply conflicting positions.

Upload through File → Upload or Block → Upload File. The incoming item must contain binary data. Input Binary Field defaults to data. Use a page/date for Start/End or a Sibling Block ID for Before/After.

Uploads return blockId, assetUrl and fileName. File Name is an optional output override; it does not make Craft display a filename on the uploaded block. One file is uploaded per incoming item. The upstream upload endpoint is experimental.

Read-only workflow: Manual Trigger → Craft Documents → Document → List. Inspect returned IDs before adding dependent operations. File workflow: a node producing binary data → Craft File → Upload, with the same binary property name.

For multiple writes, n8n processes incoming items separately. Avoid replaying Add operations blindly: they can create additional objects. Retain IDs and use Update when modifying existing content. Recheck scope before testing delete or move operations.
