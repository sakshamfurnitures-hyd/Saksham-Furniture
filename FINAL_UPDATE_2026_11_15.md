# Saksham Furniture – latest approved ZIP update (15 Nov 2026)

- Based exclusively on the user-uploaded latest Next.js ZIP.
- Google Sheets headers: `mrp`, `offer price`, `best selling` (also handles legacy variants).
- Best Selling Products selects products flagged `yes`, rather than the first 8 products.
- Catalogue: 3 retries, no-store API requests, 60-second last-success memory cache, error states instead of caching empty failures. Note: memory cache is per running server instance, not a durable cross-instance backup.
- Mobile category photos 1:1, menu borders green, logo shifted 5px, quick category pills shorter, banner height increased ~20%.
- Product actions: Order on WhatsApp, Buy on Phone, Visit Shop; Customize on WhatsApp.
- WhatsApp messages include product page URL; Open Graph preview uses product image where accessible. WhatsApp preview is controlled by WhatsApp and cannot be guaranteed.
- Netlify badge: not modified. Netlify injects it and dashboard says hiding it requires a paid plan.
- Existing brand logo, straight strips, desktop design and other approved features retained.
