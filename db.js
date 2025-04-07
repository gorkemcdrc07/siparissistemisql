const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Tabloyu olu�tur
db.prepare(`
  CREATE TABLE IF NOT EXISTS Login (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    KullaniciAdi TEXT,
    Sifre TEXT,
    Yetki TEXT,
    AdSoyad TEXT
  )
`).run();

// Admin yoksa ekle
const admin = db.prepare(`SELECT * FROM Login WHERE KullaniciAdi = ?`).get('admin');

if (!admin) {
    db.prepare(`
    INSERT INTO Login (KullaniciAdi, Sifre, Yetki, AdSoyad)
    VALUES (?, ?, ?, ?)
  `).run('admin', '1234', 'Admin', 'G�rkem �ad�rc�');
}

module.exports = db;
