# 06 · Troubleshooting and evidence

Missing v2 controls: check the installed package and node version. A merge or successful build does not upgrade n8n.apps3k.com. Saved v1 nodes intentionally retain their old interface.

401/403: verify the API URL, separate key and access scope. Inspect the actual response without logging secrets. During the 2026-09-11 check, Python urllib received Cloudflare Error 1010 (browser_signature_banned); Node.js fetch with the same connection succeeded. Do not assume every 403 means an invalid key.

Empty picker: distinguish a successful empty response from an error. Task scopes can be empty. Check document scope and permissions. Collections require a readable schema and related targets.

Credential access for agents: use the existing 1Password service account and verify its identity. A missing shell session is not a reason to request desktop approval when that service account is available. Keep credentials out of Git and logs.

Recorded evidence: 54 tests, build/lint, 100% measured JSDoc coverage and ten isolated n8n fixture scenarios passed. Live read pickers returned 510 unique documents over six pages, nine flattened folders and 23 collections. These observations are a dated snapshot, not current inventory guarantees.

Live write/readback and shared-host v2 acceptance remain open in Plane CRNO-3. Supply operation, node/package version, scope, HTTP status and a redacted error when reporting an issue. Never include API keys or credential-bearing connection URLs.
