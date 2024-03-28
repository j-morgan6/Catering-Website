const { readdirSync } = require('fs')
const { join } = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

dotenv.config()

// APP VARIABLES
if (!process.env.PORT) {
    console.error('No port specified.')
    process.exit(1)
}
const PORT = process.env.PORT

if (!process.env.DB_PATH) {
    console.error('No database path specified.')
    process.exit(1)
}

if (!process.env.JWT_SECRET) {
    console.error('No JSON Web Token Secret Ket provided.')
    process.exit(1)
}

if (!process.env.HASH_SALT) {
    console.error('No salt provided.')
    process.exit(1)
}

const app = express()

// APP CONFIGURATION
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
}))
app.use(cookieParser())

// Import and set routes located in src/routes
const routesPath = join(__dirname, 'routes')
const routeFiles = readdirSync(routesPath).filter(file => file.endsWith('.js'))
for (const file of routeFiles) {
    const router = require(join(routesPath, file))
    app.use(router.route, router.router)
}

// RUN THE APP
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))