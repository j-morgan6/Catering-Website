const express = require('express')
const joi = require('joi')
const { AdminTokens } = require('../functions/tokens')
const { extractAuthToken } = require('../functions/authorization')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { Database } = require('../database')

const router = express.Router()

router.get('/', (req, res) => { 
    // Get authorization token
    const token = extractAuthToken(req.headers.authorization)

    const payload = AdminTokens.validate(token)
    if (!payload) {
        res.status(StatusCodes.UNAUTHORIZED).send({
            error: {
                code: StatusCodes.UNAUTHORIZED,
                reason: ReasonPhrases.UNAUTHORIZED,
                message: "Invaliad authorization token."
            }
        })
        return
    }

    const stmt = Database.prepare('SELECT FirstName, LastName, Username FROM Admin INNER JOIN AdminAuthentication WHERE ID = $id')
    try {
        const response = stmt.get({ id: payload.id })

        if (!response) res.status(StatusCodes.NO_CONTENT).send()
        else {
            res.send(response)
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                reason: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: err.message ? err.message : "The server encountered an error."
            }
        })
    }
})

router.put('/', (req, res) => {
    // Get authorization token
    const token = extractAuthToken(req.headers.authorization)

    const payload = AdminTokens.validate(token)
    if (!payload) {
        res.status(StatusCodes.UNAUTHORIZED).send({
            error: {
                code: StatusCodes.UNAUTHORIZED,
                reason: ReasonPhrases.UNAUTHORIZED,
                message: "Invaliad authorization token."
            }
        })
        return
    }

    const schema = joi.object({
        username: joi.string()
            .optional(),
        password: joi.string()
            .optional()
    }).min(1)

    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: {
                code: StatusCodes.BAD_REQUEST,
                reason: ReasonPhrases.BAD_REQUEST,
                message: validationResult.error.message
            }
        })
        return
    }

    const columnMapping = {
        'username': 'Username',
        'password': 'Password',
    }

    let adminQuery = ''
    const adminValues = { id: payload.id }

    for (col in req.body) {
        adminQuery += `, ${columnMapping[col]} = $${col}`
        adminValues[col] = req.body[col]
    }

    adminQuery = `UPDATE Admin SET${adminQuery.slice(1)} WHERE ID = $id`

    const transaction = Database.transaction(() => {
        if (Object.keys(adminValues).length > 1) {
            const adminStmt = Database.prepare(adminQuery)
            adminStmt.run(adminValues)
        }

        res.send({
            success: true
        })
    })
    
    try {
        transaction()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                reason: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: err.message ? err.message : "The server encountered an error."
            }
        })
    }
})

router.delete('/', (req, res) => {
    // Get authorization token
    const token = extractAuthToken(req.headers.authorization)

    const payload = AdminTokens.validate(token)
    if (!payload) {
        res.status(StatusCodes.UNAUTHORIZED).send({
            error: {
                code: StatusCodes.UNAUTHORIZED,
                reason: ReasonPhrases.UNAUTHORIZED,
                message: "Invaliad authorization token."
            }
        })
        return
    }

    const stmt = Database.prepare('DELETE FROM Admin WHERE ID = $id')

    try {
        stmt.run(payload.id)
        
        res.send({
            success: true
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                reason: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: err.message ? err.message : "The server encountered an error."
            }
        })
    }
})

module.exports = {
    router: router,
    route: "/admin"
}