import { default as sqlite } from 'better-sqlite3'
import join from 'path'

const dbPath = join(__dirname, process.env.DB_PATH)
try {
    const Database = sqlite(dbPath, {
        fileMustExist: true
    })
    module.exports = {
        Database: Database
    }
} catch (err) {
    console.error(`Error opening database: ${err}`)
    process.exit(1)
}