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

// Genel bağlantı fonksiyonu
async function connectToDbAndQuery(query) {
    try {
        await sql.connect(config);
        const result = await sql.query(query);
        return result.recordset;
    } catch (err) {
        console.error("❌ SQL Hatası:", err); // 🔍 detaylı log
        throw err;
    }
}

// 🔐 Login tablosu verilerini getir (tüm kullanıcılar)
app.get("/api/login", async (req, res) => {
    try {
        const data = await connectToDbAndQuery("SELECT * FROM Login");
        res.json(data);
    } catch (err) {
        console.error("❌ Login verisi alınamadı:", err); // 👈 log eklendi
        res.status(500).send("Login verisi alınamadı");
    }
});

// 🔐 Login kontrolü
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT * FROM Login 
            WHERE KullaniciAdi = ${username} AND Sifre = ${password}`;

        if (result.recordset.length > 0) {
            res.json({ success: true, user: result.recordset[0] });
        } else {
            res.status(401).json({ success: false, message: "Kullanıcı adı veya şifre hatalı" });
        }
    } catch (err) {
        console.error("❌ Login kontrol hatası:", err); // 👈 log eklendi
        res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
});

// 📦 Siparisler tablosu
app.get("/api/siparisler", async (req, res) => {
    try {
        const data = await connectToDbAndQuery("SELECT * FROM Siparisler");
        res.json(data);
    } catch (err) {
        console.error("❌ Sipariş verisi alınamadı:", err); // 👈 log eklendi
        res.status(500).send("Sipariş verisi alınamadı");
    }
});

// Genel express hata yakalayıcı (isteğe bağlı)
app.use((err, req, res, next) => {
    console.error("❌ Express global hata:", err.stack);
    res.status(500).send("Sunucu hatası");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API ${PORT} portunda çalışıyor.`));
