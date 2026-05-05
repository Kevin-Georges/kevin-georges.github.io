# Kevin Georges — Portfolio

Static portfolio site, deployable on GitHub Pages.

## Edit content
- **Bio + sections:** `index.html`
- **Project cards:** edit the `projects` array in `script.js`
- **Colors / theme:** CSS variables at the top of `style.css`

## Local preview
Open `index.html` in a browser, or run any static server:
```
python -m http.server 8000
```
Then visit http://localhost:8000.

## Deploy on GitHub Pages

### Option A — Project site (current repo name)
1. Push to `main`.
2. GitHub → Settings → Pages → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. URL: `https://kevin-georges.github.io/kevingeorgesportfolio.io/`

### Option B — User site (recommended, cleaner URL)
Rename this repo to `kevin-georges.github.io` (must match your username exactly).
After enabling Pages, it will live at `https://kevin-georges.github.io/`.
