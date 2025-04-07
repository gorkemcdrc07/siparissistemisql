import { JSONFile, Low } from 'lowdb'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// CommonJS de�il, ESM olarak �al��t��� i�in bu sat�rlar �nemli
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()
db.data ||= { users: [] }

// E�er admin yoksa ekle
if (!db.data.users.find(u => u.username === 'admin')) {
    db.data.users.push({
        id: 1,
        username: 'admin',
        password: '1234',
        fullName: 'G�rkem �ad�rc�',
        role: 'Admin'
    })
    await db.write()
}

export default db
