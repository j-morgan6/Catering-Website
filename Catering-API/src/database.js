const sqlite = require('better-sqlite3')
const { join } = require('path')

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