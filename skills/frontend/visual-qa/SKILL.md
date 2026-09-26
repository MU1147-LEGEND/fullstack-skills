---
name: visual-qa
description: >-
  Use when conducting frontend code and UI design reviews, catching layout
  overflows, alignment flaws, contrast issues, or inspecting aesthetic
  polish before release. Requires actually viewing the rendered UI — not a
  code-only review — before any check in this skill can be marked passed.
---

# Visual QA & Design Review

Visual QA is the final quality-control barrier between implementation and
release. It catches inconsistent spacing, broken layouts, generic AI
aesthetics, missing interactive states, and unpolished edge cases.

## 0. How to Actually Verify (read this before checking anything below)

**A checklist item is only "passed" if you saw the rendered result. Reading
your own markup/CSS and reasoning about how it should look is not
verification — it's a prediction, and predictions miss real layout bugs
(overflow, misalignment, broken wraps) constantly.**

Before running the checklist in Section 1:

1. **Check what's available in this environment first** — a browser/preview
   tool, a screenshot tool, a dev server you can open and view, an artifact
   preview, or any other way to see the actual rendered page. Don't assume
   none exists; check.
2. **If a way to view the render exists:** use it. Capture or open the page
   at minimum at a mobile width (~375px) and a desktop width (~1440px).
   Run every check in Section 1 against what you actually see, not against
   what the code was supposed to produce.
3. **If nothing exists to view the render:** say so explicitly to the user
   — e.g. "I don't have a way to render/screenshot this here, so I can only
   review the code — treat this as a best-effort read, not a confirmed
   visual QA pass." Then still run Section 1 as a code-level review, but
   never present it as if it were a verified visual check.
4. **If you can render but not capture automatically** (e.g. only a live
   preview the user can see): ask the user to confirm what they see, or to
   paste back a screenshot, before marking spacing/alignment/responsive
   checks as passed.
5. **Never silently skip this step.** Claiming "hierarchy looks good,
   spacing is consistent" without having done one of 2–4 above is the
   single most common way this skill produces false confidence.

## 1. Visual Review Checklist

Before marking any UI task complete, systematically inspect the **rendered
page** (per Section 0) against these 6 criteria:

### A. Hierarchy & Typographic Polish
- [ ] Is there an unmistakable primary focal point on the screen?
- [ ] Does the type hierarchy follow a disciplined scale rather than random sizes?
- [ ] Are headings balanced without awkward line wraps (`text-wrap: balance`)?
- [ ] Are body text blocks constrained to comfortable reading lengths (`max-w-prose`)?

### B. Spacing, Alignment & Grid Discipline
- [ ] Are padding and margin values derived consistently from the spacing scale (multiples of 8, matching `layout-composition`)?
- [ ] Are related elements grouped closely together (Law of Proximity)?
- [ ] Are elements strictly aligned to an optical axis (left, center, or right)?

### C. Interaction State Completeness
Ensure every interactive component has explicit styling for all six states —
verify these by actually triggering them (hover, click, tab to focus), not
by reading the CSS and assuming it fires correctly:
1. **Default:** Crisp and visually legible.
2. **Hover:** Immediate subtle cue (brightness shift, 1–2px lift, or border highlight).
3. **Active/Pressed:** Tactile scale change (`active:scale-[0.98]`).
4. **Focus-Visible:** High-contrast focus ring for keyboard navigation.
5. **Loading/Pending:** Skeleton or spinner that prevents Cumulative Layout Shift (CLS).
6. **Disabled:** Visual dimming (`opacity-50`) and `cursor-not-allowed` without firing hover states.

### D. Responsive & Edge Case Resilience
- [ ] **Horizontal Overflow:** Verify zero horizontal scrollbars across all screen widths — check the actual rendered mobile width, not just the CSS.
- [ ] **Dynamic Content:** What happens if a title is 100 characters long? Does it truncate or wrap gracefully?
- [ ] **Empty States:** Does the interface look broken or barren when lists/tables have 0 items?

### E. Accessibility & Contrast Verification
- [ ] Does body copy meet the minimum 4.5:1 WCAG AA contrast ratio?
- [ ] Can the entire flow be operated solely with keyboard (`Tab`, `Enter`, `Escape`)?
- [ ] Are all icon buttons equipped with `aria-label` or screen-reader text?

### F. Eliminating Generic "AI Look"
- [ ] Does the page rely on generic centered gradient hero boxes, random purple blur orbs, or repetitive 3-column cards?
- [ ] Does the interface have a coherent visual personality tailored to the product domain?

## 2. Refinement Protocol

When an audit fails any of the above checks:
1. **Never patch with hacks:** Do not use `overflow-x: hidden` to mask an overflowing child; locate and fix the child's width.
2. **Standardize tokens:** Replace arbitrary pixel values (`p-[17px]`) with design system tokens (`p-4`).
3. **Iterate immediately:** Refine the markup and styles, then re-verify per Section 0 — don't assume a fix worked without looking again.

## 3. Reporting Results to the User

When you report a visual QA pass, state which verification level it was:
- **"Verified visually"** — you actually saw the rendered page/screenshot.
- **"Code-reviewed only"** — no render was available; say this plainly
  rather than letting "QA passed" imply more confidence than you have.