/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - start
 *         - end
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *           description: Event title
 *           example: Q1 Earnings Call
 *         type:
 *           type: string
 *           description: Event type
 *           example: Dividends
 *         start:
 *           type: string
 *           format: date-time
 *           description: Start time
 *           example: 2025-04-15T09:00:00Z
 *         end:
 *           type: string
 *           format: date-time
 *           description: End time
 *           example: 2025-04-15T10:00:00Z
 *         priority:
 *           type: integer
 *           description: Priority level
 *           nullable: true
 *           example: 1
 */

import express from 'express'
import { Response } from '../utils/Response.js'
import Event from '../models/Event.js'
import { startOfMonth, endOfMonth } from 'date-fns'

const router = express.Router()

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Missing required fields
 */
router.post('/', async (req, res) => {
  const { title, type, start, end, priority } = req.body
  if (!title || !type || !start || !end) {
    return Response.badRequest(res, 'Missing required fields')
  }
  try {
    const event = new Event({ title, type, start, end, priority })
    await event.save()
    return Response.success(res, event, 'Event created', 201)
  } catch (err) {
    return Response.error(res, `Failed to create event: ${err.message || err}`)
  }
})

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       400:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id)
    if (!deletedEvent) {
      return Response.badRequest(res, 'Event not found')
    }
    return Response.success(res, deletedEvent, 'Event deleted')
  } catch (err) {
    return Response.error(res, `Failed to delete event: ${err.message || err}`)
  }
})

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Event not found or invalid data
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
  const { title, type, start, end, priority } = req.body

  if (!title || !type || !start || !end) {
    return Response.badRequest(res, 'Missing required fields')
  }

  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { title, type, start, end, priority },
      { new: true, runValidators: true }
    )

    if (!updated) {
      return Response.badRequest(res, 'Event not found')
    }

    return Response.success(res, updated, 'Event updated')
  } catch (err) {
    return Response.error(res, `Failed to update event: ${err.message || err}`)
  }
})

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get events within a specific date range (day-level precision)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of events in the range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Missing or invalid date parameters
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    let { startDate, endDate } = req.query

    // If no start or end, use current month as default
    if (!startDate || !endDate) {
      const now = new Date()
      startDate = startOfMonth(now).toISOString().slice(0, 10)
      endDate = endOfMonth(now).toISOString().slice(0, 10)
    }

    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    // Formatting
    startDateObj.setUTCHours(0, 0, 0, 0)
    endDateObj.setUTCHours(23, 59, 59, 999)

    // Search if start >= startDate && start <= endDate
    const events = await Event.find({
      start: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ start: 1 })

    return Response.success(res, events)
  } catch (err) {
    return Response.error(res, `Failed to fetch events: ${err.message || err}`)
  }
})

export default router
