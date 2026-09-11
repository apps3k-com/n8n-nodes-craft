# 03 · Tasks

Craft Daily Notes behält Get, Add, Update und Delete für Tasks. Craft Documents v2 bietet diese Operationen unter All Documents (Space) → Task.

Get: Wähle Active, Upcoming, Inbox, Logbook oder Document. Der Dokumentbereich im Space-Node benötigt ein Dokument, ausgewählt über Name oder ID. Update/Delete verwenden eine Task-Auswahl mit Bereichsfilter oder eine direkte Task-ID.

Add: Gib den Inhalt ein und wähle im Space-Node Inbox, Daily Note mit Datum oder Document als Ablageort. Jedes eingehende n8n-Item erzeugt einen Task.

Update: Wähle den Task und übergib geänderten Inhalt, Status (To Do, Done, Canceled), Planungsdatum, Fälligkeit oder Ablageort. Leere optionale Felder behalten vorhandene Werte; damit lassen sich Datumswerte nicht löschen. Der API-Wert für Canceled lautet canceled mit einem l.

Delete entfernt den ausgewählten Task. Verwende für Schreibtests isolierte, ausdrücklich bestimmte Testinhalte. Lies Änderungen anschließend zurück und behalte die zurückgegebenen IDs für weitere Updates.

Beispiel: Manual Trigger → Craft Documents (Space, Task, Get, Inbox) liest den Posteingang. Für einen Schreibtest erstelle einen eindeutig benannten Task in einem eigenen Testdokument, behalte seine ID, setze ihn auf Done und lies den Dokumentbereich erneut. Ein Fixture-Test beweist keine Live-Schreibfunktion.

Lies für einen sicheren ersten Test einen erreichbaren Bereich. Erstelle oder ändere Tasks nur in einem dafür bestimmten Testdokument. Leere Ergebnisse belegen nicht das Verhalten befüllter Task-Listen.
