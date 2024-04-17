const { Router } = require('express')
const joi = require('joi')
const { AdminTokens } = require('../functions/tokens')
const { extractAuthToken } = require('../functions/authorization')
const { hash, compare } = require('bcrypt')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { Database } = require('../database') 

const router = Router()

router.post('/login', async (req, res) => {
    const schema = joi.object({
        username: joi.string()
            .required(),
        password: joi.string()
            .required()
    })

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

    const query = Database.prepare('SELECT AdminID, Password FROM AdminAuthentication WHERE LOWER(Username) = LOWER($username)')

    try {
        const response = query.get({ username: req.body.username })
        if (!response) {
            res.status(StatusCodes.UNAUTHORIZED).send({
                success: false,
                message: 'Invalid Credentials'
            })
        } else {
            const match = await compare(req.body.password, response.Password)
            if (match) {
                // generate JWTs
                const { access, refresh } = AdminTokens.createTokenSet({ id: response.AdminID })
                res.cookie('apd_accessToken', access, {
                    secure: true,
                    sameSite: 'strict'
                })
                res.cookie('apd_refreshToken', refresh, {
                    secure: true,
                    sameSite: 'strict'
                })
                
                res.send({ 
                    success: true,
                    accessToken: access,
                    refreshToken: refresh
                })
            } else {
                res.status(StatusCodes.UNAUTHORIZED).send({
                    success: false,
                    message: 'Invalid Credentials'
                })
            }
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                reason: ReasonPhrases.INTERNAL_SERVER_ERROR,
            }
        })
    }
})

router.post('/register', async (req, res) => {
    const schema = joi.object({
        first_name: joi.string()
            .required(),
        last_name: joi.string()
            .required(),
        username: joi.string()
            .required(),
        password: joi.string()
            .required()
    })

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

    const transaction = Database.transaction(values => {
        const adminStmt = Database.prepare('INSERT INTO Admin (FirstName, LastName) VALUES ($first, $last)')
        const authStmt = Database.prepare('INSERT INTO AdminAuthentication (AdminID, Username, Password) VALUES ($id, $username, $password)')

        const adminID = adminStmt.run({
            first: req.body.first_name,
            last: req.body.last_name
        }).lastInsertRowid

        authStmt.run({
            id: adminID,
            username: req.body.username,
            password: req.body.password
        })

        // generate JWTs
        const { access, refresh } = AdminTokens.createTokenSet({ id: adminID })
        res.cookie('apd_accessToken', access, {
            secure: true,
            sameSite: 'strict'
        })
        res.cookie('apd_refreshToken', refresh, {
            secure: true,
            sameSite: 'strict'
        })
        
        res.send({ 
            success: true,
            accessToken: access,
            refreshToken: refresh
        })
    })

    // hash the password
    req.body.password = await hash(req.body.password, 6)

    try {
        transaction(req.body)
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            res.status(StatusCodes.CONFLICT).send({
                error: {
                    code: StatusCodes.CONFLICT,
                    reason: ReasonPhrases.CONFLICT,
                    message: err.message
                }
            })
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                reason: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: err.message ? err.message : "The server encountered an error."
            }
        })
    }
})

router.post('/validate', (req, res) => {
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

    res.send({ valid: true })
})

router.post('/refresh', (req, res) => {
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

    const newToken = AdminTokens.createAccessToken(payload.id)

    res.cookie('apd_accessToken', newToken, {
        secure: true,
        sameSite: 'strict'
    }).send({
        success: true,
        token: newToken
    })
})

module.exports = {
    router: router,
    route: '/admin/auth'
}