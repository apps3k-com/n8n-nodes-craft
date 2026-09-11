# 06 · Fehlerbehebung

Fehlende Felder: Prüfe installierte Paket- und Node-Version. Gespeicherte Nodes der Version 1 behalten ihre bisherige Oberfläche. Lass das Paket durch deine n8n-Administration aktualisieren, sobald eine geeignete Version verfügbar ist.

Verbindungsfehler: Prüfe Craft-Connect-API-URL, separaten API-Key und gewählten Bereich. Verwende den Verbindungstest der Zugangsdaten. Ein Authentifizierungs- oder Zugriffsfehler ist keine leere Ergebnisliste.

Leere Auswahl: Prüfe, ob die Verbindung die gewünschten Dokumente oder Tasks lesen kann. Ein Task-Bereich kann tatsächlich leer sein. Collection-Felder benötigen ein lesbares Schema und erreichbare Relationsziele.

Ungültige Auswahl: Wähle Dokument, Task oder Collection nach einem Wechsel der Zugangsdaten erneut aus. Direkte IDs müssen zu Ressourcen gehören, die über die gewählte Verbindung erreichbar sind.

Upload-Fehler: Prüfe die Binärdaten im eingehenden Item und den Namen unter Input Binary Field. Kontrolliere Zielseite, Datum oder benachbarten Block und verwende genau einen Positionsmodus.

Nenne bei einer Fehlermeldung Paket-/Node-Version, Operation, erwartetes Verhalten und eine bereinigte Fehlermeldung. Entferne API-Keys, Zugangsangaben in Verbindungs-URLs, Dokumentinhalte und personenbezogene Daten aus Beispielen.
