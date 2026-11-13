# Saksham Furniture — Complete Next.js website

Next.js 15 App Router + Tailwind CSS, retaining the approved Phase 2 design.

## Start locally

```bash
npm install
npm run dev
```

## Netlify / GitHub

Push **contents of this folder** to the repository root. Netlify: import GitHub repository, build command `npm run build`, Next.js runtime automatically detected. Do not use `next export` or manually set `.next` as a static publish folder for server-rendered product metadata.

Set environment variables in Netlify: `GOOGLE_SHEETS_API_URL` (existing public Apps Script JSON endpoint) and `NEXT_PUBLIC_SITE_URL` (the exact temporary `https://...netlify.app` URL). Redeploy after setting these variables. On production set `NEXT_PUBLIC_SITE_URL=https://sakshamfurniture.in`.

## Catalogue

The same Google Sheet fields are used: id, name, category, size, storage, material, price, description, image_url, status, featured. Rows are grouped into product variants; price is taken from the preferred/default variant. The server caches API data for five minutes. Sheet edits require no deployment but may take up to 5 minutes to appear. Product pages generate server-side Open Graph metadata for social previews. Product photos must be public, directly fetchable HTTPS image URLs; Google Drive thumbnail URLs may not be reliable for social bots. The URL in the social preview is only guaranteed after deployment and validation with WhatsApp/Facebook sharing debuggers.

The homepage shows featured products when live Sheet data is available; when the API is unavailable, no invented products are shown. Search works on product name/category/description/material. Product variant selector and WhatsApp ordering are included.

## PWA

The manifest and service worker allow installation on supported mobile browsers over HTTPS. The offline page is a fallback, not an offline catalogue.

## Reviews

The Google Reviews section links to the existing Google Maps listing. It does not invent star ratings or scrape live reviews. Live review cards require an authorized API or approved reviews data source.

## Limits / verification

Server-rendered pages and image requests consume Netlify Free resources; no zero-credit guarantee. Test in a Netlify preview URL before connecting your domain. `NEXT_PUBLIC_SITE_URL` must match the current deployment domain for absolute social metadata.
