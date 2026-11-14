# Combined static site

This folder is the single deploy root for free static hosting (GitHub Pages, Netlify, or Cloudflare Pages). It has not been deployed. There is no hosting account yet.

- Landing page: `index.html` (this directory)
- Projects: `lobbycart/`, `in-for-it/`, `waitwith/` (relative links, so the site also works in a project subdirectory)

## How to refresh the project copies

From `/workspace/asia-na/`:

```bash
bash sync-site.sh
```

That copies each product’s `index.html`, `styles.css`, and `app.js` into this folder. Fill `CONFIG` in the source `app.js` files first, then sync, or edit the copies here after syncing and remember they will be overwritten on the next sync.

## Config keys to fill before the forms or payments should work

- `site/lobbycart/app.js` — `FORM_ENDPOINT`, `PAYMENT_LINK_URL`, `ETRANSFER_EMAIL`, `CONTACT_EMAIL`
- `site/in-for-it/app.js` — same four keys
- `site/waitwith/app.js` — `FORM_ENDPOINT`, `CONTACT_EMAIL` only (no payments)

Leave them empty to keep forms honestly disconnected and payment steps hidden.

## Local preview

```bash
python3 -m http.server 8770
```

Open [http://127.0.0.1:8770/](http://127.0.0.1:8770/).

## SITE_BASE_URL

After the live URL is known, set `SITE_BASE_URL` in each source `app.js` (no trailing slash), e.g. `https://<github-username>.github.io/<repo>`, then rerun `bash ../sync-site.sh`. Until then, FormSubmit `_next` falls back to the current page's `#/thanks`.
