# Where's My Seat

A small React + Vite web app that lets wedding guests find their table. Guests
type their name into a search box with an autocomplete dropdown and see their
table number. A "Show all tables" view lists every table and its guests.

Deployed as a static site to GitHub Pages on the custom domain
`salam.nsufi.com`.

## Local development

Uses Node 24 (see [`.nvmrc`](.nvmrc)). If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use
```

Then install and run:

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To type-check and build a production bundle:

```bash
npm run build
npm run preview   # serve the built site locally
```

## Editing the guest list

The guest list is a plaintext file at [`src/data/guests.json`](src/data/guests.json).
Each entry looks like:

```json
{ "firstName": "Robert", "lastName": "Smith", "aliases": ["Bob", "Bobby"], "table": 4 }
```

- `firstName` / `lastName` — the guest's name as it should be displayed.
- `aliases` — optional list of nicknames the guest might search by (matched
  against the real last name). Use `[]` if there are none.
- `table` — the table number.

Search is case-insensitive and ignores accents/extra spaces. To update seating,
edit this file and commit; the deploy workflow rebuilds the site automatically.

> Note: because this is a static site, the guest list ships in plaintext to the
> browser. Keep the repository private if the seating chart is sensitive.

## One-time GitHub Pages + domain setup

1. Create the repo and push:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/nhsufi/wheres-my-seat.git
   git push -u origin main
   ```

2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source**,
   choose **GitHub Actions**. The included workflow
   ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) builds and
   deploys on every push to `main`.

3. **Custom domain:** the file [`public/CNAME`](public/CNAME) already contains
   `salam.nsufi.com`, so GitHub Pages will use it. At your DNS provider, add a
   record:

   | Type  | Name    | Value               |
   | ----- | ------- | ------------------- |
   | CNAME | `salam` | `nhsufi.github.io.` |

4. Back in **Settings → Pages**, confirm the custom domain shows
   `salam.nsufi.com` and (once DNS propagates) enable **Enforce HTTPS**.

## Project structure

```
src/
  App.tsx                 view state: search | tables
  App.css                 styling + color palette
  components/
    SearchBox.tsx         autocomplete search
    AllTables.tsx         all-tables view
  lib/matcher.ts          name normalization + filtering
  data/
    guests.ts             typed loader
    guests.json           the guest list (edit this)
public/CNAME              custom domain for GitHub Pages
.github/workflows/deploy.yml
```
