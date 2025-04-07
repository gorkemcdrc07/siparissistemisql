import { JSONFile, Low } from 'lowdb'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// CommonJS deðil, ESM olarak çalýþtýðý için bu satýrlar önemli
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()
db.data ||= { users: [] }

// Eðer admin yoksa ekle
if (!db.data.users.find(u => u.username === 'admin')) {
    db.data.users.push({
        id: 1,
        username: 'admin',
        password: '1234',
        fullName: 'Görkem Çadýrcý',
        role: 'Admin'
    })
    await db.write()
}

export default db
