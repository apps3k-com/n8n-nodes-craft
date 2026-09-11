# 06 · Troubleshooting

Missing controls: check the installed package and node version. Saved version-1 nodes retain their previous interface. Update the installed package through your n8n administrator when a suitable release is available.

Connection errors: verify the Craft Connect API URL, separate API key and selected scope. Use the credential connection test. An authentication or access error is not the same as an empty result.

Empty picker: confirm that the connection can read the requested documents or tasks. A task scope can legitimately contain no tasks. Collection fields require a readable schema and relation targets.

Invalid selection: re-select the document, task or collection after changing credentials. Direct IDs must belong to resources accessible through the selected connection.

Upload errors: check that the incoming item contains binary data and that Input Binary Field matches its property name. Confirm the target page/date or sibling block and use only one position mode.

When reporting a problem, provide the package/node version, operation, expected behavior and a redacted error. Remove API keys, connection URLs containing access information, document contents and personal data from examples.
