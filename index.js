const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const row = db.prepare(
            `SELECT * FROM Login WHERE KullaniciAdi = ? AND Sifre = ?`
        ).get(username, password);

        if (row) {
            res.status(200).json({ message: 'Success', user: row });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`API ${port} portunda çalışıyor.`);
});
