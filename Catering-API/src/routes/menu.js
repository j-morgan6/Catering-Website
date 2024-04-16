const express = require('express')
const joi = require('joi')
const { AdminTokens } = require('../functions/tokens')
const { extractAuthToken } = require('../functions/authorization')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { Database } = require('../database')

const router = express.Router()

router.get('/items', (req, res) => {
    const filterSchema = joi.object({
        min_price: joi.number().optional(),
        max_price: joi.number().optional(),
        category: joi.string().optional()
    })

    const filterValidationResult = filterSchema.validate(req.body)
    if (filterValidationResult.error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: {
                code: StatusCodes.BAD_REQUEST,
                reason: ReasonPhrases.BAD_REQUEST,
                message: filterValidationResult.error.message
            }
        })
        return
    }

    const filterMap = {
        min_price: 'Price >= $min_price',
        max_price: 'Price <= $max_price',
        category: 'Category = $Category'
    }

    const filters = []
    for (const filter in req.body) if (filterMap[filter]) filters.push(filterMap[filter])
    const filterStr = filters.join(' AND ')

    stmt = Database.prepare(`SELECT * FROM MenuItem WHERE Category IN ('Breakfast', 'Lunch', 'À la Carte', 'Beverages', 'Dessert') ${filterStr ? `AND ${filterStr}` : ''}`)

    try {
        const response = stmt.all(req.body)

        if (!response) {
            res.status(StatusCodes.NO_CONTENT).send()
            return
        }

        res.send(response)
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

router.get('/items', (req, res) => {
    const filterSchema = joi.object({
        min_price: joi.number().optional(),
        max_price: joi.number().optional(),
        category: joi.string().optional()
    })

    const filterValidationResult = filterSchema.validate(req.body)
    if (filterValidationResult.error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: {
                code: StatusCodes.BAD_REQUEST,
                reason: ReasonPhrases.BAD_REQUEST,
                message: filterValidationResult.error.message
            }
        })
        return
    }

    const filterMap = {
        min_price: 'Price >= $min_price',
        max_price: 'Price <= $max_price',
        category: 'Category = $Category'
    }

    const filters = []
    for (const filter in req.body) if (filterMap[filter]) filters.push(filterMap[filter])
    const filterStr = filters.join(' AND ')

    stmt = Database.prepare(`SELECT * FROM MenuItem WHERE Category IN ('Breakfast', 'Lunch', 'À la Carte', 'Beverages', 'Dessert') ${filterStr ? `AND ${filterStr}` : ''}`)

    try {
        const response = stmt.all(req.body)

        if (!response) {
            res.status(StatusCodes.NO_CONTENT).send()
            return
        }

        res.send(response)
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
    route: "/menu"
}