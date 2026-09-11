# 01 · Schnellstart

Installiere `n8n-nodes-craft-apps3k` in n8n unter Settings → Community Nodes → Install. Dieser unabhängige Fork stellt Craft Documents und Craft Daily Notes bereit.

Erstelle eine Verbindung in Craft Connect und kopiere API-URL und separaten API-Key. Lege in n8n die passenden Zugangsdaten Craft Documents API oder Craft Daily Notes API an. Speichere den Key ausschließlich in den Zugangsdaten, nie im Workflow-Text oder in der Dokumentation. Der Verbindungstest ruft GET /connection auf.

Beginne mit einem Lesezugriff: Craft Documents → Document → List oder Craft Daily Notes → Task → Get mit Inbox. Führe den Node aus und prüfe die Ausgabe. Eine leere Liste kann eine erfolgreiche Antwort sein.

Verwende deine eigene n8n-Installation. Die Installation von Community-Nodes kann Administrationsrechte erfordern. Wende dich an deine n8n-Administration, wenn die Installationsoption fehlt.

Prüfe die installierte Paket- und Node-Version vor der Verwendung versionsabhängiger Funktionen. Einträge unter Unreleased sind keine Zusage, dass die Funktion bereits im veröffentlichten Paket verfügbar ist.
