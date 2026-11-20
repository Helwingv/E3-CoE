# E³ CoE (Center Of Excellence) website

A Smith Gruppe crossover of the Vision 8:28 site theme, built with Astro, React and Tailwind.

## Run locally

```sh
npm install
cp .env.example .env   # add the Supabase URL and anon key
npm run dev
```

## Brand

- Base color: `#5B9BD5` (Tailwind `e3`, with shades `e3-50` to `e3-900`)
- Logos: `public/images/e3coe-logo-{small,medium,large}.png`
- Name, tagline, mission, vision, purpose and contact details: `src/config/site.ts`
- Menu: `src/config/nav.ts`

## Deploy (Netlify)

Connect this repository in Netlify. `netlify.toml` sets the build command (`npm run build`), the publish folder (`dist`) and redirects from the old Advocacy pages. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under environment variables. E3 CoE uses the same Supabase project as Vision 8:28 but its own `e3_*` tables (see `src/lib/tables.ts` and the latest migration), so content stays separate.
