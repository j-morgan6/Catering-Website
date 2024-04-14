const express = require('express')
const joi = require('joi')
const { CustomerTokens } = require('../functions/tokens')
const { extractAuthToken } = require('../functions/authorization')
const { compare, hash } = require('bcrypt')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { Database } = require('../database')

const router = express.Router()

router.get('/', (req, res) => { 
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

    const stmt = Database.prepare('SELECT FirstName, LastName, Company, Email, Phone FROM Customer INNER JOIN CustomerAuthentication WHERE ID = $id')
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

    const schema = joi.object({
        company: joi.string()
            .optional(),
        email: joi.string()
            .email(),
        phone: joi.string()
            .length(10)
            .optional()
            .allow('')
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
        'company': 'Company',
        'email': 'Email',
        'phone': 'Phone',
    }

    const tableMapping = {
        'company': 'Customer',
        'email': 'Authentication',
        'phone': 'Authentication'
    }

    // const customerQuery = 'UPDATE Customer SET'
    // const authenticationQuery = 'UPDATE CustomerAuthentication SET'
    let customerQuery = ''
    let authenticationQuery = ''

    const customerValues = { id: payload.id }
    const authenticationValues = { id: payload.id }

    for (col in req.body) {
        const table = tableMapping[col]
        if (table == 'Customer') {
            customerQuery += `, ${columnMapping[col]} = $${col}`
            customerValues[col] = req.body[col]
        }
        else if (table == 'Authentication') {
            authenticationQuery += `, ${columnMapping[col]} = $${col}`
            authenticationValues[col] = req.body[col]
        }
    }

    customerQuery = `UPDATE Customer SET${customerQuery.slice(1)} WHERE ID = $id`
    authenticationQuery = `UPDATE CustomerAuthentication SET${authenticationQuery.slice(1)} WHERE CustomerID = $id`

    const transaction = Database.transaction(() => {
        if (Object.keys(customerValues).length > 1) {
            const customerStmt = Database.prepare(customerQuery)
            customerStmt.run(customerValues)
        }

        if (Object.keys(authenticationValues).length > 1) {
            const authenticationStmt = Database.prepare(authenticationQuery)
            authenticationStmt.run(authenticationValues)
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

router.put('/password-reset', async (req, res) => {
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

    const schema = joi.object({
        old_password: joi.string().required(),
        new_password: joi.string().required()
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

    try {
        const passwordStmt = Database.prepare('SELECT Password from CustomerAuthentication WHERE CustomerID = $id')
        const password = passwordStmt.get({ id: payload.id }).Password

        const match = await compare(req.body.old_password, password)
        if (match) {
            const hashed = await hash(req.body.new_password, 6)

            const updateStmt = Database.prepare('UPDATE CustomerAuthentication SET Password = $password WHERE CustomerID = $id')
            updateStmt.run({ id: payload.id, password: hashed })

            res.send({ success: true })
        }
        else {
            res.status(StatusCodes.UNAUTHORIZED).send({
                error: {
                    code: StatusCodes.UNAUTHORIZED,
                    reason: ReasonPhrases.UNAUTHORIZED,
                    message: "Incorrect Password."
                }
            })
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

router.delete('/', (req, res) => {
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

    const stmt = Database.prepare('DELETE FROM Customer WHERE ID = $id')

    try {
        stmt.run({ id: payload.id })
        
        res.send({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                reason: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: err.message ? err.message : "The server encountered an error."
            }
        })
    }
})

router.get('/orders', (req, res) => {
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

    let orderInfoQuery = `SELECT
    \`Order\`.ID, \`Order\`.Timestamp, \`Order\`.Status, \`Order\`.OrderType, \`Order\`.DeliveryPickupTime,
    (SELECT SUM(MenuItem.Price * OrderItem.Quantity) FROM MenuItem JOIN OrderItem ON MenuItem.ID = OrderItem.MenuItemID WHERE OrderItem.OrderID = \`Order\`.ID) as Total,
    Customer.FirstName, Customer.LastName, Customer.Company,
    Store.Name as StoreName, Store.StreetNumber, Store.StreetName, Store.City, Store.Province, Store.PostalCode
    FROM (\`Order\` JOIN Store ON \`Order\`.StoreID = Store.ID) JOIN Customer ON \`Order\`.CustomerID = Customer.ID
    WHERE \`Order\`.CustomerID = $id
    ORDER BY \`Order\`.Timestamp DESC
    `
    if (req.query.limit) orderInfoQuery += ' LIMIT $limit'
    const orderInfoStmt = Database.prepare(orderInfoQuery)

    const orderItemsQuery = `SELECT
    MenuItem.Name, MenuItem.Description, MenuItem.Price, MenuItem.ImageURL,
    OrderItem.Quantity,
    MenuItem.Price * OrderItem.Quantity as Subtotal
    FROM OrderItem JOIN MenuItem ON OrderItem.MenuItemID = MenuItem.ID
    WHERE OrderID = $orderID
    `
    const orderItemsStmt = Database.prepare(orderItemsQuery)

    const successRes = []

    try {
        const orderResponse = orderInfoStmt.all({
            id: payload.id,
            limit: req.query.limit
        })

        if (!orderResponse) {
            res.status(StatusCodes.NO_CONTENT).send()
            return
        }
        
        for (const orderInfo of orderResponse) {
            const itemsResponse = orderItemsStmt.all({ orderID: orderInfo.ID })

            const order = {
                orderID: orderInfo.ID,
                timestamp: orderInfo.Timestamp,
                status: orderInfo.Status,
                orderType: orderInfo.OrderType,
                deliveryPickupTime: orderInfo.DeliveryPickupTime,
                total: orderInfo.Total,
                store: {
                    name: orderInfo.StoreName,
                    street: `${orderInfo.StreetNumber} ${orderInfo.StreetName}`,
                    city: orderInfo.City,
                    province: orderInfo.Province,
                    postal: orderInfo.PostalCode
                },
                customer: {
                    firstName: orderInfo.FirstName,
                    lastName: orderInfo.LastName,
                    company: orderInfo.Company
                },
                items: itemsResponse
            }

            successRes.push(order)
        }

        res.send(successRes)
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

router.get('/order/:orderID', (req, res) => {
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
    let orderInfoQuery = `SELECT
    \`Order\`.ID, \`Order\`.Timestamp, \`Order\`.Status, \`Order\`.OrderType, \`Order\`.DeliveryPickupTime,
    (SELECT SUM(MenuItem.Price * OrderItem.Quantity) FROM MenuItem JOIN OrderItem ON MenuItem.ID = OrderItem.MenuItemID WHERE OrderItem.OrderID = \`Order\`.ID) as Total,
    Customer.FirstName, Customer.LastName, Customer.Company,
    Store.Name as StoreName, Store.StreetNumber, Store.StreetName, Store.City, Store.Province, Store.PostalCode
    FROM (\`Order\` JOIN Store ON \`Order\`.StoreID = Store.ID) JOIN Customer ON \`Order\`.CustomerID = Customer.ID
    WHERE \`Order\`.CustomerID = $id AND \`Order\`.ID = $orderID
    `
    const orderInfoStmt = Database.prepare(orderInfoQuery)

    const orderItemsQuery = `SELECT
    MenuItem.Name, MenuItem.Description, MenuItem.Price, MenuItem.ImageURL,
    OrderItem.Quantity,
    MenuItem.Price * OrderItem.Quantity as Subtotal
    FROM OrderItem JOIN MenuItem ON OrderItem.MenuItemID = MenuItem.ID
    WHERE OrderID = $orderID
    `
    const orderItemsStmt = Database.prepare(orderItemsQuery)

    try {
        const orderResponse = orderInfoStmt.get({
            id: payload.id,
            orderID: req.params.orderID
        })

        if (!orderResponse) {
            res.status(StatusCodes.NO_CONTENT).send()
            return
        }

        const itemsResponse = orderItemsStmt.all({ orderID: orderResponse.ID })

        res.send({
            orderID: orderResponse.ID,
            timestamp: orderResponse.Timestamp,
            status: orderResponse.Status,
            orderType: orderResponse.OrderType,
            deliveryPickupTime: orderResponse.DeliveryPickupTime,
            total: orderResponse.Total,
            store: {
                name: orderResponse.StoreName,
                street: `${orderResponse.StreetNumber} ${orderResponse.StreetName}`,
                city: orderResponse.City,
                province: orderResponse.Province,
                postal: orderResponse.PostalCode
            },
            customer: {
                firstName: orderResponse.FirstName,
                lastName: orderResponse.LastName,
                company: orderResponse.Company
            },
            items: itemsResponse
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
    route: "/user"
}