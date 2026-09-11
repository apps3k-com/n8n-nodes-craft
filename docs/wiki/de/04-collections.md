# 04 · Collections

Collections sind strukturierte Tabellen in Craft-Dokumenten. Wähle eine Collection, um ihr Schema zu laden. Add Items und Update Items zeigen unterstützte typisierte Felder an; ein selbst geschriebenes JSON ist dafür nicht erforderlich.

Das Mapping unterstützt unter anderem Text, Zahlen, Datums- und Auswahlfelder. Aktuelle select-Schemas mit Textoptionen und ältere singleSelect-Schemas mit Objektoptionen werden erkannt. Spalten und Auswahlwerte stammen aus dem Live-Schema.

Relationen: Wähle das Relationsfeld und die Zielzeilen. Die Beschriftung verwendet das Titelfeld der Ziel-Collection. Die Verbindung muss diese Collection lesen können, damit die Auswahl befüllt wird.

Update Items bietet in v2 über Item Selection → Select Item eine benannte Zeilenauswahl. Map Item ID bleibt der Standard für bestehende Automatisierungen und Ausdrücke. Übernimm IDs aus vorherigen Schritten für wiederholbare Updates.

Bei Schema- oder Authentifizierungsfehlern zeigt die Auswahl den Fehler an. Das ist keine leere Collection. Prüfe Zugangsdaten, Verbindungsbereich und Collection-ID. Wähle die Collection nach Änderungen an Zugangsdaten oder Schema erneut aus.
