const path = require("node:path");
const express = require("express");
const { openDb, migrateAndSeed, getLocations } = require("./db");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const db = openDb();
migrateAndSeed(db);

app.use(express.json());
app.disable("x-powered-by");

// Static assets (styles, script, etc.)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/locations", (req, res) => {
  const rows = getLocations(db);
  res.json({ locations: rows });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SwiftCab running at http://localhost:${PORT}`);
});

