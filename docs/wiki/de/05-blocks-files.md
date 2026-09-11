# 05 · Blöcke, Dateien und Workflows

Block-Operationen lesen, ergänzen, ändern, verschieben, löschen oder durchsuchen Inhalte. Wähle je nach Node das benötigte Dokument beziehungsweise die Seite oder das Datum einer Tagesnotiz. Beim Einfügen bezieht sich Start/End auf die übergeordnete Seite; Before/After auf einen benachbarten Block. Gib keine widersprüchlichen Positionen an.

Der Upload erfolgt über File → Upload oder Block → Upload File. Das eingehende Item muss Binärdaten enthalten. Input Binary Field ist standardmäßig data. Start/End benötigt Seite oder Datum, Before/After eine Sibling Block ID.

Uploads liefern blockId, assetUrl und fileName. File Name kann den Namen in der Ausgabe überschreiben; dadurch zeigt Craft keinen Dateinamen am hochgeladenen Block an. Pro eingehendem Item wird eine Datei hochgeladen. Der Upload-Endpunkt von Craft ist experimentell.

Lesender Workflow: Manual Trigger → Craft Documents → Document → List. Prüfe die zurückgegebenen IDs, bevor du abhängige Schritte ergänzt. Datei-Workflow: ein Node mit Binärdaten → Craft File → Upload, mit demselben Namen der Binär-Eigenschaft.

Mehrere Schreibvorgänge verarbeitet n8n über einzelne eingehende Items. Wiederhole Add-Operationen nicht blind: Sie können weitere Objekte erzeugen. Behalte IDs und verwende Update für bestehende Inhalte. Prüfe den Bereich erneut, bevor du Löschen oder Verschieben testest.
