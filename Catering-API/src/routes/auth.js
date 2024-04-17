const { Router } = require('express')
const joi = require('joi')
const { CustomerTokens } = require('../functions/tokens')
const { extractAuthToken } = require('../functions/authorization')
const { hash, compare } = require('bcrypt')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { Database } = require('../database') 

const router = Router()

router.post('/login', async (req, res) => {
    const schema = joi.object({
        email: joi.string()
            .email()
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

    const query = Database.prepare('SELECT CustomerID, Password FROM CustomerAuthentication WHERE Email = $email')

    try {
        const response = query.get({ email: req.body.email })
        if (!response) {
            res.status(StatusCodes.UNAUTHORIZED).send({
                success: false,
                message: 'Invalid Credentials'
            })
        } else {
            const match = await compare(req.body.password, response.Password)
            if (match) {
                // generate JWTs
                const { access, refresh } = CustomerTokens.createTokenSet({ id: response.CustomerID })
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
                message: err.message ? err.message : "The server encountered an error."
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
        company: joi.string()
            .optional()
            .allow(''),
        email: joi.string()
            .email()
            .required(),
        phone: joi.string()
            .length(10)
            .optional()
            .allow(''),
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
        // Insert into Customer table
        let customerQuery = 'INSERT INTO Customer (FirstName, LastName'
        let customerColumns = 'VALUES ($first, $last'
        let CustomerValues = {
            first: values.first_name,
            last: values.last_name,
            company: ''
        }
        if (values.company) {
            customerQuery += ', Company'
            customerColumns += ', $company'
            CustomerValues.company = values.company
        }
        customerQuery += ') ' + customerColumns + ')'
        const customerStatement = Database.prepare(customerQuery)
        const customerId = customerStatement.run(CustomerValues).lastInsertRowid

        // Insert into CustomerCredentials table
        let credentialsQuery = 'INSERT INTO CustomerAuthentication (CustomerID, Email, Password'
        let credentialsColumns = "VALUES ($id, $email, $password"
        let credentialsValues = {
            id: customerId,
            email: values.email,
            password: values.password,
            phone: ""
        }
        if (values.phone) {
            credentialsQuery += ', Phone'
            credentialsColumns += ", $phone"
            credentialsValues.phone = values.phone
        }
        credentialsQuery += ') ' + credentialsColumns + ')'
        const credentialsStatement = Database.prepare(credentialsQuery)
        credentialsStatement.run(credentialsValues)

        // Generate a JWT
        const { access, refresh } = CustomerTokens.createTokenSet({ id: customerId })
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
            let conflict = ''
            if (err.message.includes('CustomerAuthentication.Email')) conflict = 'email'
            else if (err.message.includes('CustomerAuthentication.Phone')) conflict = 'phone'

            if (conflict) {
                res.status(StatusCodes.CONFLICT).send({
                    error: {
                        code: StatusCodes.CONFLICT,
                        reason: ReasonPhrases.CONFLICT,
                        message: conflict + ' must be unique'
                    }
                })
                return
            }
        }

        res.status(500).send({
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

    const payload = CustomerTokens.validate(token)
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

    const payload = CustomerTokens.validate(token)
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

    const newToken = CustomerTokens.createAccessToken(payload.id)

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
    route: '/auth'
}