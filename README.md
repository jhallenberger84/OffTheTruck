# Off the Truck

Mechanic tool deals tracker. Next.js App Router + Tailwind, Postgres (Neon), Resend.

## Env vars
| Var | Purpose |
| --- | --- |
| `DATABASE_URL` (or `POSTGRES_URL`) | Neon Postgres. Tables are created and seeded from `lib/seed.json` automatically on first request. Without it the site runs read-only from the seed file. |
| `ADMIN_TOKEN` | Bearer token for `/api/admin/*`. |
| `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` | Signups go to this Resend segment ("Off the Truck"). |
| `EMAIL_FROM`, `OWNER_EMAIL` | Owner notifications (deal submissions, sponsor inquiries). |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO and email links. |
| `AMAZON_ASSOCIATE_TAG` | Optional. Added to Amazon links in `/go/<slug>` once the Associates account exists. |
| `KCTOOL_RFSN` | Optional. Refersion id appended as `rfsn` on kctool.com `/go/<slug>` links. Falls back to `9423510.adea47`. |

## Admin API (all need `Authorization: Bearer $ADMIN_TOKEN`)
- `GET /api/admin/stats` – counts, top clicks/pages, recent errors
- `GET /api/admin/queue?status=pending` – submitted deals
- `POST /api/admin/approve` `{ "id": 1, "deal": { ...overrides } }` or `{ "id": 1, "action": "reject" }`
- `GET /api/admin/searches?days=30` – zero-result searches
- `GET|POST|PATCH /api/admin/sponsors` – sponsor weeks + inquiries; POST `{ week_start, sponsor_name, url, headline? }`
- `GET|POST|PATCH|DELETE /api/admin/deals` – list / add / update (`{ slug, ...fields }`) / expire (`?slug=`)
- `GET /api/admin/newsletter[?format=json]` – renders the daily top-5 email preview (top 5 live deals). Never sends.

All outbound deal and sponsor links go through `/go/<slug>` (logged in `outbound_clicks` / `sponsor_clicks`); affiliate tags are applied in `lib/affiliate.ts`.
