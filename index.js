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

    db.get(
        `SELECT * FROM Login WHERE KullaniciAdi = ? AND Sifre = ?`,
        [username, password],
        (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (row) {
                res.status(200).json({ message: 'Success', user: row });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
    );
});

app.listen(port, () => {
    console.log(`API ${port} portunda çalışıyor.`);
});
