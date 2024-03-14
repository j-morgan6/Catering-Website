const express = require('express')
const jwt = require('jsonwebtoken')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { Database } = require('../database')

const router = express.Router()

router.get('/', (req, res) => { 
    // Get authorization token
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
        // extract token
        const token = authHeader.slice(7)

        // validate the token
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                res.status(StatusCodes.UNAUTHORIZED).send({
                    error: {
                        code: StatusCodes.UNAUTHORIZED,
                        reason: ReasonPhrases.UNAUTHORIZED,
                        message: "Invalid access token."
                    }
                })
            }
            else {
                const stmt = Database.prepare('SELECT FirstName, LastName, Email, Phone FROM Customer INNER JOIN CustomerAuthentication WHERE ID = $id')

                try {
                    const response = stmt.get({ id: payload.id })

                    if (!response) res.status(204).send()
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
            }
        })
    }
    else {
        res.status(StatusCodes.UNAUTHORIZED).send({
            error: {
                code: StatusCodes.UNAUTHORIZED,
                reason: ReasonPhrases.UNAUTHORIZED,
                message: "No access token provided."
            }
        })
    }
})

module.exports = {
    router: router,
    route: "/user"
}