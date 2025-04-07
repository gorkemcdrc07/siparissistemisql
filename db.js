const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Tablolarý ve örnek kullanýcýyý oluþtur
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS Login (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      KullaniciAdi TEXT,
      Sifre TEXT,
      Yetki TEXT,
      AdSoyad TEXT
    )
  `);

    db.get(`SELECT * FROM Login WHERE KullaniciAdi = 'admin'`, (err, row) => {
        if (!row) {
            db.run(`
        INSERT INTO Login (KullaniciAdi, Sifre, Yetki, AdSoyad)
        VALUES ('admin', '1234', 'Admin', 'Görkem Çadýrcý')
      `);
        }
    });
});

module.exports = db;
