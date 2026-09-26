---
name: use-frontend
description: >
  Master entry point and router for all frontend UI/UX work. Trigger this
  automatically whenever the user asks to build, create, redesign, style,
  polish, or review any web page, landing page, dashboard, component,
  or interface — even if they don't say "design" or name a specific skill.
  This skill does not contain design rules itself; it decides which
  specialist skill(s) from this collection (frontend-ui-ux, typography,
  layout-composition, responsive-design, design-inspiration,
  shadcn-design-system, motion-interaction, accessibility, visual-qa) to
  load for the task at hand.
---

# Frontend Skill Router

You are choosing which specialist skill(s) to pull in for a frontend task.
Never skip straight to code without going through this routing step first.

## Step 1 — Always load first

For ANY frontend build, redesign, or styling task, load `frontend-ui-ux`
first. It sets the design-first mindset (understand product/users/hierarchy
before touching code) and lists the anti-patterns to avoid. Everything else
in this router branches off it.

## Step 2 — Match the task to specialist skill(s)

Load additional skills based on signals in the request. A single task often
needs more than one — load all that apply, not just the first match.

| Signal in the request | Load |
|---|---|
| New page/feature/component from a blank slate, no strong direction yet | `design-inspiration` |
| Headings, font choice, hierarchy, "text looks off/boring", readability | `typography` |
| Bangla/Bengali text, bilingual Bangla+English UI, Bengali fonts, line-height, matras | `bangla-typography` |
| Page structure, section order, whitespace, "feels cluttered" or "feels empty" | `layout-composition` |
| Mobile/tablet behavior, breakpoints, "broken on phone", touch targets | `responsive-design` |
| Uses shadcn/ui, Radix, Tailwind tokens, component variants, theming | `shadcn-design-system` |
| Hover/focus/loading states, transitions, "feels static or lifeless" | `motion-interaction` |
| Forms, keyboard nav, screen readers, contrast, WCAG, inclusive design | `accessibility` |
| Reviewing, auditing, or finishing an existing UI; before calling anything "done" | `visual-qa` |

If the request doesn't clearly match a row, default to `frontend-ui-ux` +
`layout-composition` + `bangla-typography` (if there's Bangla/Bengali text)
 or `typography` (if only English) — the three that shape most first drafts.

## Step 3 — Always close with visual-qa

Before telling the user a UI task is complete, load `visual-qa` and run its
checklist against the actual result — not from memory of what you intended
to build.

**Critical: don't just self-report the checklist.** Reading code back and
declaring "hierarchy looks good, spacing is consistent" without seeing the
rendered page is unreliable — layout and spacing bugs are very hard to catch
from markup alone. Whenever a screenshot, browser preview, or rendering tool
is available in this environment, use it to actually view the built page
before signing off on `visual-qa`. If no such tool is available, say so
explicitly rather than presenting an unverified visual check as confirmed.

## Step 4 — Multiple rounds are normal

If `visual-qa` surfaces an issue, route back to the specific specialist skill
that owns it (e.g. a contrast failure → `accessibility`, an awkward mobile
stack → `responsive-design`) rather than re-reading all of them.
