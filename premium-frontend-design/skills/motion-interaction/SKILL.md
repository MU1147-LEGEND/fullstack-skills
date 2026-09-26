---
name: motion-interaction
description: >-
  Use when designing UI micro-interactions, state transitions, hover and
  focus feedback, scroll animations, spring physics, or implementing
  Framer Motion and CSS transitions.
---

# Purposeful Motion & Interaction Design

Motion in user interfaces provides spatial context, tactile feedback, and perceived performance. Motion should be functional, subtle, and snappy, never decorative clutter that slows down the user.

## 1. Timing & Duration Guidelines

- **Micro-Interactions (buttons, toggles, badges, dropdown items):**
  - Duration: **100ms – 175ms**.
  - Must feel instant and responsive to direct physical input.
- **Surface Transitions (modals, dropdown menus, sheets, drawers):**
  - Duration: **200ms – 300ms**.
  - Smooth expansion or slide-in with subtle fade.
- **Page Transitions & Major Section Reveals:**
  - Duration: **300ms – 400ms**.
  - Stagger items by **30ms – 50ms** maximum; anything longer makes the interface feel sluggish.
- **Rule of Thumb:** If an animation makes a user wait before they can click or read, it is too slow. Cut the duration in half.

## 2. Easing & Physics

- **Default UI Easing:** Use smooth ease-out curves that decelerate quickly:
  ```css
  /* Fast deceleration curve */
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  ```
- **Spring Physics (Framer Motion):**
  - Use damped, non-bouncy springs for UI containers:
    `{ type: "spring", stiffness: 400, damping: 30 }`
  - Avoid bouncy cartoon springs on core productivity interfaces.

## 3. High-Quality Micro-Interaction Patterns

```tsx
// 1. Crisp Button Press Feedback
<button className="transition-transform duration-100 ease-out active:scale-[0.98]">
  Submit
</button>

// 2. Subtle Card Elevation & Border Highlight
<div className="rounded-xl border border-border/60 bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md">
  Card Content
</div>

// 3. Staggered List Entrance (Framer Motion)
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
};
```

## 4. Performance & Accessibility (GPU Acceleration)

- **Only Animate Composited Properties:** Animate exclusively `transform` and `opacity`.
- **Never Animate Layout Properties:** Avoid animating `width`, `height`, `top`, `left`, `margin`, or `padding` as they cause browser reflow and frame drops.
- **Strict Reduced Motion:** Honor `prefers-reduced-motion` by collapsing animation durations to 0.

## 5. Anti-Patterns & Red Flags

- Long, floaty animations on every scroll position.
- Animating layout-heavy CSS properties that cause stutter or jank on mobile devices.
- Unnecessary entrance animations that replay every time a tab or filter is clicked.
- Delayed button response that makes clicks feel unresponsive.
