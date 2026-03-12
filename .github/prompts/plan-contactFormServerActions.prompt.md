# Test Plan: Contact Form Server Actions

## Context

Next.js 16 / TypeScript / Vitest project. Test the pure logic in `app/contacte/actions/` — no component rendering. All functions are deterministic given inputs, except `sendEmail` which calls EmailJS and must be mocked.

---

## Files under test

| File | Directive | Notes |
|------|-----------|-------|
| `app/contacte/actions/handleSubmit.ts` | `"use server"` | `validateAndSanitize` — main validation + sanitization |
| `app/contacte/actions/buildEmailMessage.ts` | `"use server"` | `buildEmailMessage` — string builder |
| `app/contacte/actions/getServiceLabel.ts` | none | `getServiceLabel`, `getServiceLabels` — pure maps |
| `app/contacte/actions/getSubmitMessages.ts` | `"use server"` | `getSubmitMessages` — static data |
| `app/contacte/actions/sendEmail.ts` | `"use client"` | `sendEmail` — EmailJS, must mock `@emailjs/browser` |

**Types reference**: `app/contacte/types/form.types.ts`

---

## 1. Vitest Setup

### Files to create

**`vitest.config.ts`** (workspace root)
```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

### Dependencies to install
```
pnpm add -D vitest
```

### Handling `"use server"` / `"use client"` directives
Both are valid JS string-expression statements — Vitest imports them fine. No special transform needed.

### Environment variables (`sendEmail.ts` only)
Use `vi.stubEnv` per test. No `.env.test` file needed.

---

## 2. Base Fixture

A valid `ContactFormData` for `serviceType: 'general'` that passes all validation. Reused across tests, mutated per case with spread.

```ts
// app/contacte/actions/__tests__/_fixtures.ts
import type { ContactFormData } from '@/app/contacte/types/form.types';

