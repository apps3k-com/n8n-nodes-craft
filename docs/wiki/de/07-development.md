# 07 · Workflow-Beispiele

Dokumentliste lesen: Verbinde Manual Trigger mit Craft Documents, wähle Document → List, hinterlege die Zugangsdaten und führe den Node aus. Prüfe die zurückgegebenen IDs vor weiteren abhängigen Schritten.

Tasks lesen: Wähle mit einer passenden Space-Verbindung und Node v2 Task → Get und Inbox. Für Tasks eines bestimmten Dokuments verwende den Bereich Document und wähle das Dokument aus.

Collection-Zeile ändern: Wähle die Collection, verwende in v2 Item Selection → Select Item oder übergib eine vorhandene Zeilen-ID. Fülle nur die Felder aus, die du ändern möchtest.

Datei hochladen: Verbinde einen Node mit Binärdaten mit File → Upload. Passe Input Binary Field an den Namen der Binär-Eigenschaft an und wähle Seite, Datum oder benachbarten Block als Ziel.

Bestehenden Task ändern: Übernimm die Task-ID aus einem vorherigen Schritt und verwende Update. Nutze Add nur, wenn ein neuer Task entstehen soll. Wiederholtes Add kann einen weiteren Task erzeugen.

Verwende ein eigenes Testdokument für schreibende Beispiele. Lies Änderungen zurück, bevor du den Workflow auf weitere Items ausweitest. Beginne mit einem einzelnen eingehenden Item und erweitere die Eingabe erst bei korrektem Ergebnis.
