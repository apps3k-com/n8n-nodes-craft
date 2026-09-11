# 01 · Quick start

Install `n8n-nodes-craft-apps3k` through Settings → Community Nodes → Install in n8n. This independent fork provides Craft Documents and Craft Daily Notes.

Create a Craft Connect connection, then copy its API URL and separate API key. In n8n, create the matching Craft Documents API or Craft Daily Notes API credential. Store the key in credentials, never in workflow text or documentation. The credential test calls GET /connection.

Start with a read: Craft Documents → Document → List, or Craft Daily Notes → Task → Get with Inbox scope. Execute and inspect the output. An empty list can be a successful response.

For the shared installation use n8n.apps3k.com. Do not assume a local n8n instance exists. The repository provides development commands, but they do not describe an already running service.

Node version 2 is implemented on main after PR #14. This does not prove that it is published or installed on your n8n host. The automatic 2.3.2 publish attempt on 2026-09-11 failed. Confirm the installed package and node version before following v2-only instructions.
