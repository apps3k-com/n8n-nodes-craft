# Craft Nodes documentation / Dokumentation

The maintained wiki lives in Craft. These Markdown files are its versioned
counterparts, reviewed together with the code. GitHub Wiki and its sync job are retired.

| Language | Craft wiki | Repository |
|---|---|---|
| Deutsch | [Benutzerhandbuch](craftdocs://open?blockId=7BB4EA02-A628-45A2-BC16-539C59724748&spaceId=795ef48a-f554-14a8-afa5-a503c41068a6) | [Inhalt](de/README.md) |
| English | [User Documentation](craftdocs://open?blockId=F04E0ABB-8657-47F4-8350-A20206E0A6FB&spaceId=795ef48a-f554-14a8-afa5-a503c41068a6) | [Contents](en/README.md) |

## Shared structure

1. Quick start / Schnellstart
2. Connections and nodes / Verbindungen und Nodes
3. Tasks
4. Collections
5. Blocks, files and workflows / Blöcke, Dateien und Workflows
6. Troubleshooting and evidence / Fehlerbehebung und Nachweise
7. Architecture and development / Architektur und Entwicklung
8. Releases, contributions and documentation / Releases, Mitarbeit und Dokumentation

## Maintenance

1. Read both Craft editions and the corresponding repo files before changing content.
2. Update the same chapter in both languages, retaining existing Craft block IDs.
   `craft-pages.json` records the language roots and chapter mappings.
3. Update the repository counterparts, README and Unreleased changelog as appropriate.
4. Read Craft content back and compare titles, paragraphs and language links. Do not
   report an update as published if it exists only in the repository.
5. Link the documentation PR to Plane Craft Nodes. Never overwrite unrelated Craft edits.

There is no automated publisher. Use the Craft apps3k shared MCP and the existing
pages; do not create a replacement root. Craft access failures must be reported
as pending publication. The screenshot guide at https://craft-n8n.apps3k.com is
supplementary, not a separate authoritative wiki.

## Initial publication

2026-09-11: both initially empty roots were populated with eight chapters and
46 content paragraphs each. Full readback matched the prepared content in both
languages; reciprocal language links resolved to the designated block IDs.
Tracked as [CRNO-4](https://plane.apps3k.com/apps3k/projects/dfb3aaf5-3acc-4aa7-ba52-0fd9c2589ad6/issues/88c10811-00c6-4582-b82e-9d7c9a7093c4/).
