# Cloudflare ASE Take-Home Assessment

This repo is my submission for the Cloudflare Associate Solutions Engineer take-home. It covers Application Services, Zero Trust, and the Developer Platform using free-tier Cloudflare services only.

**Live Worker:** https://ase-demo-worker.mateokeres.workers.dev

---

## Repository contents

```
origin-app/     Node.js/Express app - the origin server
worker/         Cloudflare Worker (TypeScript) - identity page, R2 flags, D1 flags
worker/flags/   SVG flag assets uploaded to R2
worker/schema.sql  D1 table definition and seed data
```
## Implementation status

Implemented and verified end-to-end:

- Origin application
- Cloudflare Quick Tunnel
- Zero Trust Access with One-Time PIN
- Cloudflare Worker identity response
- Private R2 flag retrieval
- D1 flag retrieval
- Public GitHub repository

Documented as customer-ready configurations:

- WAF Managed Rulesets
- Rate Limiting

These two controls are normally applied to traffic flowing through an onboarded Cloudflare zone with a custom domain. The report documents how they would be configured and validated for a customer environment.
---

## Running the origin app locally

```bash
cd origin-app
npm install
npm start
```

App runs on port 3000. Endpoints:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Landing page |
| GET | `/api/search?q=` | WAF SQL injection demo |
| POST | `/api/login` | Rate limiting demo |
| GET | `/secure` | Zero Trust Access demo |

---

## Exposing the origin via Cloudflare Tunnel

Once the app is running, start a Quick Tunnel in a separate terminal:

```bash
cloudflared tunnel --url http://localhost:3000
```

This gives you a temporary `trycloudflare.com` URL. Keep both terminals open during the demo.

---

## Worker setup

```bash
cd worker
npm install
```

| Field | Where to find it |
|-------|-----------------|
| `database_id` | Output of `wrangler d1 create ase-flags-db` |
| `TEAM_DOMAIN` | Your Zero Trust team name |
| `POLICY_AUD` | Access application > Overview > AUD tag |

Deploy:

```bash
wrangler deploy
```

---

## R2 bucket

Create the bucket and upload the flags:

```bash
wrangler r2 bucket create ase-flags
wrangler r2 object put ase-flags/AU.svg --file=flags/AU.svg --content-type=image/svg+xml --remote
wrangler r2 object put ase-flags/US.svg --file=flags/US.svg --content-type=image/svg+xml --remote
wrangler r2 object put ase-flags/GB.svg --file=flags/GB.svg --content-type=image/svg+xml --remote
wrangler r2 object put ase-flags/JP.svg --file=flags/JP.svg --content-type=image/svg+xml --remote
```

---

## D1 database

Create the database and apply the schema:

```bash
wrangler d1 create ase-flags-db
npm run db:init:remote
```

---

## Zero Trust Access

Two Access applications are configured in the Cloudflare Zero Trust dashboard:

1. Protects `/secure` on the origin (via the tunnel URL)
2. Protects the Worker at `ase-demo-worker.mateokeres.workers.dev`

Both use One-Time PIN authentication. The policy allows:
- `mateokeres@gmail.com`
- Anyone with an `@cloudflare.com` email address

---

## Worker routes

| Route | What it does |
|-------|-------------|
| `GET /` | Validates Access JWT, returns identity page with email, timestamp, and country |
| `GET /secure` | Same as above |
| `GET /flags/:country` | Serves country flag SVG from private R2 bucket |
| `GET /flags-d1/:country` | Serves country flag SVG from D1 database |

The identity page returns:
```
{email} authenticated at {timestamp} from {country}
```
where `{country}` links to `/flags/{country}`.

---

## WAF and Rate Limiting

WAF Managed Rulesets and Rate Limiting are normally applied to traffic flowing through an onboarded Cloudflare zone with a custom domain. This demo uses Cloudflare Quick Tunnel and free-tier services without purchasing or onboarding a custom domain, so these controls are documented as customer-ready configurations rather than live zone-level rules.

- **WAF**: Cloudflare Managed Ruleset and OWASP Core Ruleset, both set to Block. This protects `/api/search?q=` from SQL injection-style payloads before they reach the origin.
- **Rate limiting**: POST `/api/login`, 10 requests per 10 seconds per IP, block for 60 seconds. This protects against brute-force login attempts and credential stuffing.

The accompanying report explains the configuration, customer value, demo commands, and expected validation steps.

---

## Notes

- `request.cf.country` only returns a real country code in production. Local dev with `wrangler dev` returns `undefined`, which falls back to `XX`.
- The Quick Tunnel URL changes on every restart. Start both the origin app and the tunnel fresh before the demo.
- The R2 bucket and D1 database are private — only accessible through the Worker bindings, not via public URLs.
