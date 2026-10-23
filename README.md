# Genshin Character Graph

React + Vite + TypeScript starter for a TierMaker-like free-position graph.

## Run locally
```bash
npm install
npm run dev
```

## Character portraits
Place images in `public/characters/` named by lowercase kebab-case character name:
`furina.png`, `raiden-shogun.png`, `hu-tao.png`, etc.
Missing portraits display initials. The included roster is a starter list; update
`src/characters.ts` with newer characters and exact desired naming.

## Deploy for free on GitHub Pages
1. Create a public GitHub repository and push this project.
2. In Settings → Pages, set Source to **GitHub Actions**.
3. Add the workflow file from `.github/workflows/deploy.yml`.
4. Push to `main`. The workflow builds and deploys the site.
Vite's relative `base: './'` supports project pages.

## Storage
Graph positions and labels automatically save in browser `localStorage` under
`genshin-graph-v1`. Clearing browser site data erases progress.
There is no backend and no public sharing of placements.
