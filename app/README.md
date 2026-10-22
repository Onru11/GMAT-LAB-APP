# GMAT Lab

Daily GMAT Focus practice: lessons, adaptive drills, exam-realistic section tests, flashcards,
a mental-maths sprint and spaced mistake review. React + TypeScript (Vite), installable and
offline-capable. Progress is stored in the browser and can be exported/imported as a file.

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # answer keys, progress rules, plan, scoring
npm run build      # typecheck + production build into dist/
```

Pushing to `main` runs the tests and deploys to GitHub Pages (enable Pages with source
"GitHub Actions" in the repository settings). Add `?dev` to the URL for the review panel:
jump to named states, load sample data, reset progress, switch theme.

## Sync across devices (optional)

Sync uses [Supabase](https://supabase.com) (free tier is enough). Without it the app works fully
offline on one device; the Sync card only appears once a project is configured.

1. Create a project at supabase.com.
2. **SQL Editor → New query**: paste `../supabase/schema.sql` and run it. It creates the
   `progress` table with row-level security (each user can only see their own row).
3. **Authentication → URL Configuration**: set *Site URL* to the app URL
   (e.g. `https://<user>.github.io/gmat-lab-app/`) and add it under *Redirect URLs*.
4. **Authentication → Email Templates → Magic Link**: add `Your code: {{ .Token }}` to the body,
   so the email carries a 6-digit code as well as the link (the code is what works inside the
   installed app).
5. **Project Settings → API**: copy the *Project URL* and the *anon public* key into the GitHub repo
   under **Settings → Secrets and variables → Actions → Variables** as `SUPABASE_URL` and
   `SUPABASE_ANON_KEY`, then re-run the deploy workflow. Locally, put them in `app/.env.local` as
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

Devices are merged, never overwritten: answers, tests and scores are combined; levels, cards and
mistakes take the most recent change; a mistake cleared on one device disappears on the others.
The rules are in `src/sync/merge.ts` with tests.

## Layout

- `src/content/questions.ts` – question types and the original 64 questions.
- `src/content/bank/` – the rest of the bank by area; `index.ts` combines everything.
  Every Quant and Data Insights answer is re-derived independently in the matching `*.test.ts`
  (Data Sufficiency by brute force), so a wrong key fails the build. Verbal files check structure.
- `src/content/lessons/` – two lessons per topic and the curriculum order.
- `src/progress.ts` – topic levels, adaptive picking, spaced repetition, score estimate.
- `src/plan.ts` – study phases and the daily focus item.
- `src/store.ts` – app state and actions; `src/persist.ts` – saving, migration, backup format.
- `src/sync/` – Supabase client, the sync loop and the merge rules.
- `src/screens/` – one component per screen; `src/App.tsx` is the shell.
- `src/styles/industry.css` – the Industry design system, unchanged; `src/styles/app.css` – app layer.
