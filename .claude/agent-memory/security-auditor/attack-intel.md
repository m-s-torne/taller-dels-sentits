---
name: Contact Form Attack Intel - Subscription Bombing
description: Threat intel on the April 2026 contact form abuse waves — pattern, intent classification, and mitigation conclusions.
type: project
---

# Contact form abuse incident — April 2026

## Pattern observed
- Two attack waves, 3 days apart (~April 4 and April 7, 2026), against `tallerdelssentits.com/contacte`.
- Dozens of submissions per wave; in-memory rate limiter bypassed (IP rotation suspected — consistent with residential proxy botnet).
- Always "Consulta General" service path (lowest required-field path).
- Submitted email addresses are real, from real consumer and corporate domains (att.net, yahoo.com, me.com, live.com, marcometals.com, drhengineers.com). NOT disposable, NOT attacker-controlled.
- Some addresses repeated within minutes (duplicate fires from bombing tooling).
- Submitted names are random strings; content irrelevant to the attacker.

## Conclusion: attack intent
**Subscription bombing / email bombing via form abuse.** The site is being used as a free amplifier in an attack whose real victims are the third parties whose addresses appear in the form. The attacker's payload is the "Confirmació de rebuda" confirmation email leaving `tallerdelssentits.com` toward the victim. Goal is typically to bury a specific time-sensitive email (fraud alert, password reset, 2FA, legal notice) in the victim's inbox under a flood of legitimate-looking confirmations from real businesses — frequently a precursor to account takeover.

**Why:** Real-from-real-domains + duplicate fires + lowest-friction path + paced cadence + automation signals all match the bombing-as-a-service fingerprint and rule out reconnaissance, quota drain, relay, or competitive sabotage as primary motives.

**How to apply:** Treat the site owner and Resend quota as *secondary* victims. Primary harm is to:
1. The strangers being bombed.
2. `tallerdelssentits.com` sender reputation — Gmail/Yahoo/Microsoft will see unsolicited mail, complaints will rise, Resend may suspend the account, and legitimate mail (school replies, real client confirmations) will degrade. This damage outlasts the attack.

## Mitigation conclusions
- **Turnstile is the correct primary defense.** Already implemented in code; only blocked on setting `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel. Ship immediately. It addresses the root cause (unauthenticated form emits mail to attacker-supplied address) by blocking automation regardless of IP/email rotation.
- **Vercel firewall is NOT a substitute for Turnstile against this attack.** IP blocking loses to rotating residential proxies; edge rate limiting has the same keying problem the in-memory limiter had; firewall cannot distinguish humans from bots. Use it as a *secondary* layer once Turnstile is live (edge rate limit on `/contacte` POST, drop bot-shaped UAs, block ASNs from forensics).
- **Strongly consider removing the confirmation email or moving to double opt-in.** If the confirmation email is the attack payload, the cleanest defense is not to send it. Double opt-in (RFC 6377 / M3AAWG pattern) defeats bombing because victims won't click the verification link.
- **Sender reputation hygiene is now urgent**, not optional: Google Postmaster Tools, Microsoft SNDS, mxtoolbox blacklist check, verify SPF/DKIM/DMARC alignment with `p=quarantine` minimum and `rua` reports, proactively notify Resend support of the incident.
- **Move rate limiting to Vercel KV / Upstash** so it survives cold starts and is shared across instances. Lower priority than Turnstile but closes the gap that let wave 1 succeed.
- **Consider a `noreply.` subdomain for confirmation mail** to insulate the primary domain's reputation.

## What NOT to spend time on
- Manual IP blocking (rotating proxies defeat it).
- Country/ASN blanket blocks (collateral damage on real visitors).
- Heuristics to detect "random" names (attacker can trivially generate plausible ones; will hurt real users).
- Tightening per-email rate limits (attacker rotates victim emails specifically to bypass this).

## Indicator-of-compromise notes for future waves
If the pattern repeats, look for: "Consulta General" + random name + real-domain email + paced submissions + IP rotation + occasional duplicate within minutes. Same fingerprint = same campaign or same bombing service. If pattern shifts (varied service types, attacker-controlled domains, content variation), reassess — different attacker or different goal.
