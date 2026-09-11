# 08 · Releases, Mitarbeit und Dokumentation

Plane Craft Nodes (Workspace apps3k, Kürzel CRNO) ist die maßgebliche Aufgabenverwaltung. GitHub Issues/Projects sind nicht erforderlich. Verwende einen kurzlebigen Branch von main, Conventional Commits und einen PR nach main. Verlinke das Plane-Issue direkt mit CRNO-Kennung im PR und den PR zurück in Plane.

Der Eigentümer führt Merge und Release aus. Agenten starten keine Releases, veröffentlichen keine Pakete und ändern keine Produktionsinhalte ohne ausdrücklich autorisierten Umfang. CodeRabbit-Hinweise werden geprüft und bearbeitet; ohne Antwort darf eine Review nicht als bestanden gelten.

npm run release ruft n8n-node release auf. Zusätzlich besitzt das Repository einen automatischen npm-publish-Workflow auf main. Prüfe dessen Ergebnis und die Registry vor einer Release-Meldung. Wiederhole das Publishing nicht blind: Prüfe Version, Zugangsdaten und bereits abgeschlossene Schritte.

Stand 11.09.2026: PR #14 ist gemergt. Der automatische npm-Publish für 2.3.2 scheiterte mit HTTP 404. Der bisherige GitHub-Wiki-Sync scheiterte am nicht initialisierten Wiki; diese Dokumentationsmigration entfernt den Sync. CRNO-3 erfasst die noch offene Live-Abnahme.

Das Wiki wird in den beiden festgelegten Craft-Seiten mit gleicher deutscher und englischer Kapitelstruktur gepflegt. docs/wiki/de und docs/wiki/en enthalten versionierte Markdown-Gegenstücke. Aktualisiere bei Verhaltens- oder Dokumentationsänderungen beide Sprachen sowie README und CHANGELOG. Erhalte die Craft-Seiten-IDs, lies vorhandene Inhalte, ändere gezielt die vorgesehenen Abschnitte und prüfe sie anschließend durch Rücklesen. Eine automatische Craft-Veröffentlichung ist nicht eingerichtet.

README bleibt der kurze Repo-Einstieg; CHANGELOG dokumentiert wesentliche Änderungen und trennt Unreleased von veröffentlichten Versionen. Die bisherige Screenshot-Anleitung auf craft-n8n.apps3k.com ist ergänzend. Plane enthält Aufgaben und Abnahmenachweise, keine kopierten Handbuchtexte.
