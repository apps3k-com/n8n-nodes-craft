# 02 · Connections and nodes

Craft Documents supports Selected Documents connections. Version 2 additionally offers All Documents (Space). Choose the scope that matches the Craft connection. Changing the selector does not grant additional permissions.

Craft Documents: document listing, blocks, collections, search and file upload. With node v2 and a Space connection: document create/move/trash, folder discovery and task CRUD, including document-scoped tasks.

Craft Daily Notes: date-based blocks, collections, tasks, search and uploads. Dates can use today, tomorrow, yesterday or YYYY-MM-DD where supported by the operation.

Version 2 uses searchable From List and By ID selectors. Existing version-1 workflows retain their original layout and string IDs. Expressions remain available. Lists page locally over the resources returned by Craft; the node does not invent API pagination.

To create a document in v2, select Document → Create, enter its title and choose Unsorted, Templates or a folder. Move selects a document and destination. Delete moves a document to Trash. Folder creation/deletion is not implemented.

Both nodes can be used as AI agent tools when the n8n host enables N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true. Check permissions and the requested operation before allowing an agent to write.
