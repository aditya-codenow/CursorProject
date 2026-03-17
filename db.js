const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function openDb() {
  const dataDir = path.join(__dirname, "data");
  ensureDir(dataDir);
  const dbPath = path.join(dataDir, "swiftcab.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  return db;
}

function migrateAndSeed(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  const count = db.prepare("SELECT COUNT(*) AS n FROM locations").get().n;
  if (count > 0) return;

  const seed = [
    "Airport",
    "Railway Station",
    "Bus Stand",
    "MG Road",
    "Indiranagar",
    "Koramangala",
    "Whitefield",
    "Electronic City",
    "HSR Layout",
    "Marathahalli",
    "Jayanagar",
    "Malleshwaram"
  ];

  const insert = db.prepare("INSERT OR IGNORE INTO locations (name) VALUES (?)");
  const tx = db.transaction((items) => {
    for (const name of items) insert.run(name);
  });
  tx(seed);
}

function getLocations(db) {
  return db.prepare("SELECT id, name FROM locations ORDER BY name ASC").all();
}

module.exports = { openDb, migrateAndSeed, getLocations };

