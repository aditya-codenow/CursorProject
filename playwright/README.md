# Playwright E2E (SwiftCab)

This is a separate Playwright project that runs end-to-end tests against the SwiftCab Express server.

## Install

From `playwright/`:

```bash
npm install
npx playwright install
```

## Run tests

```bash
npm test
```

## Notes

- The config auto-starts the app server (`node server.js` from the repo root) on `http://localhost:3000`.
- Tests use a Page Object Model in `pages/BookingPage.js`.

