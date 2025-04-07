import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

// SQL Server config
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const pool = await sql.connect(config)
        const result = await pool
            .request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query(`SELECT TOP 1 * FROM Login WHERE KullaniciAdi = @username AND Sifre = @password`)

        const user = result.recordset[0]

        if (user) {
            res.json({ message: 'Success', user })
        } else {
            res.status(401).json({ message: 'Invalid credentials' })
        }
    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

app.listen(port, () => {
    console.log(`API ${port} portunda çalışıyor.`)
})
