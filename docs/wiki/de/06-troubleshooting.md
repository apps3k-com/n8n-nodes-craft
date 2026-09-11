# 06 · Fehlerbehebung und Nachweise

Fehlende v2-Felder: Prüfe installierte Paket- und Node-Version. Ein Merge oder erfolgreicher Build aktualisiert n8n.apps3k.com nicht. Gespeicherte v1-Nodes behalten absichtlich ihre bisherige Oberfläche.

401/403: Prüfe API-URL, separaten Key und Verbindungsbereich. Untersuche die tatsächliche Antwort, ohne Geheimnisse zu protokollieren. Beim Test am 11.09.2026 erhielt Python urllib Cloudflare Error 1010 (browser_signature_banned); Node.js fetch funktionierte mit derselben Verbindung. Ein 403 bedeutet daher nicht automatisch einen falschen Key.

Leere Auswahl: Unterscheide eine erfolgreiche leere Antwort von einem Fehler. Task-Bereiche können leer sein. Prüfe Dokumentbereich und Berechtigungen. Collections benötigen ein lesbares Schema und erreichbare Relationsziele.

Agent-Zugriff auf Zugangsdaten: Verwende den vorhandenen 1Password-Service-Account und prüfe seine Identität. Eine fehlende Shell-Sitzung ist kein Grund für eine Desktop-Freigabe, wenn der Service Account verfügbar ist. Zugangsdaten gehören weder in Git noch in Logs.

Dokumentierte Nachweise: 54 Tests, Build/Lint, 100 % gemessene JSDoc-Abdeckung und zehn isolierte n8n-Fixture-Szenarien bestanden. Live-Auswahlen lieferten 510 eindeutige Dokumente über sechs Seiten, neun flach dargestellte Ordner und 23 Collections. Das ist eine datierte Momentaufnahme, keine Zusage zum aktuellen Bestand.

Live-Schreibzugriffe mit Rücklesen und die v2-Abnahme auf dem gemeinsamen Host bleiben in Plane CRNO-3 offen. Nenne bei Fehlern Operation, Node-/Paket-Version, Bereich, HTTP-Status und eine bereinigte Fehlermeldung. Teile keine API-Keys oder Verbindungs-URLs mit Zugangsdaten.
