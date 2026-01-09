const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure db directory exists
const dbPath = path.join(__dirname, 'spraywall.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

// Initialize Schema
function initDb() {
    db.serialize(() => {
        // Walls Table
        db.run(`
            CREATE TABLE IF NOT EXISTS walls (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                image_path TEXT NOT NULL,
                type TEXT DEFAULT 'user',
                created_at INTEGER DEFAULT (strftime('%s', 'now'))
            )
        `);

        // Routes Table
        db.run(`
            CREATE TABLE IF NOT EXISTS routes (
                id TEXT PRIMARY KEY,
                wall_id TEXT NOT NULL,
                title TEXT NOT NULL,
                grade TEXT NOT NULL,
                status TEXT DEFAULT 'project',
                grading_system TEXT DEFAULT 'v_scale',
                description TEXT,
                holds_data TEXT NOT NULL,
                images_data TEXT,
                tags_data TEXT,
                sent_count INTEGER DEFAULT 0,
                created_at INTEGER DEFAULT (strftime('%s', 'now')),
                last_modified INTEGER DEFAULT (strftime('%s', 'now')),
                FOREIGN KEY(wall_id) REFERENCES walls(id) ON DELETE CASCADE
            )
        `);

        // Wall Images Table (New for Collections)
        db.run(`
            CREATE TABLE IF NOT EXISTS wall_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                wall_id TEXT NOT NULL,
                image_path TEXT NOT NULL,
                created_at INTEGER DEFAULT (strftime('%s', 'now')),
                FOREIGN KEY(wall_id) REFERENCES walls(id) ON DELETE CASCADE
            )
        `);

        // Migration: Ensure images_data column exists in routes (for collections)
        db.run("ALTER TABLE routes ADD COLUMN images_data TEXT", (err) => {
            if (err) {
                // Ignore error (column probably already exists)
            }
        });

        db.run("ALTER TABLE routes ADD COLUMN sent_count INTEGER DEFAULT 0", (err) => {
            if (err) {
                // Ignore error (column probably already exists)
            }
        });

        console.log('Database initialized');
    });
}

module.exports = db;
