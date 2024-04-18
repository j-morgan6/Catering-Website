const express = require('express')
const joi = require('joi')
const { AdminTokens, CustomerTokens } = require('../functions/tokens')
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
        type: joi.string().valid('Pickup', 'Delivery').optional(),
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

    const customerOrderStmt = Database.prepare(`SELECT
    \`Order\`.*,
    (SELECT SUM(MenuItem.Price * OrderItem.Quantity) FROM MenuItem JOIN OrderItem ON MenuItem.ID = OrderItem.MenuItemID WHERE OrderItem.OrderID = \`Order\`.ID) as Total,
    Guest.FirstName, Guest.LastName, Guest.Company, Guest.Email, Guest.Phone,
    Store.Name as StoreName, Store.StreetNumber, Store.StreetName, Store.City, Store.Province, Store.PostalCode
    FROM (\`Order\` JOIN Store ON \`Order\`.StoreID = Store.ID) JOIN Guest ON \`Order\`.GuestID = Guest.ID
    ${filterStr ? `WHERE ${filterStr} ` : ''}
    ${orderBy}
    `)

    const guestOrderStmt = Database.prepare(`
    SELECT
        \`Order\`.*,
        (SELECT SUM(MenuItem.Price * OrderItem.Quantity) FROM MenuItem JOIN OrderItem ON MenuItem.ID = OrderItem.MenuItemID WHERE OrderItem.OrderID = \`Order\`.ID) as Total,
        Customer.FirstName, Customer.LastName, Customer.Company,
        CustomerAuth.Email, CustomerAuth.Phone,  
        Store.Name as StoreName, Store.StreetNumber, Store.StreetName, Store.City, Store.Province, Store.PostalCode
    FROM (\`Order\`
        JOIN Store ON \`Order\`.StoreID = Store.ID)
        JOIN Customer ON \`Order\`.CustomerID = Customer.ID
        JOIN CustomerAuthentication AS CustomerAuth ON Customer.ID = CustomerAuth.CustomerID 
    ${filterStr ? `WHERE ${filterStr} ` : ''}
    ${orderBy}
`);
    const orderItemsStmt = Database.prepare(`SELECT
    MenuItem.Name, MenuItem.Description, MenuItem.Price, MenuItem.ImageURL,
    OrderItem.Quantity,
    MenuItem.Price * OrderItem.Quantity as Subtotal
    FROM OrderItem JOIN MenuItem ON OrderItem.MenuItemID = MenuItem.ID
    WHERE OrderID = $orderID
    `)

    try {
        // get orders by registered customers
        const customerOrderResponse = customerOrderStmt.all(req.body)
        // get orders by guest customers
        const guestOrderResponse = guestOrderStmt.all(req.body)

        const orders = []

        for (const orderInfo of customerOrderResponse) {
            const itemsResponse = orderItemsStmt.all({ orderID: orderInfo.ID })

            const order = {
                orderID: orderInfo.ID,
                timestamp: orderInfo.Timestamp,
                status: orderInfo.Status,
                orderType: orderInfo.OrderType,
                dueDate: orderInfo.DueDate,
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
                    company: orderInfo.Company,
                    email: orderInfo.Email,
                    phone: orderInfo.Phone
                },
                items: itemsResponse
            }

            if (orderInfo.OrderType === 'Delivery') {
                order.address = `${orderInfo.DeliveryStreet}, ${orderInfo.DeliveryCity}, ${orderInfo.DeliveryProvince} ${orderInfo.DeliveryPostalCode}, Canada`;
            }

            orders.push(order)
        }

        for (const orderInfo of guestOrderResponse) {
            const itemsResponse = orderItemsStmt.all({ orderID: orderInfo.ID })

            const order = {
                orderID: orderInfo.ID,
                timestamp: orderInfo.Timestamp,
                status: orderInfo.Status,
                orderType: orderInfo.OrderType,
                dueDate: orderInfo.DueDate,
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
                    company: orderInfo.Company,
                    email: orderInfo.Email,
                    phone: orderInfo.Phone
                },
                items: itemsResponse
            }

            if (orderInfo.OrderType === 'Delivery') {
                order.address = `${orderInfo.DeliveryStreet}, ${orderInfo.DeliveryCity}, ${orderInfo.DeliveryProvince} ${orderInfo.DeliveryPostalCode}, Canada`;
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

router.put('/:order/status', (req, res) => {
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
        status: joi.string().required()
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

    req.body.order = req.params.order

    try {
        const stmt = Database.prepare('UPDATE `Order` SET Status = $status WHERE ID = $order')
        stmt.run(req.body)
        res.send({ success: true })
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

router.post('/order', (req, res) => {
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
        store: joi.number().required(),
        type: joi.string().valid('Delivery', 'Pickup').required(),
        address: joi.object({
            street: joi.string().required(),
            city: joi.string().required(),
            province: joi.string().required(),
            postal: joi.string().required()
        }).optional(),
        due_date: joi.date(),
        items: joi.array().items(joi.object({
            item: joi.number().required(),
            quantity: joi.number().required()
        })).min(1).required()
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

    req.body.customer = payload.id

    const transaction = Database.transaction(() => {
        let orderQuery
        if (req.body.type == 'Delivery') orderQuery = 'INSERT INTO `Order` (CustomerID, StoreID, OrderType, DueDate, DeliveryStreet, DeliveryCity, DeliveryProvince, DeliveryPostalCode) VALUES ($customer, $store, $type, $due_date, $street, $city, $province, $postal)'
        else orderQuery = 'INSERT INTO `Order` (CustomerID, StoreID, OrderType, DueDate) VALUES ($customer, $store, $type, $due_date)'
        const orderStmt = Database.prepare(orderQuery)

        const itemStmt = Database.prepare('INSERT INTO OrderItem (OrderID, MenuItemID, Quantity) VALUES ($order, $item, $quantity)')
        
        const orderDetails = {
            customer: payload.id,
            store: req.body.store,
            type: req.body.type,
            due_date: req.body.due_date,
        }
        if (req.body.type == 'Delivery') {
            orderDetails.street = req.body.address.street
            orderDetails.city = req.body.address.city
            orderDetails.province = req.body.address.province
            orderDetails.postal = req.body.address.postal
        }

        const orderID = orderStmt.run(orderDetails).lastInsertRowid
        console.log(orderID)

        for (const item of req.body.items) {
            item.order = orderID
            itemStmt.run(item)
        }

        res.send({
            success: true,
            orderID: orderID
        })
    })

    try {
        transaction()
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

router.post('/guest-order', (req, res) => {
    const schema = joi.object({
        guest: joi.object({
            first_name: joi.string().required(),
            last_name: joi.string().required(),
            email: joi.string().email().required(),
            phone: joi.string().required(),
            company: joi.string().required()
        }).required(),
        store: joi.number().required(),
        type: joi.string().valid('Delivery', 'Pickup').required(),
        address: joi.object({
            street: joi.string().required(),
            city: joi.string().required(),
            province: joi.string().required(),
            postal: joi.string().required()
        }).optional(),
        due_date: joi.date(),
        items: joi.array().items(joi.object({
            item: joi.number().required(),
            quantity: joi.number().required()
        })).min(1).required()
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

    const transaction = Database.transaction(() => {
        // create the guest user
        const guestStmt = Database.prepare('INSERT INTO Guest (FirstName, LastName, Email, Phone, Company) VALUES ($first_name, $last_name, $email, $phone, $company)')

        let orderQuery
        if (req.body.type == 'Delivery') orderQuery = 'INSERT INTO `Order` (GuestID, StoreID, OrderType, DueDate, DeliveryStreet, DeliveryCity, DeliveryProvince, DeliveryPostalCode) VALUES ($guest, $store, $type, $due_date, $street, $city, $province, $postal)'
        else orderQuery = 'INSERT INTO `Order` (GuestID, StoreID, OrderType, DueDate) VALUES ($guest, $store, $type, $due_date)'
        const orderStmt = Database.prepare(orderQuery)

        const itemStmt = Database.prepare('INSERT INTO OrderItem (OrderID, MenuItemID, Quantity) VALUES ($order, $item, $quantity)')

        const guestID = guestStmt.run(req.body.guest).lastInsertRowid
        console.log(`Guest: ${guestID}`)

        const orderDetails = {
            guest: guestID,
            store: req.body.store,
            type: req.body.type,
            due_date: req.body.due_date,
        }
        if (req.body.type == 'Delivery') {
            orderDetails.street = req.body.address.street
            orderDetails.city = req.body.address.city
            orderDetails.province = req.body.address.province
            orderDetails.postal = req.body.address.postal
        }
        const orderID = orderStmt.run(orderDetails).lastInsertRowid

        for (const item of req.body.items) {
            item.order = orderID
            itemStmt.run(item)
        }

        res.send({
            success: true,
            orderID: orderID
        })
    })

    try {
        transaction()
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

router.delete('/:order', (req, res) => {
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

    const stmt = Database.prepare('DELETE FROM `Order` WHERE ID = $order')

    try {
        stmt.run({ order: req.params.order })
        
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

module.exports = {
    router: router,
    route: "/orders"
}