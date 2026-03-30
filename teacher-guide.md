# 👨‍🏫 Leitfaden für Lehrkräfte - Lernmodul Datenbanken

Dieses Dokument bietet Hilfestellung für Lehrkräfte zur Nutzung und Anpassung des Lernmoduls.

## 📋 Überblick

Das Lernmodul "Daten und Datenbanken" ist eine vollständig interaktive HTML5-Webseite, die Schüler selbstständig durcharbeiten können. Es kombiniert Wissensvermittlung mit verschiedenen Aufgabentypen für aktives Lernen.

## 🚀 Erste Schritte

### Installation
1. Stelle sicher, dass du den kompletten Ordner "Daten und Informationen.courselet" hast
2. Wichtig: Die `learning.html` muss im Hauptverzeichnis sein
3. Der `resources/` Ordner mit allen Bildern muss im gleichen Verzeichnis sein

### Starten
- Öffne `learning.html` einfach mit einem beliebigen Webbrowser
- Ggf. muss JavaScript im Browser aktiviert sein (Standard für alle modernen Browser)

### Testlauf
Starte einen Test, indem du alle Seiten durchgehst und die Aufgaben ausprobierst:
- Seite 1: Text speichern testen ✓
- Seite 2: Quiz ausprobieren ✓
- Seite 3: Flashcards testen ✓
- Seite 3: Matching-Spiel prüfen ✓
- Seite 4: Finale Aufgabe checken ✓

## 📊 Pädagogische Features erklärt

### 1. **Fortschrittsbalken (oben links)**
**Was?** Visualisiert Punkte: 0-30 möglich

**Wofür?** 
- Motiviert Schüler durch sichtbare Erfolge
- Zeigt, wie viel bereits gelernt wurde
- Hilft, realistische Ziele zu setzen

**Tipp für Lehrkräfte:** Besprich mit Schülern, dass nicht alle Punkte an einem Tag erreicht werden müssen – es ist ein Lernprozess!

### 2. **Interaktive Aufgaben**

#### Multiple-Choice Quiz (Seite 2)
- **Anzahl:** 2 Fragen à 1 Punkt = 2 Punkte
- **Rückmeldung:** Sofort, mit visueller Codierung
- **Pedagogie:** Überprüft Verständnis von Grundkonzepten

**Tipp:** Teile Schülern mit, dass falsche Antworten zum Lernen gehören – es ist kein Test mit Note, sondern ein Lernwerkzeug!

#### Textaufgaben (Seiten 2-5)
- **Art:** Freie Antworten, die der Schüler speichert
- **Punkte:** Jeweils 1 Punkt (manuell vergeben durch Speicherung)
- **Ziel:** Fördert tieferes Denken und Reflexion

**Tipp:** Schau dir nach dem Kurs die gespeicherten Antworten an. Sie zeigen das Verständnis besser als MC-Fragen!

#### Matching-Aufgaben (Seite 4)
- **Typ:** Zuordnungsspiel (5 Begriffspaare)
- **Punkte:** 3-5 Punkte möglich
- **Effekt:** Gefestigt Vokabular und Definitionen

**Tipp:** Dieses Spiel kann bei Bedarf auch als Wiederholung am Klassenende eingesetzt werden!

#### Flashcards (Seite 4)
- **Anzahl:** 3 Karten
- **Inhalt:** Wichtigste DB-Merkmale
- **Nutzung:** Klick zum Umschalten von Frage zu Antwort

**Tipp:** Perfekt zum Üben vor Tests – Schüler können diese immer wieder durchgehen!

### 3. **Bildmaterial**
- Alle Bilder können angeklickt werden zum Vergrößern
- Wichtig für visuelle Lerner
- ESC oder Klick außen zum Schließen

## 🎯 Lernziele pro Kapitel

