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

if (!process.env.ALLOWED_ORIGINS) {
    console.error('No Origins allowed.')
    process.exit(1)
}

const app = express()

// APP CONFIGURATION
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// const originCheck = (origin, callback) => {
//     if (origin) {
//         for (allowed of process.env.ALLOWED_ORIGINS.split(',')) {
//             if (origin.startsWith(`http://${allowed}`)) {
//                 callback(null, true)
//                 return
//             } 
//         }
//     }
    
//     callback(new Error('Not allowed by CORS'))
// }
// app.use(cors({
//     origin: originCheck,
//     optionsSuccessStatus: 200,
//     credentials: true
// }))
app.use(cors())
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