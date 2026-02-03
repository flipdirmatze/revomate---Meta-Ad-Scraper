# Meta Ad Scraper by revomate

Analysiere Meta (Facebook/Instagram) Werbeanzeigen mit KI. Finde Hooks, erstelle Beschreibungen und transkribiere Videos automatisch.

[![Run on Replit](https://replit.com/badge/github/revomate/meta-ad-scraper)](https://replit.com/new/github/revomate/meta-ad-scraper)

---

## Schnellstart (Keine Installation nötig!)

### Schritt 1: Fork auf Replit
Klicke auf den **"Run on Replit"** Button oben. Du wirst zu Replit weitergeleitet.

### Schritt 2: Erstelle einen Replit Account
Falls du noch keinen hast - kostenlos und dauert 30 Sekunden.

### Schritt 3: API Keys als Secrets hinzufügen
1. Klicke links in der Sidebar auf das **Schloss-Symbol (Secrets)**
2. Füge diese zwei Secrets hinzu:

| Key | Wo bekommst du ihn? |
|-----|---------------------|
| `APIFY_TOKEN` | [console.apify.com/account/integrations](https://console.apify.com/account/integrations) |
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

### Schritt 4: Starten
Klicke auf den grünen **Run** Button. Das Tool startet automatisch!

---

## Features

- **Meta Ad Library Scraping** - Finde alle Ads einer Brand
- **Video-Analyse mit Gemini 2.5 Pro**
  - Hook-Erkennung (erste 5-10 Sekunden)
  - Automatische Beschreibung
  - Vollständiges Transcript mit Timestamps
- **Export** - Kopiere oder lade als JSON herunter

---

## Für Entwickler (Lokale Installation)

Falls du das Tool lokal ausführen möchtest:

```bash
# Repository klonen
git clone https://github.com/revomate/meta-ad-scraper.git
cd meta-ad-scraper

# Dependencies installieren
npm run install:all

# .env Datei erstellen
cp .env.example .env
# Füge deine API Keys in die .env Datei ein

# Starten
npm run dev
```

Das Tool läuft dann auf `http://localhost:5173`

---

## API Keys bekommen

### Apify Token (für Scraping)
1. Gehe zu [apify.com](https://apify.com) und erstelle einen Account
2. Navigiere zu **Settings > Integrations**
3. Kopiere deinen **API Token**

Kosten: ~$0.75 pro 1.000 Ads

### Gemini API Key (für Video-Analyse)
1. Gehe zu [aistudio.google.com](https://aistudio.google.com)
2. Klicke auf **Get API Key**
3. Erstelle einen neuen Key

Kosten: Kostenlos bis zu bestimmten Limits

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Scraping**: Apify (Facebook Ads Library Scraper)
- **KI-Analyse**: Google Gemini 2.5 Pro

---

## Support

Fragen? Schreib mir auf [LinkedIn](https://linkedin.com/in/revomate) oder erstelle ein [Issue](https://github.com/revomate/meta-ad-scraper/issues).

---

Made with precision by **revomate**
