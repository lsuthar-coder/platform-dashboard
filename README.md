# Platform Dashboard

Internal operations dashboard for the lsuthar.in platform. Built with React, Redux Toolkit, RTK Query, React Bootstrap, and Framer Motion.

**Live:** https://dashboard.lsuthar.in

---

## Features

- **JWT Authentication** — Login via API Gateway (RS256)
- **Real-time Health** — Aggregated service health via Cloudflare Worker
- **Feature Flags** — List, create, and view variant weights
- **Gateway Routes** — Middleware pipeline visualization
- **Audio Jobs** — Job queue history and status
- **CF Workers** — All 8 Cloudflare Worker deployments overview
- **Framer Motion** — Page transitions, staggered table rows, animated charts
- **RTK Query Polling** — Auto-refresh every 15–60 seconds

## Pages

| Page | Description |
|------|-------------|
| Overview | Platform health, request volume, latency, error rate |
| Feature Flags | Flag list with variant weights, create new flags |
| Gateway Routes | Route table, circuit breaker, middleware pipeline |
| Audio Jobs | Job queue history |
| CF Workers | 8 Cloudflare Workers with triggers and status |

## Tech Stack

- React 18
- Redux Toolkit + RTK Query
- React Bootstrap 5 (dark theme)
- Framer Motion
- Recharts
- Vite

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
# Output in dist/
```

## Deployment

Deployed on **Azure Static Web Apps** (Free tier) via GitHub Actions.

Custom domain: `dashboard.lsuthar.in` (Cloudflare CNAME → Azure SWA)

## Environment

All API calls go through `https://api.lsuthar.in`. CORS is configured on the API Gateway to allow the Azure SWA origin.

## Login Credentials

| Email | Role |
|-------|------|
| `admin@lsuthar.in` | admin |
| `leeladhar@lsuthar.in` | user |
