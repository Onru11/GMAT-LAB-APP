# GMAT Lab

React + TypeScript (Vite) build of the Claude Design prototype in `../project/GMAT Lab.dc.html`.

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
```

Add `?dev` to the URL for the review panel from the prototype: jump to any named state
(mid-session, wrong answer, empty states…), switch light/dark, and move the target score.

## Layout

- `src/data.ts` – all sample content (questions, decks, topics, phases, scores).
- `src/store.ts` – app state and actions (routing, queue, runner, lesson, flashcards, sprint, score log).
- `src/screens/` – one component per screen; `src/App.tsx` is the shell
  (side nav at ≥ 900px wide, bottom tab bar below).
- `src/styles/industry.css` – the Industry design system, unchanged.
  `src/styles/app.css` – right/wrong/trap colours, highlighter, grid paper, dark theme, animations.

Theme follows the system setting and is remembered once switched. Content is sample data, as in the
prototype: 5 questions, the test stops after 4, and results/mistake counts are fixed.
