# 08 · Releases, contributions and documentation

Plane Craft Nodes (workspace apps3k, prefix CRNO) is the authoritative work tracker. GitHub Issues/Projects are not required. Use a short-lived branch from main, Conventional Commits and a PR targeting main. Include a direct Plane issue link and CRNO identifier; link the PR back to Plane.

The owner merges and releases. Agents do not run releases, publish packages or change production content without a specifically authorized scope. CodeRabbit findings must be checked and addressed; do not claim a review passed when no response exists.

npm run release invokes n8n-node release. The repository also has an automatic npm-publish workflow on main. Inspect its result and the registry before reporting a release. Do not rerun publishing blindly: check version, credentials and which steps already completed.

Status at 2026-09-11: PR #14 merged. Its automatic npm publish for 2.3.2 failed with HTTP 404. The old GitHub Wiki sync failed because the wiki was not initialized; this documentation migration retires that sync. CRNO-3 tracks the remaining live acceptance.

The wiki is maintained in the two designated Craft pages, with matching German and English chapter structure. docs/wiki/de and docs/wiki/en contain versioned Markdown counterparts. Update both languages together with README and CHANGELOG when behavior or documentation changes. Preserve Craft page IDs, inspect existing content, update only the intended sections and verify readback. No automatic Craft publishing is configured.

README remains the concise repository entry point; CHANGELOG records notable changes and separates Unreleased from published versions. The existing screenshot guide at craft-n8n.apps3k.com is supplementary. Plane holds tasks and acceptance evidence, not duplicate documentation bodies.
