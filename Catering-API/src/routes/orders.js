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

    const filterSchema = joi.object({
        start_date: joi.date().optional(),
        end_date: joi.date().optional(),
        customer: joi.number().optional(),
        store: joi.number().optional(),
        type: joi.string().valid('pickup', 'delivery').optional(),
        min_price: joi.number().optional(),
        max_price: joi.number().optional(),
    })

    const validationResult = filterSchema.validate(req.body)
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

    // construct WHERE clause using filters
    const filterMap = {
        start_date: 'Timestamp >= $start_date',
        end_date: 'Timestamp <= $end_date',
        customer: 'CustomerID = $customer',
        store: 'StoreID = $store',
        type: 'OrderType = $type',
        min_price: 'Total >= $min_price',
        max_price: 'Total <= $max_price'
    }

    const filters = []
    for (const filter in req.body) if (filterMap[filter]) filters.push(filterMap[filter])
    const filterStr = filters.join(' AND ')

    // order by clause
    const orderBy = `ORDER BY \`Order\`.Timestamp ${req.query.order && req.query.order == 'asc' ? 'ASC' : 'DESC'}`

    const orderInfoStmt = Database.prepare(`SELECT
    \`Order\`.ID, \`Order\`.Timestamp, \`Order\`.Status, \`Order\`.OrderType, \`Order\`.DeliveryPickupTime,
    (SELECT SUM(MenuItem.Price * OrderItem.Quantity) FROM MenuItem JOIN OrderItem ON MenuItem.ID = OrderItem.MenuItemID WHERE OrderItem.OrderID = \`Order\`.ID) as Total,
    Customer.FirstName, Customer.LastName, Customer.Company,
    Store.Name as StoreName, Store.StreetNumber, Store.StreetName, Store.City, Store.Province, Store.PostalCode
    FROM (\`Order\` JOIN Store ON \`Order\`.StoreID = Store.ID) JOIN Customer ON \`Order\`.CustomerID = Customer.ID
    ${filterStr ? `WHERE ${filterStr} ` : ''}
    ${orderBy}
    `)

    const orderItemsStmt = Database.prepare(`SELECT
    MenuItem.Name, MenuItem.Description, MenuItem.Price, MenuItem.ImageURL,
    OrderItem.Quantity,
    MenuItem.Price * OrderItem.Quantity as Subtotal
    FROM OrderItem JOIN MenuItem ON OrderItem.MenuItemID = MenuItem.ID
    WHERE OrderID = $orderID
    `)

    try {
        const orderResponse = orderInfoStmt.all(req.body)

        if (!orderResponse) {
            res.status(StatusCodes.NO_CONTENT).send()
            return
        }

        const orders = []

        for (const orderInfo of orderResponse) {
            const itemsResponse = orderItemsStmt.all({ orderID: orderResponse.ID })

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

            orders.push(order)
        }

        res.send(orders)
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
    route: "/orders"
}