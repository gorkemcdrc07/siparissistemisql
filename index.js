import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import db from './db.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

app.post('/api/login', async (req, res) => {
    await db.read()
    const { username, password } = req.body

    const user = db.data.users.find(
        u => u.username === username && u.password === password
    )

    if (user) {
        res.json({ message: 'Success', user })
    } else {
        res.status(401).json({ message: 'Invalid credentials' })
    }
})

app.listen(port, () => {
    console.log(`API ${port} portunda çalışıyor.`)
})
