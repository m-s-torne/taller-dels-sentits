---
name: Cloudflare Turnstile Reference
description: Siteverify API schema, token lifecycle, error codes, test keys, package comparison.
type: reference
---

# Cloudflare Turnstile Reference

## Siteverify API

**Endpoint:** `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`

Accepts `application/json` or `application/x-www-form-urlencoded`.

### Request body

| Field | Required | Notes |
|-------|----------|-------|
| `secret` | yes | Widget secret key (server-only) |
| `response` | yes | Token produced by the client widget |
| `remoteip` | no (recommended) | Visitor IP |
| `idempotency_key` | no | UUID for safe retries of the same token |

### Response schema (success)

```json
{
  "success": true,
  "challenge_ts": "2026-04-07T12:34:56.000Z",
  "hostname": "tallerdelssentits.com",
  "error-codes": [],
  "action": "contact_form",
  "cdata": null
}
```

### Response schema (failure)

```json
{
  "success": false,
  "error-codes": ["timeout-or-duplicate"]
}
```

### Error codes

| Code | Meaning | Server action |
|------|---------|---------------|
| `missing-input-secret` | Secret missing | Fail closed, log config error |
| `invalid-input-secret` | Secret invalid/expired | Fail closed, log config error |
| `missing-input-response` | Token missing | Reject (user must refresh widget) |
| `invalid-input-response` | Token expired/malformed | Reject, tell client to retry |
| `bad-request` | Malformed request | Fail closed, log |
| `timeout-or-duplicate` | Token already used or older than 5 min | Reject, tell client to retry |
| `internal-error` | Cloudflare issue | Fail closed (see analysis doc) |

## Token Properties

- **Lifetime:** 300 seconds (5 minutes) from generation.
- **Single-use:** Each token validates exactly once. Replays return `timeout-or-duplicate`.
- **Max length:** 2048 characters.
- **Binding:** Token is tied to the site key and optionally to the visitor IP.

## Test Keys (dev/CI only)

| Purpose | Site key | Secret key |
|---------|----------|-----------|
| Always passes | `1x00000000000000000000AA` | `1x0000000000000000000000000000000AA` |
| Always blocks | `2x00000000000000000000AB` | `2x0000000000000000000000000000000AA` |
| Always fails (invalid token) | `3x00000000000000000000FF` | `3x0000000000000000000000000000000AA` |

Test keys are inert in production and production keys reject test tokens.

## Package Comparison

### `@marsidev/react-turnstile` (recommended for this project)

- Actively maintained wrapper around the official JS SDK.
- Exposes imperative `ref` methods: `reset()`, `getResponse()`, `execute()`, `remove()`.
- Callbacks: `onSuccess(token)`, `onError(err)`, `onExpire()`, `onWidgetLoad()`, `onBeforeInteractive()`.
- `options` prop passes through to the raw Turnstile API (`theme`, `size`, `action`, `cData`, `appearance`, `retry`, `refresh-expired`).
- Works in Next.js App Router inside a `"use client"` component; the script is injected client-side automatically.
- No known CVEs as of research date.

### Alternatives

- `react-turnstile` (Le0Developer) — simpler, also maintained, fewer imperative helpers.
- No "official" `@cloudflare/turnstile-react` package exists. Cloudflare only publishes the raw JS loader at `https://challenges.cloudflare.com/turnstile/v0/api.js`.

## Sources

- Cloudflare Turnstile server-side validation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Cloudflare Turnstile test keys: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
- Widget client-side docs: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- `@marsidev/react-turnstile` docs: https://docs.page/marsidev/react-turnstile
- `@marsidev/react-turnstile` GitHub: https://github.com/marsidev/react-turnstile
- OWASP ASVS v4.0 V11 (Business Logic / Anti-automation): https://owasp.org/www-project-application-security-verification-standard/
