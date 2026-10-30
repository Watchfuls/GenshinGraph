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

## Character tray
The unplaced-character tray supports search and multi-select filters for weapon,
element, and rarity. These filters only affect which characters are shown in
the tray; characters already placed on the graph are unchanged. Drag a
character tile to reorder it or drop it onto the graph. Use the arrow keys while
a tile is focused to reorder it with the keyboard. Use **Reset order** to restore
the default order. The custom order is saved with the graph in local storage.
When dragging a placed character back to the tray, a marker previews where it
will be inserted in the order.
