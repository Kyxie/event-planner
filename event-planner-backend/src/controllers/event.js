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

  const startDate = new Date(start)
  const endDate = new Date(end)

  if (isNaN(startDate) || isNaN(endDate)) {
    return Response.badRequest(res, 'Invalid date format')
  }

  if (startDate >= endDate) {
    return Response.badRequest(res, 'Start date must be before end date')
  }

  try {
    const event = new Event({ title, type, start: startDate, end: endDate, priority })
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

  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(start !== undefined && { start }),
        ...(end !== undefined && { end }),
        ...(priority !== undefined && { priority }),
      },
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
 *     summary: Get events within a specific date range, with optional filtering by title and type.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The start of the date range (YYYY-MM-DD).
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The end of the date range (YYYY-MM-DD).
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional keyword to filter events by title or type (case-insensitive, partial match).
 *     responses:
 *       200:
 *         description: List of events within the specified date range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Missing or invalid required date parameters.
 *       500:
 *         description: Internal server error while fetching events.
 */

router.get('/', async (req, res) => {
  try {
    let { startDate, endDate, keyword } = req.query

    // startDate and endDate are required
    if (!startDate || !endDate) {
      return Response.error(res, 'Missing required date parameters', 400)
    }

    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    startDateObj.setUTCHours(0, 0, 0, 0)
    endDateObj.setUTCHours(23, 59, 59, 999)

    const query = {
      start: {
        $gte: startDateObj,
        $lte: endDateObj,
      },
    }

    // search keyword are not required
    if (keyword) {
      const prefixRegex = { $regex: `^${keyword}`, $options: 'i' }
      query.$or = [{ title: prefixRegex }, { type: prefixRegex }]
    }

    let events = await Event.find(query)
    // Replace null priority with a very large value
    events = events.map((event) => {
      if (event.priority === null) {
        event.priority = Infinity
      }
      return event
    })

    // Sort the events by priority and start date
    events = events.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.start - b.start
      }
      return a.priority - b.priority
    })

    return Response.success(res, events)
  } catch (err) {
    return Response.error(res, `Failed to fetch events: ${err.message || err}`, 500)
  }
})

/**
 * @swagger
 * /api/events/reorder:
 *   post:
 *     summary: Reorder events by new ID order. Priority will be reassigned on backend.
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               draggedId:
 *                 type: string
 *                 description: ID of the dragged event
 *               beforeId:
 *                 type: string
 *                 description: ID of the event before the dragged event
 *               afterId:
 *                 type: string
 *                 description: ID of the event after the dragged event
 *     responses:
 *       200:
 *         description: Priorities updated
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/reorder', async (req, res) => {
  const { draggedId, beforeId, afterId } = req.body
  try {
    // The event need to be reset priority
    const events = await Event.find({ _id: { $in: [draggedId, beforeId, afterId] } })

    const map = Object.fromEntries(events.map((e) => [e._id.toString(), e]))
    // The before event
    const beforeEvent = map[beforeId] || null
    // The after event
    const afterEvent = map[afterId] || null

    let newPriority

    if (beforeEvent?.priority != null && afterEvent?.priority != null) {
      // If both before and after are not null
      newPriority = (beforeEvent.priority + afterEvent.priority) / 2
    } else if (!beforeEvent && afterEvent?.priority != null) {
      // If before is null
      newPriority = afterEvent.priority - 1000
    } else if (beforeEvent?.priority != null && !afterEvent) {
      // If after is null
      newPriority = beforeEvent.priority + 1000
    } else {
      // If both are null, we need to normalize first, then do it again
      await normalizeAllEvents()
      const normalizedEvents = await Event.find({ _id: { $in: [draggedId, beforeId, afterId] } })
      const updatedMap = Object.fromEntries(normalizedEvents.map((e) => [e._id.toString(), e]))
      const updatedBefore = updatedMap[beforeId] || null
      const updatedAfter = updatedMap[afterId] || null

      if (updatedBefore?.priority != null && updatedAfter?.priority != null) {
        newPriority = (updatedBefore.priority + updatedAfter.priority) / 2
      } else if (!updatedBefore && updatedAfter?.priority != null) {
        newPriority = updatedAfter.priority - 1000
      } else if (updatedBefore?.priority != null && !updatedAfter) {
        newPriority = updatedBefore.priority + 1000
      }
    }

    await Event.updateOne({ _id: draggedId }, { $set: { priority: newPriority } })

    if (Math.abs((beforeEvent?.priority ?? 0) - (afterEvent?.priority ?? 0)) < 1) {
      await normalizeAllEvents()
    }

    return res.json({ message: 'Reordered successfully' })
  } catch (err) {
    return res.status(500).json({ error: `Reorder failed: ${err.message}` })
  }
})

// Normalize
async function normalizeAllEvents() {
  const events = await Event.find().sort({ priority: 1, start: 1 })

  const bulkOps = events.map((e, i) => ({
    updateOne: {
      filter: { _id: e._id },
      update: { $set: { priority: i * 100 } },
    },
  }))

  await Event.bulkWrite(bulkOps)
}

/**
 * @swagger
 * /api/events/resetOrder:
 *   post:
 *     summary: Remove all event priority values (set to null)
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: All priorities cleared
 *       500:
 *         description: Server error
 */
router.post('/resetOrder', async (req, res) => {
  try {
    const events = await Event.find({}, { _id: 1 })
    const bulkOps = events.map((event) => ({
      updateOne: {
        filter: { _id: event._id },
        update: { $set: { priority: null } },
      },
    }))

    await Event.bulkWrite(bulkOps)
    return Response.success(res, { message: 'All event priorities cleared' })
  } catch (err) {
    return Response.error(res, `Failed to clear priorities: ${err.message || err}`, 500)
  }
})

export default router
