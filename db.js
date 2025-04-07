import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// ✅ BURASI ÖNEMLİ: default data hemen tanımlanmalı
db.data = { users: [] }

await db.read()

if (!db.data.users.find(u => u.username === 'admin')) {
    db.data.users.push({
        id: 1,
        username: 'admin',
        password: '1234',
        fullName: 'Görkem Çadırcı',
        role: 'Admin'
    })
    await db.write()
}

export default db
