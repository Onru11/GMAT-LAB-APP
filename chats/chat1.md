# Mobile app design brief

_Started 2026-10-22 15:36 UTC_

---

## User

Design a mobile app for

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: update_todos]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I've built **GMAT Lab.dc.html** as one clickable prototype; it's out for a final review now. A side panel switches dark/light mode and phone/desktop, and lets you jump straight to any state: start of day, mid-session, session complete, every lesson step, the question runner (unanswered, correct, wrong on a Data Sufficiency question, Critical Reasoning over time, data table), flashcards, sprint and its end screen, tests and results, and the empty states.

- **Today queue:** each item opens its activity, and finishing it checks it off. When all five are done, the "Session complete" state appears and the streak goes up by one.
- **Question runner:** the timer turns red after 2:00. Picking a "Why did you miss it?" reason adds the question to Mistakes.
- **Logging a score:** the form checks the ranges (total 205–805, sections 60–90) and adds the score to the chart.

Three things differ from your brief:
- **Visual style:** the project has the Industry design system attached, so I used its Barlow fonts and steel-blue accent instead of Bricolage Grotesque, Source Sans 3, JetBrains Mono and #1F5FBF. I kept the grid paper, the yellow highlighter only on "Do this next", and green/red/amber only for right, wrong and traps. Numbers use Barlow Condensed with fixed-width digits instead of a mono font.
- **Desktop:** the desktop toggle applies to all screens, not just Today and the runner. On wide screens Today and the runner switch to two columns.
- **Content is a sample:** there are 5 questions and the practice test stops after 4, even though it says "of 21". The results screen and mistake counts are fixed sample data, so they don't reflect your answers.

Tweaks: dark mode, desktop, and the target score (the meter, the chart's target line and the "to target" number update when you change it).

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I've fixed the labels on the Progress score-history chart, and it's back out for review. The axis values (400–700), the exam scores, the dates and "Target 705" weren't showing before. The line and target line are still drawn the same way; only the text labels and score points are now placed on top of the chart.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

I fixed the secondary grey text in dark mode, which was nearly invisible on every screen. It was still using the light-mode text colour; dark mode now has its own lighter grey. The page loads with no errors, but I skipped the full re-check for this one-line change, so dark mode hasn't been looked at again.

