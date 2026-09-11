# 01 · Quick start

Install `n8n-nodes-craft-apps3k` through Settings → Community Nodes → Install in n8n. This independent fork provides Craft Documents and Craft Daily Notes.

Create a Craft Connect connection, then copy its API URL and separate API key. In n8n, create the matching Craft Documents API or Craft Daily Notes API credential. Store the key in credentials, never in workflow text or documentation. The credential test calls GET /connection.

Start with a read: Craft Documents → Document → List, or Craft Daily Notes → Task → Get with Inbox scope. Execute and inspect the output. An empty list can be a successful response.

Use your own n8n installation. Community-node installation may require administrator access; contact your n8n administrator if the installation option is unavailable.

Check the installed package and node version before using version-specific features. Features listed under Unreleased are not a promise of availability in the published package.