| Kapitel | Inhalt | Lernziel | Bewertung |
|---------|--------|----------|-----------|
| **Startseite** | Orientierung | Schüler kennt Thema und Struktur | Information |
| **Daten im Alltag** | Alltagesbezug + Grundbegriffe | Versteht Daten vs. Informationen | Max. 2 Punkte |
| **Modellierung** | Konzeptverständnis | Kann Modelle analysieren | Max. 1 Punkt |
| **Datenbanksystem** | Praktisches Verständnis | Kennt DB-Komponenten & Merkmale | Max. 14 Punkte |
| **Relationale DB** | Anwendung | Kann Datenrepräsentation kritisieren | Max. 10 Punkte |

**Gesamtpoints:** 30 Punkte = 100%

## 💻 Technische Hinweise für Lehrkräfte

### Browser-Kompatibilität
✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

Ältere Browser können Probleme verursachen!

### Lokale Speicherung
- Fortschritt wird im Browser gespeichert (localStorage)
- Keine Server notwendig
- Beim Löschen des Browser-Cache wird der Fortschritt gelöscht
- Schüler können auf verschiedenen Geräten unterschiedliche Fortschritte haben

### Datenschutz
✅ Keine Daten werden zu Server hochgeladen  
✅ Alles bleibt lokal beim Schüler  
✅ DSGVO-konform (keine Tracking)

## 🔄 Workflow für den Unterricht

### **Tag 1: Einstieg**
1. Schüler öffnen die Seite
2. Lest gemeinsam die Startseite
3. Erkläre den Fortschrittsbalken
4. Schüler bearbeiten Seite 1-2 (ca. 20 Min)
5. Besprecht das Quiz als Klasse

### **Tag 2: Tieferer Einstieg**
1. Wiederholung der Grundbegriffe (nutze Flashcards)
2. Schüler arbeiten Seite 3 durch (ca. 30 Min)
3. Matching-Spiel im Unterricht machen (gemeinsam oder in Gruppen)
4. Diskutiere die DB-Merkmale

### **Tag 3: Praktische Anwendung**
1. Schüler bearbeiten Seite 5
2. Analysiert gemeinsam die Screenshots
3. Diskutiert, warum gute Datenrepräsentation wichtig ist
4. Schüler können weitere Beispiele aus ihrer Umgebung finden

### **Tag 4-5: Wiederholung & Vertiefung**
1. Schüler, die nicht alle Punkte haben, arbeiten weiter
2. Für andere: Challenge-Aufgaben:
   - Entwirf eine kleine Datenbank für [X]
   - Finde fehlerhafte Datenrepräsentationen im Web
   - Erstelle ein Modell für [Problem]

## 📈 Bewertungs-Vorschläge

### Option A: Punkte-basiert
- 25-30 Punkte: Sehr gut (1)
- 20-24 Punkte: Gut (2)
- 15-19 Punkte: Befriedigend (3)
- 10-14 Punkte: Ausreichend (4)
- < 10 Punkte: Unzureichend (5)

### Option B: Porfolio-basiert
1. Fortschritt (30%) – wie viele Punkte erreicht?
2. Qualität der schriftlichen Antworten (40%) – liest durch!
3. Beteiligung in Diskussionen (30%)

### Option C: Bestanden/Nicht bestanden
- **Bestanden:** Mindestens 15 Punkte + alle Aufgaben versucht
- **Nicht bestanden:** Unter 15 Punkte oder Aufgaben nicht versucht

**Empfehlung:** Option B ist für Schüler am fairsten, da sie Verständnis über bloße Punkte bewertet!

## 🎨 Anpassungsmöglichkeiten

### Text ändern
1. Öffne `learning.html` mit einem Texteditor (Notepad++, VSCode, etc.)
2. Suche nach `<h1>` oder `<p>`Tags
3. Ändere den Text zwischen den Tags
4. Speichern und neu laden

### Aufgaben hinzufügen
Kopiere einen Block wie:
```html
<div class="exercise-box">
    <div class="exercise-title">✏️ Titel</div>
    <textarea class="text-input" id="newTask" rows="6"></textarea>
    <button class="btn btn-primary btn-submit" onclick="saveMemo('newTask')">Speichern</button>
</div>
```

