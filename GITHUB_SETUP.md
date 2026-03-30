# Lernmodul auf GitHub einrichten

## Für Lehrkräfte: Wie du das Projekt auf GitHub hochlädst

### Schritt 1: Repository erstellen
1. Besuche [github.com](https://github.com) und melde dich an
2. Klicke auf **"+"** oben rechts → **"New repository"**
3. Nenne das Repository: `daten-datenbanken`
4. Beschreibung: "Interaktives Lernmodul zu Daten und Datenbanken"
5. Wähle **Public** (damit es Schüler sehen können)
6. Klicke **"Create repository"**

### Schritt 2: Dateien hochladen
Entweder:
- **Via Git** (Profis):
  ```bash
  git clone https://github.com/dein-username/daten-datenbanken.git
  cd daten-datenbanken
  # Kopiere alle Dateien hier her
  git add .
  git commit -m "Initial commit: Lernmodul Upload"
  git push origin main
  ```

- **Via GitHub UI** (einfach):
  1. Auf deinem neuen Repository klicke **"Add file"** → **"Upload files"**
  2. Ziehe alle Dateien/Ordner hier herein
  3. Klicke **"Commit changes"**

### Schritt 3: GitHub Pages aktivieren
1. Gehe zu **Settings** (Zahnrad)
2. Scrolle zu **"Pages"**
3. Unter "Source" wähle **"main"** Branch
4. Speichern
5. Nach einigen Sekunden wird deine URL angezeigt (z.B. `https://dein-username.github.io/daten-datenbanken/`)

---

## Für Schüler: Link benutzten

Sobald die Seite aktiviert ist, können deine Schüler diese URL nutzen:

```
https://dein-username.github.io/daten-datenbanken/
```

Keine Installation erforderlich - einfach im Browser öffnen!

---

## Projektstruktur

```
daten-datenbanken/
├── index.html              ← Die Hauptseite (öffne diese!)
├── learning-advanced.js    ← Erweitertes JavaScript
├── README.md              ← Dokumentation
├── teacher-guide.md       ← Anleitung für Lehrkräfte
├── .gitignore             ← Git-Einstellungen
│
├── assets/                ← Alle Ressourcen
│   ├── css/               ← Stylesheets
│   ├── js/                ← JavaScript-Dateien
│   ├── icons/             ← SVG-Icons
│   └── webfont/           ← Schriftarten
│
├── images/                ← Alle Bilder
│   ├── Logo.png
│   ├── lessons/           ← Bilder für Kapitel
│   └── resources/         ← Generierte Bilder
│
└── data/                  ← Datendateien
    └── aufgaben.txt       ← Übungsaufgaben
```

---

## Häufige Probleme

| Problem | Lösung |
|---------|--------|
| Seite zeigt "404 Not Found" | Warte 5 Minuten, dann aktualisiere den Browser |
| CSS/Bilder laden nicht | Prüfe, dass die Struktur genau wie oben ist |
| Fortschritt wird nicht gespeichert | Verwende nicht den "Private Browsing" Mode |

---

## Weitere Hilfe

- [GitHub-Dokumentation](https://docs.github.com/en/pages)
- [GitHub Pages Setup Guide](https://pages.github.com/)
