# 07 · Architektur und Entwicklung

Das Paket wird in TypeScript mit @n8n/node-cli gebaut. CraftDocuments und CraftDailyNotes enthalten Node-Definitionen, Ressourcen und Auswahlmethoden. nodes/shared enthält gemeinsame Mapping- und UI-Helfer; credentials die beiden Authentifizierungsdefinitionen. Das Build-Ergebnis liegt in dist/.

Zugangsdaten senden den API-Key als Authorization: Bearer und verwenden die konfigurierte Verbindungs-URL. Behandle Selected Documents, Daily Notes und Space als getrennte Verträge. Ein Space-Endpunkt ist keine fehlende Funktion einer Selected-Documents-Verbindung.

Verwende eine vom installierten n8n unterstützte Node.js-Version. package.json verlangt >=20.15.0; der isolierte Test mit n8n 2.38.7 lief unter Node 24.19.0. pnpm-lock.yaml ist versioniert. Installiere mit pnpm install und untersuche ignorierte Dependency-Build-Skripte, statt Vertrauensregeln ungeprüft zu ändern.

Vor einem PR: npm test, npm run build, npm run lint, npm run check:docstrings und bash .claude/hooks/guard-tests.sh. Die JSDoc-Prüfung misst benannte produktive Funktionen mit mindestens 80 % Abdeckung.

npm run dev startet optional eine lokale Entwicklungsumgebung. Ein vorhandener lokaler Dienst wird nicht vorausgesetzt. scripts/runtime-smoke.cjs verwendet ein temporäres Profil und einen Loopback-Fixture-Server; N8N_BINARY muss auf eine installierte n8n-Datei zeigen. Das Skript nutzt synthetische Zugangsdaten und ist kein Produktions-Schreibtest.

Bewahre beim Ausbau von v2 die Parameter- und Ausdrucksverarbeitung gespeicherter v1-Nodes. Prüfe Request-Bodies, Fehlerweitergabe und Auswahlfelder gegen echte API- und n8n-Verträge. docs/CONNECT_API_COVERAGE.md und docs/VALIDATION.md halten Vertragsabdeckung und Nachweisgrenzen fest.
