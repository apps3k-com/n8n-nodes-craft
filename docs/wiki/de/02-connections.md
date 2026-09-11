# 02 · Verbindungen und Nodes

Craft Documents unterstützt Verbindungen für Selected Documents. Version 2 bietet zusätzlich All Documents (Space). Wähle den Bereich passend zur Craft-Verbindung. Die Auswahl erweitert keine Berechtigungen.

Craft Documents: Dokumentliste, Blöcke, Collections, Suche und Datei-Upload. Mit Node v2 und einer Space-Verbindung zusätzlich: Dokumente erstellen, verschieben und in den Papierkorb legen, Ordner anzeigen sowie Tasks verwalten, auch innerhalb eines bestimmten Dokuments.

Craft Daily Notes: datumsbezogene Blöcke, Collections, Tasks, Suche und Uploads. Je nach Operation sind today, tomorrow, yesterday oder YYYY-MM-DD möglich.

Version 2 bietet durchsuchbare Auswahlen über From List sowie direkte Eingabe über By ID. Bestehende Workflows mit Version 1 behalten ihre bisherige Oberfläche und String-IDs. Ausdrücke bleiben möglich. Die Auswahl blättert lokal durch die von Craft gelieferten Ressourcen; zusätzliche API-Paginierung wird nicht vorausgesetzt.

Zum Erstellen eines Dokuments in v2 wähle Document → Create, gib den Titel ein und wähle Unsorted, Templates oder einen Ordner. Move verwendet ein Dokument und ein Ziel. Delete legt das Dokument in den Papierkorb. Ordner anlegen oder löschen ist nicht implementiert.

Beide Nodes können als KI-Agent-Tools dienen, wenn der n8n-Host N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true aktiviert. Prüfe Berechtigungen und gewünschte Operation, bevor ein Agent schreiben darf.
