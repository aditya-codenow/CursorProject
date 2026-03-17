# SwiftCab Landing Page (Static)

A simple landing page for **cab booking** with:

- Source + destination fields (fetched from local file based database)
- Date and time selection
- A **Reset fields** button that clears inputs and messages

## Run locally (dynamic dropdowns + SQLite)

1) Install dependencies

```bash
npm install
```

2) Start the server

```bash
npm start
```

3) Open in browser

- Open `http://localhost:3000`

### Notes

- The server creates a local SQLite DB at `data/swiftcab.db` and seeds sample locations on first run.
- Location dropdowns are loaded from `GET /api/locations`.