### Farben ändern
Öffne `learning.html` und suche nach CSS-Variablen:
```css
:root {
    --primary-color: #2563eb;     /* Blau */
    --success-color: #16a34a;     /* Grün */
    --warning-color: #ea580c;     /* Orange */
}
```

Ändere die Hex-Codes!

### Neue Seite hinzufügen
1. Kopiere einen ganzen `<div id="page-X">` Block
2. Ändere die ID (z.B. page-5)
3. Füge einen Link im Menü hinzu:
```html
<li class="nav-item">
    <a class="nav-link" data-page="page-5" onclick="navigateToPage(5)">
        📚 Neue Seite
    </a>
</li>
```
4. Aktualisiere die `navigateToPage()` Funktion

## 🐛 Häufige Probleme & Lösungen

### Problem: Bilder werden nicht angezeigt
**Ursache:** Falscher Pfad oder fehlender Ordner  
**Lösung:** Stelle sicher, dass `resources/` im gleichen Verzeichnis is wie `learning.html`

### Problem: Fortschritt wird nicht gespeichert
**Ursache:** LocalStorage deaktiviert oder privates Browsing  
**Lösung:** 
- Schüler sollen normales Browsing nutzen, nicht Privatmodus
- LocalStorage in den Browser-Einstellungen aktivieren

### Problem: Quiz-Antworten bleiben nach Neustart bestehen
**Ursache:** Beabsichtigtes Verhalten (Schüler kann seine Antwort sehen)  
**Lösung:** Normale Situation! Der Fortschritt soll erhalten bleiben.

### Problem: Seite lädt langsam
**Ursache:** Zu viele/große Bilder oder langsame Internet  
**Lösung:** 
- Optimiere Bilder (reduziere Größe)
- Nutze lokale Datei statt über Internet

## 📝 Checkliste für die Vorbereitung

- [ ] Habe alle Dateien im richtigen Ordner
- [ ] Habe learning.html im Browser getestet
- [ ] Konnte alle Aufgaben bearbeiten
- [ ] Bilder werden angezeigt
- [ ] Fortschritt wird gespeichert
- [ ] JavaScript ist im Test-Browser aktiviert
- [ ] Habe die Lernziele mit meinen Schülern besprochen
- [ ] Weiß wie ich die Seite für meine Klasse anpasse

## 🎓 Tipps für erfolgreiche Nutzung

### **Mit Schülern**
1. **Klare Erwartungen:** Erkläre, dass das ein Lern-Tool ist, kein Spiel
2. **Regelmäßigkeit:** Besser 2x 15 Min als 1x 60 Min
3. **Beteiligung:** Nutze die Aufgaben als Grundlage für Diskussionen
4. **Fehler-Kultur:** Falsche Antworten sind Lernchancen!

### **Bei dir zu Hause (Hausaufgaben)**
1. Schüler arbeiten im eigenen Tempo
2. Können beliebig oft zurückgehen
3. Müssen alle Aufgaben versuchen (nicht nur die, die Punkte bringen)

### **Für Vertretungsstunden**
- Perfekt! Schüler können selbstständig arbeiten
- Hinterlasse eine Notiz, bis zu welcher Seite sie kommen sollen

## 📞 Support & Kontakt

Falls die Seite nicht funktioniert:
1. Stelle sicher, dass alle Dateien vorhanden sind
2. Versuche es mit einem anderen Browser
3. Prüfe, dass JavaScript aktiviert ist
4. Cache löschen und neu laden (Strg+Shift+Del)

## 🔗 Nützliche Erweiterungen

Diese Extensions könnten hilfreich sein:
- **Screencastify:** Für Lernvideos
- **Padlet:** Zum Sammeln von Schülerantworten
- **Quizlet:** Für Flashcard-Ergänzungen
- **Kahoot:** Für gamifiziertes Quiz-Finale

---

**Version:** 1.0  
**Letztes Update:** 2026  
**Für Fragen:** Konsultiere das README.md oder probiere selbst die Seite aus!

Viel Erfolg beim Einsatz! 🌟
