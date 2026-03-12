# Task: Section Tab Navigation for Serveis Externs Page

## Context

This is a Next.js 16 App Router project with TypeScript, Tailwind CSS v4, and `motion/react` (NOT framer-motion). Package manager is `pnpm`. All animation imports must use `motion/react`.

## Goal

Replace the current sequential rendering of `service.sections` on the `serveis-externs` page with a **tab navigation** that toggles between the two sections. The tabs must be placed immediately after the `<StaticQuote>` component and must visually match the **mobile layout of `StepsNavigation`** (horizontal on both mobile and desktop, no lines).

---

## Files to read first (for full context)

Before implementing, read these files in full:

- `app/(serveis)/serveis-externs/page.tsx`
- `app/(home)/components/ContentSection/StepsNavigation.tsx`
- `app/(home)/types/contentSection.types.ts`
- `app/_types/services.types.ts`
- `app/_lib/servicesData.ts` (look for the `serveis-externs` entry and its `sections` array)
- `app/_assets/iconos/` (directory listing — contains ARTE/, CUERPO/, ESPACIO/, FLOR/ subfolders with SVG icons)

---

## What to build

### 1. New component: `app/(serveis)/serveis-externs/components/SectionTabs.tsx`

A `"use client"` tab navigation component. Props:
- `tabs`: `{ key: string; label: string; icon: string }[]` (icon is a `.src` string from a static SVG import)
- `selectedTab`: `string`
- `onTabChange`: `(key: string) => void`

**Visual structure** — copy the mobile layout of `StepsNavigation`, adapted:
- Always horizontal on both mobile and desktop: `flex flex-row justify-around`
- No lines at all (remove both the horizontal mobile line and vertical desktop line)
- Each tab is a `<button>` with `flex flex-col items-center gap-2 cursor-pointer`
- ~~**Dot indicator**: removed — not rendered~~
- **Icon container**: `relative w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 flex items-center justify-center transition-opacity duration-200`; opacity `100` when active, `60` when inactive + `hover:opacity-100`. Inner `<div>` at `scale-[2.5] sm:scale-[2.3]` containing `<img src={tab.icon} className="w-full h-full object-contain" />`
- **Label**: `text-shakespeare text-sm sm:text-base font-light tracking-wide transition-opacity duration-200`; `opacity-100` when active, `opacity-60` when inactive

### 2. New barrel export: `app/(serveis)/serveis-externs/components/index.ts`

```ts
export { SectionTabs } from './SectionTabs';
```

### 3. Modify `app/(serveis)/serveis-externs/page.tsx`

**Imports to add:**
```ts
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SectionTabs } from './components';
import CentresIcon from '@/app/_assets/iconos/ARTE/DIBUJO.svg';
import AltresEspaisIcon from '@/app/_assets/iconos/ESPACIO/VENTANA.svg';
```

**Inside the component, add:**
```ts
const [selectedTab, setSelectedTab] = useState<'centres' | 'altres'>('centres');

const sectionTabs = [
    { key: 'centres', label: 'Centres Educatius', icon: CentresIcon.src },
    { key: 'altres',  label: 'Altres Espais',     icon: AltresEspaisIcon.src },
];
```

**Replace** the entire `{service.sections?.map(...)}` block with:

1. `<SectionTabs>` placed immediately after `{service.quote && <StaticQuote quote={service.quote} />}`
2. An `<AnimatePresence mode="wait">` wrapping a `<motion.div>` that renders only the active section

Section index `0` maps to tab key `'centres'`, index `1` maps to `'altres'`.

The motion wrapper:
```tsx
<AnimatePresence mode="wait">
    <motion.div
        key={selectedTab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
        {/* content of the active section */}
    </motion.div>
</AnimatePresence>
```

The inner content for the active section must preserve the **exact same JSX** as the current `service.sections?.map(...)` block — `FadeInView`, `SectionHeading`, `ParagraphList`, `SubheadingWithList`, `ImageCarousel`, `ButtonComponent` — just rendered for the single active section instead of both.

---

## Constraints

- Use `motion/react` — NOT `framer-motion`
- SVG icons are static imports — always use `IconName.src` for the `<img src>` prop
- Tailwind CSS v4 — standard utility classes only, no `@apply`
- `SectionTabs` is purely presentational — no internal state, no hooks
- Do NOT modify `StepsNavigation.tsx`, any home-page files, or `servicesData.ts`
- Verify no TypeScript errors after implementation

## Verification

1. No TypeScript errors in created/modified files (`get_errors` tool)
2. `serveis-externs/page.tsx` no longer has `service.sections?.map(...)` — replaced by `SectionTabs` + `AnimatePresence`
3. `SectionTabs` renders two tabs horizontally at all breakpoints
4. Clicking each tab animates section content in/out smoothly
