function extractAuthToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined
    else return authHeader.slice(7)
    
}

module.exports = { extractAuthToken }