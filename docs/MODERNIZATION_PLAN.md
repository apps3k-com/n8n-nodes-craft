# Connect API modernization

The implementation keeps Selected Documents, Daily Notes and Space contracts
separate. Saved node version 1 retains its parameters and string IDs. Node version 2
adds searchable selectors, Space document operations and task management.

Implemented: named document/collection/folder/task selectors, direct IDs, local
picker pagination, Space document create/move/trash, task CRUD and document scope,
collection schema compatibility and clear selection errors.

Deferred: folder mutations, experimental comments and richer block authoring.
See [API coverage](CONNECT_API_COVERAGE.md) and [validation scope](VALIDATION.md).
Operational plans and environment-specific acceptance evidence are maintained
separately in internal documentation.
