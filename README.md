# Smart Weather Monitoring & Environmental Alert System — University of Abuja

A Next.js prototype implementing the system described in the dissertation
*"Design and Implementation of a Smart Weather Monitoring and Environmental
Alert System for the University of Abuja."*

## Features

- **Login and registration** — anyone can create an account (username +
  password), stored in a local SQLite database (`data/app.db`), with
  passwords hashed via bcrypt. A cookie-based session then gates the rest
  of the app.
- **Live Dashboard** — real-time temperature, humidity, rainfall, pressure,
  and wind data for the University of Abuja campus, sourced from the
  [Open-Meteo](https://open-meteo.com) API (no API key required).
- **3-Day Forecast** — daily high/low temperature, rain chance, and
  conditions for the next three days.
- **Automated Alerts** — compares live readings against configurable
  thresholds and displays low/moderate/high severity alerts.
- **Historical Trends** — 7/14/30-day temperature range and rainfall charts
  pulled from Open-Meteo's historical archive.
- **Admin Panel** — lets an administrator adjust alert thresholds via
  sliders (temperature, rainfall, wind speed, humidity).
- **Light / dark mode** — toggle in the header; preference is remembered
  and also respects the OS setting on first visit.

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). You'll be
redirected to `/login` — click "Register" to create the first account.

The SQLite database file is created automatically at `data/app.db` on
first run. It's git-ignored, so each environment starts with its own
empty user table.

## Project Structure

```
app/
  page.tsx                    Dashboard (live conditions + alerts + forecast)
  login/page.tsx               Login form
  register/page.tsx            Registration form
  history/page.tsx             Historical trend charts
  admin/page.tsx                Threshold configuration (sliders)
  api/weather/route.ts          Server route: current + 48hr forecast
  api/forecast/route.ts         Server route: next 3-day forecast
  api/history/route.ts          Server route: daily historical records
  api/auth/register/route.ts    Creates a user, sets session cookie
  api/auth/login/route.ts       Validates credentials, sets session cookie
  api/auth/logout/route.ts      Clears session cookie
middleware.ts                 Redirects unauthenticated requests to /login
components/                    Reusable UI (cards, alert banner, forecast strip, charts, nav, theme toggle)
lib/db.ts                       SQLite connection + schema setup
lib/auth.ts                      User lookup, creation, password hashing/verification
lib/types.ts                    Shared types, alert-evaluation logic, thresholds
lib/openMeteo.ts                Open-Meteo API integration
lib/theme.tsx                    Light/dark mode context + localStorage persistence
```

## Notes & Next Steps

This prototype uses the Open-Meteo weather API rather than physical
sensors, matching the "external data source" option discussed in Chapter 2
of the dissertation. Accounts are stored in a bundled SQLite file — real
enough to demo registration and login end-to-end, but a production system
per Chapter 3 would want:

- A proper database server (PostgreSQL/MySQL) instead of a local SQLite
  file, especially once multiple app instances are involved.
- Role-based access control (e.g. only admins can edit alert thresholds).
- Email verification and password reset flows.
- Ingesting readings from physical IoT sensors (temperature, humidity,
  rain, wind) alongside the API data, as outlined in the system's scope.
- Email/SMS notification delivery for alerts instead of dashboard-only
  display.
- Persisting historical alerts and readings for reporting.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (class-based dark mode)
- Recharts for data visualization
- Open-Meteo REST API (forecast + historical archive)
- SQLite (better-sqlite3) for user accounts, bcryptjs for password hashing
- Cookie-based session auth via Next.js middleware
