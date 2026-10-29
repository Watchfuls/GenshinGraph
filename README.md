# Genshin Character Graph

React + Vite + TypeScript starter for a TierMaker-like free-position graph.

## Run locally
```bash
npm install
npm run dev
```

## Character portraits
Character portraits come from the sibling `../genshin-shared/icons/characters/`
folder. `npm run dev` and `npm run build` copy those shared assets into the
ignored `public/icons/` build input. Set `GENSHIN_SHARED_DIR` to override the
shared repository path. Missing portraits display initials.

## Deploy for free on GitHub Pages
1. Create a public GitHub repository and push this project.
2. In Settings → Pages, set Source to **GitHub Actions**.
3. Ensure the public `Watchfuls/genshin-shared` repository contains the shared
   `icons/` directory.
4. Push to `main`. The workflow checks out the shared icons, builds, and deploys
   the site.
Vite's relative `base: './'` supports project pages.

## Storage
Graph positions and labels automatically save in browser `localStorage` under
`genshin-graph-v1`. Clearing browser site data erases progress.
There is no backend and no public sharing of placements.
