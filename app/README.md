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

## Layout

- `src/content/questions.ts` – question types and the original 64 questions.
- `src/content/bank/` – the rest of the bank by area; `index.ts` combines everything.
  Every Quant and Data Insights answer is re-derived independently in the matching `*.test.ts`
  (Data Sufficiency by brute force), so a wrong key fails the build. Verbal files check structure.
- `src/content/lessons/` – two lessons per topic and the curriculum order.
- `src/progress.ts` – topic levels, adaptive picking, spaced repetition, score estimate.
- `src/plan.ts` – study phases and the daily focus item.
- `src/store.ts` – app state and actions; `src/persist.ts` – saving, migration, backup format.
- `src/screens/` – one component per screen; `src/App.tsx` is the shell.
- `src/styles/industry.css` – the Industry design system, unchanged; `src/styles/app.css` – app layer.