export const baseValidForm: ContactFormData = {
  name: 'Anna García',
  email: 'anna@example.com',
  phone: '',
  location: '',
  serviceType: 'general',
  arttherapyFormat: '',
  participantAge: '',
  schoolName: '',
  educationStage: '',
  studentsCount: '',
  courseGroup: '',
  courseInterest: '',
  externsSubtype: '',
  centreSubtype: '',
  teachersCount: '',
  trainingInterest: '',
  entityType: '',
  entityName: '',
  entityDescription: '',
  participantsCount: '',
  projectDescription: '',
  message: 'Hola, vull demanar informació sobre els serveis.',
  contactPreference: [],
  availability: '',
  privacyAccepted: true,
  website: '',
};
```

---

## 3. Test Cases: `validateAndSanitize`

**Test file**: `app/contacte/actions/__tests__/validateAndSanitize.test.ts`

### 3.1 Honeypot

| # | Input | Expected |
|---|-------|----------|
| H1 | `website: 'filledByBot'` | `{ valid: false, error: 'invalid_honeypot' }` |
| H2 | `website: '   '` (whitespace only) | passes (treated as empty) |
| H3 | `website: ''` or `website: undefined` | passes |

### 3.2 Name validation

| # | `name` | Expected |
|---|--------|----------|
| N1 | `''` | `{ valid: false, error: 'El nom és obligatori...' }` |
| N2 | `'  '` (spaces only) | same error |
| N3 | `'Ab'` (2 chars) | same error |
| N4 | `'Ana'` (3 chars) | passes |
| N5 | `'Anna García'` | passes |

### 3.3 Email validation

| # | `email` | Expected |
|---|---------|----------|
| E1 | `''` | `{ valid: false, error: 'El correu electrònic no és vàlid' }` |
| E2 | `'notanemail'` | same error |
| E3 | `'missing@dot'` | same error |
| E4 | `'@nodomain.com'` | same error |
| E5 | `'valid@example.com'` | passes |
| E6 | `'valid+tag@sub.domain.org'` | passes |

### 3.4 Message validation

| # | `message` | Expected |
|---|-----------|----------|
| M1 | `''` | `{ valid: false, error: 'El missatge ha de tenir almenys 10 caràcters' }` |
| M2 | `'Short'` (5 chars) | same error |
| M3 | `'123456789'` (9 chars) | same error |
| M4 | `'1234567890'` (10 chars exactly) | passes |
| M5 | `'a'.repeat(5001)` | `{ valid: false, error: 'El missatge és massa llarg...' }` |
| M6 | `'a'.repeat(5000)` | passes |

### 3.5 Privacy validation

| # | `privacyAccepted` | Expected |
|---|-------------------|----------|
| P1 | `false` | `{ valid: false, error: "Has d'acceptar la política de privacitat" }` |
| P2 | `true` | passes |

### 3.6 `serveis-externs` — location

| # | `serviceType` | `location` | Expected |
|---|---------------|------------|----------|
| L1 | `'serveis-externs'` | `''` | `{ valid: false, error: 'La població és obligatòria...' }` |
| L2 | `'serveis-externs'` | `'Barcelona'` | continues to next check |
| L3 | `'artterapia'` | `''` | passes (location not required) |

### 3.7 `serveis-externs` — externsSubtype

| # | `externsSubtype` | Expected |
|---|-----------------|----------|
| SE1 | `''` | `{ valid: false, error: 'Has de seleccionar el tipus de col·lectiu' }` |
| SE2 | `'centre-educatiu'` | continues |
| SE3 | `'altres-entitats'` | continues |

### 3.8 `serveis-externs` + `centre-educatiu`

| # | `centreSubtype` | `schoolName` | Expected |
|---|-----------------|--------------|----------|
| CE1 | `''` | any | `{ valid: false, error: 'Has de seleccionar el destinatari...' }` |
| CE2 | `'alumnes'` | any | passes this check |
| CE3 | `'professorat'` | `''` | `{ valid: false, error: 'El nom del centre és obligatori...' }` |
| CE4 | `'professorat'` | `'IES Garraf'` | passes |

### 3.9 `serveis-externs` + `altres-entitats`

| # | `entityType` | `entityName` | Expected |
|---|--------------|--------------|----------|
| AE1 | `''` | any | `{ valid: false, error: "Has de seleccionar el tipus d'entitat" }` |
| AE2 | `'hospital'` | `''` | `{ valid: false, error: "El nom de l'entitat és obligatori" }` |
| AE3 | `'hospital'` | `'Hospital de Vilafranca'` | continues to count check |

### 3.10 Numeric count validations

| # | Scenario | `count` value | Expected |
|---|----------|---------------|----------|
| NC1 | `centre-educatiu` + `alumnes` | `studentsCount: ''` | skips check (optional) |
| NC2 | `centre-educatiu` + `alumnes` | `studentsCount: 0` | `{ valid: false, error: "El nombre d'estudiants ha de ser almenys 1" }` |
| NC3 | `centre-educatiu` + `alumnes` | `studentsCount: 25` | passes |
| NC4 | `centre-educatiu` + `professorat` | `teachersCount: ''` | skips check (optional) |
| NC5 | `centre-educatiu` + `professorat` | `teachersCount: -1` | `{ valid: false, error: 'El nombre de professors ha de ser almenys 1' }` |
| NC6 | `centre-educatiu` + `professorat` | `teachersCount: 10` | passes |
| NC7 | `altres-entitats` | `participantsCount: ''` | `{ valid: false, error: 'El nombre de participants és obligatori' }` |
| NC8 | `altres-entitats` | `participantsCount: 0` | `{ valid: false, error: 'El nombre de participants ha de ser almenys 1' }` |
| NC9 | `altres-entitats` | `participantsCount: 50` | passes |

### 3.11 Sanitization (on valid `baseValidForm`)

| # | Input field | Input value | Expected output value |
|---|-------------|-------------|-----------------------|
| S1 | `name` | `'Anna <script>alert(1)</script>'` | `'Anna alert(1)'` (tags stripped) |
| S2 | `name` | `'Anna {[test]}'` | `'Anna test'` (dangerous chars stripped) |
| S3 | `email` | `'ANNA@EXAMPLE.COM'` | `'anna@example.com'` (lowercased + trimmed) |
| S4 | `message` | `'Hello <b>world</b> \\test'` | `'Hello world test'` |
| S5 | `studentsCount` | `25.7` (float) | `25` (Math.floor applied) |
| S6 | `website` | any value | always `''` in output |

### 3.12 Return shape on success

- Returns `{ valid: true, data: ContactFormData }`
- `data` contains all original fields (non-text fields unchanged)

### 3.13 Unexpected throw

- Pass `null` as `formData` to trigger a runtime error. Verify return is `{ valid: false, error: 'Error al processar les dades...' }`.

---

## 4. Test Cases: `buildEmailMessage`

**Test file**: `app/contacte/actions/__tests__/buildEmailMessage.test.ts`

### 4.1 Base output (always present)

| # | Assertion |
|---|-----------|
| B1 | Output starts with `data.message` |
| B2 | Output contains `'--- DETALLS DE LA CONSULTA ---'` |
| B3 | Output contains `data.email` |

### 4.2 Optional basic fields

| # | Condition | Assertion |
|---|-----------|-----------|
| OB1 | `phone: '600123456'` | output contains `'Telèfon: 600123456'` |
| OB2 | `phone: ''` | output does NOT contain `'Telèfon'` |
| OB3 | `location: 'Vilanova'` | output contains `'Població: Vilanova'` |
| OB4 | `location: ''` | output does NOT contain `'Població'` |

### 4.3 contactPreference

| # | Value | Assertion |
|---|-------|-----------|
| CP1 | `['email', 'phone']` | output contains `'email, phone'` |
| CP2 | `[]` | output does NOT contain `'Preferència de contacte'` |

### 4.4 availability

| # | Value | Expected label |
|---|-------|---------------|
| AV1 | `'morning'` | `'Matins (9h-14h)'` |
| AV2 | `'afternoon'` | `'Tardes (14h-18h)'` |
| AV3 | `'anytime'` | `'Qualsevol moment'` |
| AV4 | `''` | `'Disponibilitat'` NOT in output |

### 4.5 `general` serviceType

| # | Assertion |
|---|-----------|
| G1 | Output does NOT contain `'--- DETALLS DEL SERVEI ---'` |

### 4.6 `artterapia`

| # | `arttherapyFormat` | Expected in output |
|---|--------------------|--------------------|
| AT1 | `'individual'` | `'Sessions individuals'` |
| AT2 | `'grupal'` | `'Sessions grupals'` |
| AT3 | `'unsure'` | `'No estic segur/a'` |
| AT4 | `''` | format line NOT in output |

### 4.7 `artperdins`

| # | `participantAge` | Expected in output |
|---|------------------|--------------------|
| AP1 | `'adolescent'` | `'Adolescents (12-15 anys)'` |
| AP2 | `'young-adult'` | `'Joves (15-20 anys)'` |
| AP3 | `'adult'` | `'Adults (20 anys o més)'` |

### 4.8 `serveis-externs` + `centre-educatiu` + `alumnes`

| # | Field | Assertion |
|---|-------|-----------|
| SEA1 | `schoolName: 'Col·legi Garraf'` | output contains school name |
| SEA2 | `educationStage: 'eso'` | output contains `'ESO'` |
| SEA3 | `courseGroup: '2n ESO'` | output contains `'2n ESO'` |
| SEA4 | `studentsCount: 30` | output contains `'30'` |
| SEA5 | `courseInterest: 'Monogràfic emocions'` | output contains value |
| SEA6 | all fields empty/`''` | those lines NOT in output |

### 4.9 `serveis-externs` + `centre-educatiu` + `professorat`

| # | Field | Assertion |
|---|-------|-----------|
| SEP1 | `schoolName: 'IES Garraf'` | output contains school name |
| SEP2 | `teachersCount: 15` | output contains `'15'` |
| SEP3 | `trainingInterest: 'gestió emocional'` | output contains value |

### 4.10 `serveis-externs` + `altres-entitats`

| # | Field | Assertion |
|---|-------|-----------|
| AE1 | `entityType: 'hospital'` | output contains `'Hospital'` |
| AE2 | `entityType: 'altres'` + `entityDescription: 'Desc'` | output contains `'Desc'` |
| AE3 | `entityType: 'hospital'` (not `'altres'`) | `"Descripció de l'entitat"` NOT in output |
| AE4 | `entityName: 'Hospital de Vilafranca'` | output contains value |
| AE5 | `participantsCount: 40` | output contains `'40'` |
| AE6 | `projectDescription: 'Projecte X'` | output contains value |

---

## 5. Test Cases: `getServiceLabel` / `getServiceLabels`

**Test file**: `app/contacte/actions/__tests__/getServiceLabel.test.ts`

| # | Input | Expected |
|---|-------|----------|
| SL1 | `'artterapia'` | `'Artteràpia'` |
| SL2 | `'artperdins'` | `'Artperdins'` |
| SL3 | `'serveis-externs'` | `'Serveis Externs'` |
| SL4 | `'general'` | `'Consulta General'` |
| SL5 | `getServiceLabels()` returns all 4 keys | `Object.keys(result).length === 4` |

---

## 6. Test Cases: `getSubmitMessages`

**Test file**: `app/contacte/actions/__tests__/getSubmitMessages.test.ts`

| # | Assertion |
|---|-----------|
| SM1 | Returns object with keys `sending`, `success`, `error` |
| SM2 | `sending.type === 'sending'`, `sending.emoji === '📤'` |
| SM3 | `success.type === 'success'`, `success.emoji === '✅'` |
| SM4 | `error.type === 'error'`, `error.emoji === '❌'` |
| SM5 | Each entry has `text`, `bgColor`, `textColor` as non-empty strings |

---

## 7. Test Cases: `sendEmail`

**Test file**: `app/contacte/actions/__tests__/sendEmail.test.ts`

### Mock setup
```ts
vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}));
import emailjs from '@emailjs/browser';
```

Stub env vars before each test:
```ts
beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID', 'svc_general');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', 'tpl_general');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'key_general');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID_SCHOOL', 'svc_school');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_SCHOOL', 'tpl_school');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_SCHOOL', 'key_school');
});
afterEach(() => vi.unstubAllEnvs());
```

### 7.1 `getEmailJSConfig` routing (via observable behaviour)

| # | `serviceType` | `externsSubtype` | Expected credentials used |
|---|---------------|-----------------|--------------------------|
| EC1 | `'serveis-externs'` | `'centre-educatiu'` | `svc_school`, `tpl_school`, `key_school` |
| EC2 | `'serveis-externs'` | `'altres-entitats'` | `svc_general`, `tpl_general`, `key_general` |
| EC3 | `'artterapia'` | `''` | general |
| EC4 | `'artperdins'` | `''` | general |
| EC5 | `'general'` | `''` | general |

Verify by inspecting `emailjs.send.mock.calls[0]` arguments.

### 7.2 Missing env vars

| # | Missing var | Expected |
|---|-------------|----------|
| MV1 | `NEXT_PUBLIC_EMAILJS_SERVICE_ID` deleted | `{ success: false, error: 'Configuració incorrecta...' }` |
| MV2 | `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` deleted | same |
| MV3 | `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` deleted | same |
| MV4 | All SCHOOL vars deleted + `serviceType: 'serveis-externs'` + `externsSubtype: 'centre-educatiu'` | same |

### 7.3 EmailJS response handling

| # | `emailjs.send` resolves with | Expected |
|---|------------------------------|----------|
| ER1 | `{ status: 200, text: 'OK' }` | `{ success: true }` |
| ER2 | `{ status: 400, text: 'Bad Request' }` | `{ success: false, error: 'Error al enviar el missatge...' }` |
| ER3 | throws `new Error('Network error')` | `{ success: false, error: 'Error al enviar el missatge...' }` |

### 7.4 Template params shape

For case ER1, verify `emailjs.send` was called with:
- `templateParams.from_name === sanitizedData.name`
- `templateParams.from_email === sanitizedData.email`
- `templateParams.reply_to === sanitizedData.email`
- `templateParams.from_phone === 'No proporcionat'` when `phone: ''`
- `templateParams.from_service` equals the correct Catalan label

---

## 8. File structure to create

```
app/contacte/actions/__tests__/
  _fixtures.ts
  validateAndSanitize.test.ts
  buildEmailMessage.test.ts
  getServiceLabel.test.ts
  getSubmitMessages.test.ts
  sendEmail.test.ts
vitest.config.ts
```

---

## 9. Constraints

- Vitest only — no Jest, no Playwright (those are for later phases)
- No React Testing Library — pure logic tests
- No test modifies source files
- Each test is independent — use `beforeEach` spreads from `baseValidForm`
- `"use server"` / `"use client"` directives are no-ops in Vitest — no workaround needed
- All assertions on Catalan strings must match the source exactly (copy-paste from source)

---

## 10. Decisions

- Tests colocated at `app/contacte/actions/__tests__/` (not workspace root)
- S6 float→floor→max edge case skipped — too implementation-specific
- `sendEmail` tested with Vitest mocks, not deferred to Playwright
