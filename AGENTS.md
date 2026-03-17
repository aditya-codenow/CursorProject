# AGENTS.md

This repo is a **static landing page** for cab booking (demo UI only). It uses **vanilla HTML/CSS/JS** and is intended to work by opening `index.html` directly or via a simple local server.

## Project goals

- Provide a clean landing page with a booking form:
  - Source
  - Destination
  - Date
  - Time
  - Reset fields option
- Keep the UX **fast, responsive, and accessible**
- Keep the codebase **framework-free** and easy to edit

## Repo structure

- `index.html`: Page layout + booking form markup
- `styles.css`: Styling (responsive, modern)
- `script.js`: Client-side behavior (validation, submit feedback, reset)
- `README.md`: How to run locally

## How to run

- Open `index.html` directly in a browser, or
- Run a local server (recommended):

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Editing guidelines (for agents/collaborators)

- **Do not introduce heavy dependencies** (React, Tailwind, build tools) unless explicitly requested.
- **Keep it static**: no real booking API is currently wired up.
- **Preserve responsiveness**: verify at mobile widths (~360–430px) and desktop widths.
- **Preserve accessibility**:
  - Keep labels connected to inputs (`for`/`id`)
  - Keep `aria-live` messaging for errors/confirmation
  - Ensure keyboard navigation works (Tab order, focus on first invalid field)
- **Avoid intrusive popups**: use inline messages instead of `alert()`.

## Booking form behavior expectations

- **Required fields**: source, destination, date, time
- **Validation**:
  - Source and destination must not be the same (case-insensitive)
  - Scheduled date/time should not be in the past
- **Reset fields** button should:
  - Clear all inputs (including selects)
  - Clear error messages and confirmation message
  - Return focus to the Source field

## Style conventions

- Prefer simple, readable JS (no bundlers).
- Use small helper functions rather than deeply nested code.
- Keep CSS in `styles.css` (avoid inline styles except for minimal dynamic UI state where necessary).

## When adding features

If asked to extend this project (pricing, ride types, maps, backend integration):

- Add new files conservatively.
- Keep the initial experience lightweight.
- Document changes in `README.md`.

