# Copilot Instructions - Taller dels Sentits

## Project Overview
Next.js 16 art therapy center website with TypeScript, Tailwind CSS v4, and Motion animations. Uses React Compiler for optimization, EmailJS for contact forms, and pnpm for package management.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19.2
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 (PostCSS-based)
- **Animation**: `motion/react` library (not framer-motion)
- **Forms**: EmailJS (@emailjs/browser)
- **Notifications**: react-hot-toast
- **Package Manager**: pnpm
- **React Compiler**: Enabled in next.config.ts

## Architecture Patterns

### Client/Server Boundaries
- **"use client"**: Components with interactivity (hooks, motion, toast). Examples: `Header.tsx`, `ContactForm.tsx`, hooks files.
- **"use server"**: Server Actions for validation/data processing. Located in `app/contacte/actions/` (e.g., `handleSubmit.ts`, `buildEmailMessage.ts`).
- **Server by default**: All pages, layouts, and lib files unless marked otherwise.

### Route Organization
- **(home)** route group: Keeps home route at `/` without affecting URL structure.
- **Feature folders**: Each route (`serveis/`, `contacte/`, `qui-som/`) contains its own `components/`, `hooks/`, `lib/`, `types/`, `actions/` subdirectories.
- **Shared resources**: Global reusables in `app/_components/`, `app/_lib/`, `app/_types/`, `app/_hooks/`, `app/_assets/`.

### Import Patterns
Always use `@/app` alias (configured in tsconfig.json):
```typescript
import { servicesData } from '@/app/_lib/servicesData';
import type { ContactFormData } from '@/app/contacte/types/form.types';
import ButtonComponent from '@/app/_components/ButtonComponent';
```

## Critical Conventions

### Animation Library
**Use `motion/react`, NOT `framer-motion`**:
```typescript
import { motion, AnimatePresence } from 'motion/react';
```

### Styling System
- **Custom colors**: Defined in `globals.css` using `@theme` directive (shakespeare, scampi, jacarta, violet-blue, midnight, lilac).
- **Custom font**: "The Seasons" with multiple weights (300, 400, 700) and italic variants loaded via `@font-face` in `globals.css`.
- **Responsive**: Mobile-first approach, uses Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).

### TypeScript Types
- Centralized types in `_types/` (global) or route-specific `types/` folders.
- Union types for form fields: `ServiceType`, `ArttherapyFormat`, `Availability`, etc.
- Always export interfaces/types explicitly.

## Form Security Architecture (Contact Form)

### Two-Phase Validation
1. **Client-side** (UX): Real-time field validation in `useContactForm` hook.
2. **Server-side** (Security): `validateAndSanitize` Server Action sanitizes all inputs before email sending.

### Security Features
- **Honeypot field**: `website` field in form (hidden, should always be empty).
- **Server validation**: Never trust client data - always validate in Server Actions.
- **Sanitization**: Remove HTML tags and dangerous characters in `handleSubmit.ts`.
- **EmailJS**: Client-side email sending with public keys (secured via domain restrictions in EmailJS dashboard).

Example pattern from `useContactForm.ts`:
```typescript
// Client validation
const validation = await validateAndSanitize(formData);
// Server Action returns sanitized data
const result = await sendEmail(validation.data!);
```

## Data Architecture

### Content Structure
- **Services data**: `app/_lib/servicesData.ts` - Array of `ServiceSectionType` objects with quotes, colors, delays.
- **Content sections**: `app/(home)/lib/contentData.ts` - Object with keys (sentir, permis, crear) containing multilingual content.
- **Quotes**: Separate file `app/_lib/quotes.ts` for testimonials/quotes arrays.

### Assets Organization
- **Global icons**: `app/_assets/iconos/` categorized by theme (ARTE, CUERPO, ESPACIO, FLOR).
- **Route-specific**: Each route has its own `assets/` folder (e.g., `app/(home)/assets/images/`).
- **SVG imports**: Import as static assets with `.src` property for string URLs.

## Development Workflows

### Commands
```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm start        # Start production server
```

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

### Git & Project Management
- **Branch naming**: Uses Jira integration with `SCRUM-n-description` format (e.g., `SCRUM-47-dividir-la-funcionalitat-del-formulari-en-dues`).
- **Commits**: Should reference Jira ticket numbers when applicable for automatic linking.
- **Repository**: Hosted on GitHub (`m-s-torne/taller-dels-sentits`).

### Deployment (Vercel)
- **Platform**: Vercel (optimal for Next.js 16 with zero-config deployment).
- **Pricing**: Free Hobby tier includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS & CDN
  - 1M serverless function invocations/month
  - Perfect for this small business site
- **Configuration**: Vercel auto-detects Next.js; React Compiler supported by default.
- **Deploy**: Push to main branch triggers automatic deployment, preview deployments for all PRs.

### Testing Strategy
**Current scope**: Contact form at `/contacte` route.

**Recommended stack**:
- **Vitest**: Next.js 16 official recommendation for unit testing (faster than Jest, native ESM support).
- **React Testing Library**: Test user interactions and form validation.
- **Playwright**: E2E testing for full form submission flow including Server Actions and EmailJS integration.

**Why this combination**:
- Vitest handles client-side validation (hook logic in `useContactForm`).
- Playwright validates Server Actions (`validateAndSanitize`, `sendEmail`) end-to-end.
- React Testing Library tests component rendering and user interactions.
- No need for Enzyme - RTL better matches user behavior patterns.

**Setup commands** (when implementing):
```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/dom
pnpm add -D playwright @playwright/test
```

## Component Patterns

### Custom Hooks
- Prefix with `use` (e.g., `useContactForm`, `useHeader`, `useContentSection`).
- Keep complex logic outside components.
- Return object with state, handlers, and computed values.

### Index Files
Use barrel exports for cleaner imports:
```typescript
// app/contacte/components/index.ts
export { ContactForm } from './ContactForm';
```

### Motion Animations
- Use `motion.div`, `motion.section` for animated elements.
- Common props: `initial`, `animate`, `transition`, `viewport={{ once: true }}`.
- `AnimatePresence` for conditional rendering (e.g., mobile menu).

## Navigation
- **Fixed header**: Auto-hides on scroll down, shows on scroll up (via `useHeader` hook).
- **Responsive menu**: Desktop nav + hamburger menu for mobile.
- **Toast notifications**: Use `react-hot-toast` for user feedback, positioned `top-center`.

## Language & Localization
- **Primary language**: Catalan (all UI text, content, form labels, error messages).
- **No multilingual support planned**: Single-language application targeting local Catalan audience in Vilanova i la Geltrú.
- **Content management**: Hardcoded in data files (`contentData.ts`, `servicesData.ts`) - not using CMS.
