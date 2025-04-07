require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Genel bağlantı (her endpoint için ayrı sorgu)
async function connectToDbAndQuery(query) {
  try {
    await sql.connect(config);
    const result = await sql.query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL Hatası:", err);
    throw err;
  }
}

// 🔐 Login tablosu verilerini getir
app.get("/api/login", async (req, res) => {
  try {
    const data = await connectToDbAndQuery("SELECT * FROM Login");
    res.json(data);
  } catch {
    res.status(500).send("Login verisi alınamadı");
  }
});

// 📦 Siparisler tablosu verilerini getir
app.get("/api/siparisler", async (req, res) => {
  try {
    const data = await connectToDbAndQuery("SELECT * FROM Siparisler");
    res.json(data);
  } catch {
    res.status(500).send("Sipariş verisi alınamadı");
  }
});

// ⚙️ Diğer tablolar için yeni endpoint'ler ekleyebilirsin

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API ${PORT} portunda çalışıyor.`));
