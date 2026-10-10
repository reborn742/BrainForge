# Security notes

## Fixed in this audit
| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | High | `/api/validate` could crash the whole server with one request (`categories:[null]`, id `__proto__`/`constructor`, non-string answers -> uncaught async error in Express 4) | Strict schema validation, whitelisted category ids, try/catch, final error handler, process-level handlers |
| 2 | High | Prompt injection: client-controlled category labels and answers were interpolated into the Gemini prompt; model output was trusted blindly | Labels come from the server's own list, answers sanitised + passed as JSON data, system prompt marks entries untrusted, model output re-validated (score derived from `isValid`, blank/wrong-letter answers rejected deterministically) |
| 3 | High | Unbounded cost / DoS on a paid endpoint | Per-IP limit (429), tighter per-IP AI limit, concurrency cap, hard daily AI budget, server-side timeout; every limit degrades to the free dictionary judge |
| 4 | Medium | Rate limiter Map grew forever (memory exhaustion); `req.ip` wrong behind proxy; IPv6 rotation | Bounded limiter with purge + key cap, `/64` IPv6 bucketing, configurable `TRUST_PROXY` |
| 5 | Medium | No security headers | CSP, nosniff, Referrer-Policy, COOP/CORP, Permissions-Policy, HSTS (HTTPS), frame-ancestors |
| 6 | Medium | Inline script in `index.html` swallowed errors globally and blocked a strict CSP | Removed |
| 7 | Medium | `localStorage` read/written unguarded: tampered `"null"`, NaN or huge values crashed or poisoned stats; storage errors white-screened the app | `src/utils/storage.ts`: safe access, shape check, clamping |
| 8 | Medium | Client trusted server response (scores from payload) | Responses normalised client-side too |
| 9 | Low | Unbounded input length (O(n*m) Levenshtein, huge payloads) | 60-char cap (client `maxLength`, server, scoring) |
| 10 | Low | Double submit (timer + Enter + click) = duplicate billed calls and double stats | Submit lock |
| 11 | Low | `Math.random` biased shuffle / predictable ids | Crypto-backed helpers |
| 12 | Low | Stack traces/`X-Powered-By` disclosure, SPA fallback served HTML for missing assets, 50kb body limit | Generic JSON errors, header removed, 4kb limit, proper 404s |
| 13 | Low | No slowloris protection, no graceful shutdown | HTTP timeouts, SIGTERM handling |
| 14 | Low | `start` script could not run TS; `dotenv` unused; `@` alias pointed at project root; source maps | Fixed; vite alias -> `src`, sourcemaps off |
| 15 | Hygiene | Unused deps (`autoprefixer`, `esbuild`), `tsx` in devDependencies | Cleaned |

## Upgrade merge notes
The upgraded version (graded spelling scores 10/8/6/0, `correctAnswer` hints, mobile layout) was merged on top of the hardening. Graded scores are kept, but the server and browser still clamp every score to 0 when `isValid` is false and to 1..10 when true, reject wrong-letter/blank answers deterministically, and only show a suggested answer if it starts with the target letter.

## Already fine
API key is server-side only (never in the bundle), `.env*` is git-ignored, React escapes all rendered text (no `dangerouslySetInnerHTML`), no external links, CORS intentionally not enabled.

## Needs your action
* Commit ONE lockfile and install with `npm ci` (repo has `bun.lock` but README used npm).
* Rotate any Gemini key that was ever committed or shared.
* `FRAME_ANCESTORS` defaults to allowing AI Studio previews; set `"'self'"` for standalone hosting.
* Google Fonts is loaded from Google (CSP allows it). Self-host with `@fontsource` if you want zero third parties.
* Player stats live in the browser and are editable by the player; there is no server-side score or leaderboard to protect.
