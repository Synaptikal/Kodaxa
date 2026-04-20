# Google Search Console — Verification & Sitemap

This document explains verification options and next steps for submitting `https://kodaxa.dev/sitemap.xml`.

Recommended approach
- Primary (robust): add a DNS TXT record for `google-site-verification=YOUR_TOKEN` at your DNS provider (covers whole domain).
- Secondary (fast): add the meta tag to the site head. We've added a placeholder at `src/app/head.tsx`.
- HTML-file fallback: place Google's provided HTML file in `public/` (we added `public/google-site-verification-PLACEHOLDER.html`). Rename it to the exact filename Google gives and replace its contents with Google's file.

What I added
- `src/app/head.tsx` — contains a meta tag with content `REPLACE_WITH_GSC_TOKEN`.
- `public/google-site-verification-PLACEHOLDER.html` — placeholder HTML verification file.

How to complete verification (pick one)

1) DNS TXT (Domain property)
  - Go to your DNS provider (Cloudflare, Route53, GoDaddy, etc.).
  - Add a TXT record on the root/zone (@) with value:

    google-site-verification=YOUR_TOKEN_HERE

  - Wait for propagation (minutes to a few hours), then in Google Search Console choose "Domain" property and paste the token when prompted.

2) Meta tag (URL-prefix property)
  - In `src/app/head.tsx` replace `REPLACE_WITH_GSC_TOKEN` with the token Google provides.
  - Deploy the site (or run locally and ensure the head is present on the root page).
  - In Search Console choose the URL-prefix property (https://kodaxa.dev) and click "Verify".

3) HTML file (URL-prefix property)
  - Google will give you a filename and file content (e.g. `google1234567890abcdef.html`).
  - Rename `public/google-site-verification-PLACEHOLDER.html` to that filename and replace the file body with Google’s content.
  - Deploy and verify the URL-prefix property.

After verification — submit sitemap
  - In Search Console → Sitemaps, enter: `https://kodaxa.dev/sitemap.xml` and click Submit.
  - Monitor coverage and indexing reports; check for errors.

If you want me to finish this end-to-end:
- Paste the verification token here and tell me which method you prefer (DNS/meta/html). I will replace placeholders or prepare exact DNS text.
- If you want DNS changes automated, provide DNS provider access details (or perform the DNS step and tell me when it's set), then I will continue with verification instructions.
