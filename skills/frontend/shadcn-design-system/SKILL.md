---
name: shadcn-design-system
description: >-
  Use when building or customizing React and Next.js interfaces with shadcn/ui
  and Radix primitives, managing design tokens, creating component variants,
  or tailoring styles beyond default templates.
---

# shadcn/ui & Component Architecture

shadcn/ui provides owned, accessible primitives built on Radix UI and Tailwind CSS. It is an architectural foundation to be customized and composed, not a rigid off-the-shelf template.

## 1. Core Architecture Principles

1. **Own the Primitives:** Components in `components/ui/` belong to the codebase. Modify their JSX, Tailwind classes, and accessibility attributes directly to match project requirements.
2. **Semantic Design Tokens:** Drive all theming through CSS variables in `globals.css` instead of hardcoding raw Tailwind colors:
   - Use `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `border-border`, `ring-ring`.
   - Never sprinkle arbitrary colors like `bg-zinc-900` or `text-gray-500` inside reusable component files.
3. **Composable Variants with `cva`:** Use `class-variance-authority` (CVA) to cleanly manage sizes, states, and semantic variants.

## 2. Breaking Away from the "Default shadcn" Look

To prevent every project from looking like a default clone:
- **Tune Radii:** Adjust `--radius` in `globals.css` (e.g. `0.2rem` for technical/dense tools, `0.75rem` for friendly consumer apps).
- **Custom Borders & Surfaces:** Replace heavy black/white borders with subtle translucent borders (`border-border/50`) and soft backdrop blurs (`backdrop-blur-md bg-background/80`).
- **Elevate Interactive States:** Enhance button hover states with crisp micro-transitions (`transition-all duration-150 active:scale-[0.98]`).
- **Typography Integration:** Map custom display and body typefaces directly to component headings and labels.

## 3. High-Leverage Composition Patterns

Compose small primitives into domain-specific compound components:

```tsx
// Example: Domain-specific UserAvatarCard using primitives
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserStatusBadge({ name, role, avatarUrl, status }: UserProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-xs">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="truncate text-sm font-medium text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{role}</span>
      </div>
      <Badge variant={status === "active" ? "default" : "secondary"} className="ml-auto">
        {status}
      </Badge>
    </div>
  );
}
```

## 4. Preserving Accessibility

- Always forward `ref` and spread `...props` to the underlying Radix primitive.
- Keep the `asChild` pattern intact when wrapping custom triggers with `<Slot />` (e.g. `DialogTrigger asChild`).
- Ensure accessible names exist on icon-only buttons via `aria-label` or `<span className="sr-only">Label</span>`.

## 5. Anti-Patterns & Red Flags

- Overriding component styles with heavy `!important` classes.
- Leaving components completely unstyled with default black-and-white zinc palette when the brand demands personality.
- Nesting interactive elements (e.g. putting a button inside a link or another button without `asChild`).
- Duplicating similar variants across multiple components instead of centralizing tokens.
