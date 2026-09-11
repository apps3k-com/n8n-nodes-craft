# 01 · Schnellstart

Installiere `n8n-nodes-craft-apps3k` in n8n unter Settings → Community Nodes → Install. Dieser unabhängige Fork stellt Craft Documents und Craft Daily Notes bereit.

Erstelle eine Verbindung in Craft Connect und kopiere API-URL und separaten API-Key. Lege in n8n die passenden Zugangsdaten Craft Documents API oder Craft Daily Notes API an. Speichere den Key ausschließlich in den Zugangsdaten, nie im Workflow-Text oder in der Dokumentation. Der Verbindungstest ruft GET /connection auf.

Beginne mit einem Lesezugriff: Craft Documents → Document → List oder Craft Daily Notes → Task → Get mit Inbox. Führe den Node aus und prüfe die Ausgabe. Eine leere Liste kann eine erfolgreiche Antwort sein.

Die gemeinsame Installation ist n8n.apps3k.com. Setze keine lokale n8n-Instanz voraus. Das Repository bietet Entwicklungsbefehle; diese bezeichnen keinen bereits laufenden Dienst.

Node-Version 2 ist nach PR #14 auf main implementiert. Damit ist noch nicht belegt, dass sie veröffentlicht oder auf deinem n8n-Host installiert ist. Der automatische Veröffentlichungsversuch für 2.3.2 am 11.09.2026 ist fehlgeschlagen. Prüfe Paket- und Node-Version vor der Verwendung von v2-Funktionen.
