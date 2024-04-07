const { sign, verify } = require('jsonwebtoken')

const customerSecret = process.env.JWT_SECRET
const adminSecret = process.env.JWT_ADMIN_SECRET

const createAccessToken = (payload, secret) => sign(payload, secret, { expiresIn: '15m' })
const createRefreshToken = (payload, secret) => sign(payload, secret, { expiresIn: '7d' })
const createTokenSet = (payload, secret) => {
    const access = createAccessToken(payload, secret)
    const refresh = createRefreshToken(payload, secret)
    return { access, refresh }
}
const validateToken = (token, secret) => {
    try {
        return verify(token, secret)
    } catch {
        return undefined
    }
}

const CustomerTokens = {
    createAccessToken: (payload) => createAccessToken(payload, customerSecret),
    createRefreshToken: (payload) => createRefreshToken(payload, customerSecret),
    createTokenSet: (payload) => createTokenSet(payload, customerSecret),
    validate: (token) => validateToken(token, customerSecret)
}

const AdminTokens = {
    createAccessToken: (payload) => createAccessToken(payload, adminSecret),
    createRefreshToken: (payload) => createRefreshToken(payload, adminSecret),
    createTokenSet: (payload) => createTokenSet(payload, adminSecret),
    validate: (token) => validateToken(token, adminSecret)
}

module.exports = { CustomerTokens, AdminTokens }