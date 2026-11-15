# Google Ratings & Reviews setup

This update uses the Google Places API (New) on the server, not hard-coded/fabricated reviews.

1. Find the **Place ID** for the correct Saksham Furniture listing at https://developers.google.com/maps/documentation/places/web-service/place-id . Verify it matches https://maps.app.goo.gl/xgejacoV8shzLoXr9 .
2. In Google Cloud enable **Places API (New)**, configure billing, and create a restricted API key. API requests may incur charges.
3. In Netlify environment variables, set `GOOGLE_PLACE_ID` and `GOOGLE_PLACES_API_KEY`. Redeploy the site.
4. Google Places returns a limited selection of reviews, not necessarily all reviews. Rating and count update with server-side cache (up to ~1 hour). The Google Maps link always opens the full listing.
5. If credentials are absent or the API fails, the page does not show fabricated ratings/reviews. It displays a link to genuine Google reviews instead.

The key must never be placed in a `NEXT_PUBLIC_` variable or committed to GitHub.
