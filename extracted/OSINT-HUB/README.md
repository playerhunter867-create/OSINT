# OSINT Hub

A GitHub-ready integration of the **OSINT Framework** catalog and **Sherlock** username enumeration engine, with a dark terminal-style web interface.

## What is included

- `index.html` — full OSINT catalog UI, searchable and filterable.
- `sherlock.html` — dedicated Sherlock results page.
- `styles.css` — responsive terminal/matrix-inspired UI.
- `app.js` — catalog loading, search, filtering and rendering.
- `osint-framework/` — upstream OSINT Framework source and catalog.
- `sherlock-engine/` — upstream Sherlock source.
- `api/` — FastAPI integration exposing the catalog and username scan.
- `.github/workflows/pages.yml` — optional GitHub Pages deployment.

The catalog can run on GitHub Pages without the API because the bundled `osint-framework/public/arf.json` is loaded directly. Sherlock scans require the FastAPI service.

## Run locally

### Static catalog

From the repository root:

```bash
python -m http.server 8080
```

Open `http://127.0.0.1:8080/`.

### Sherlock API

```bash
cd api
python -m venv .venv
# Linux/macOS
source .venv/bin/activate
# Windows
# .venv\Scripts\activate

pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

The API exposes:

- `GET /api/health`
- `GET /api/catalog`
- `GET /api/username/{username}`

The Sherlock page defaults to `http://127.0.0.1:8000`. If your API is hosted elsewhere, set the browser value `localStorage.osint_api` to its base URL.

## GitHub Pages

Enable **GitHub Actions** as the Pages source. The included workflow deploys the repository root. The catalog works as a static site; the Sherlock API should be deployed separately if you want live scans from the public Pages site.

## Attribution and licensing

The upstream projects remain in their own directories and their original license files are retained. This integration is not affiliated with the upstream OSINT Framework or Sherlock projects.

Use OSINT tools only for lawful, authorized research and respect the terms and privacy policies of the services you query.


## Dashboard

Open `dashboard.html` for the unified target workspace. It supports USERNAME, EMAIL, DOMAIN, IP and PHONE target types, catalog-backed launchers, integrated Sherlock username checks, and a temporary browser-local investigation session with JSON export. It does not attempt to bypass authentication or access private data.
