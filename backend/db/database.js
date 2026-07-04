// ==========================================================
// DATABASE SETUP
// ==========================================================
// This file creates (or opens) the SQLite database file
// and makes sure all the tables we need exist.
//
// The database is stored as a single file: backend/db/inventory.db
// You can literally double-click / open that file with a tool like
// "DB Browser for SQLite" if you ever want to look inside it.
// ==========================================================

const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'inventory.db');
const db = new DatabaseSync(dbPath);

// Turn on foreign key checks (keeps data consistent)
db.exec('PRAGMA foreign_keys = ON;');

// ----------------------------------------------------------
// MODULE 1: ITEM MASTER TABLE
// ----------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_code TEXT NOT NULL UNIQUE,
    item_name TEXT NOT NULL,
    category TEXT,
    unit TEXT,
    opening_stock REAL NOT NULL DEFAULT 0,
    current_stock REAL NOT NULL DEFAULT 0,
    minimum_stock REAL NOT NULL DEFAULT 0,
    supplier_name TEXT,
    location TEXT,
    remarks TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;
