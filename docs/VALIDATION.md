# Validation scope

Automated tests cover request construction, resource selectors, error propagation,
collection mapping and compatibility with saved version-1 nodes. The test suite,
build, lint and JSDoc checks passed for the version-2 implementation. An isolated
n8n runtime check exercised synthetic requests against a loopback fixture.

Fixture tests do not prove live write behavior. Live reads exercised document,
folder, collection and task selection. Empty task responses do not establish
populated-task behavior. End-to-end write acceptance remains outstanding.

Connection details, inventory counts, access procedures and operational evidence
are maintained separately in internal documentation.
