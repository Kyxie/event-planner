import express from 'express'
import EventType from '../models/EventType.js'
import { Response } from '../utils/Response.js'

const router = express.Router()

/**
 * @swagger
 * /api/eventTypes:
 *   get:
 *     summary: Get all event types as string array
 *     tags: [EventTypes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search keyword to filter event types
 *     responses:
 *       200:
 *         description: List of event type strings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.type = { $regex: search, $options: 'i' };
    }
    const types = await EventType.find(query).sort({ type: 1 }).select('type -_id');
    const typeList = types.map((t) => t.type);
    return Response.success(res, typeList);
  } catch (err) {
    return Response.error(res, `Failed to fetch event types: ${err.message || err}`, 500);
  }
});

/**
 * @swagger
 * /api/eventTypes:
 *   post:
 *     summary: Add or update an event type with count
 *     tags: [EventTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event type updated or inserted
 *       400:
 *         description: Type is required
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { type } = req.body;
    if (!type || typeof type !== 'string') {
      return Response.error(res, 'Type is required and must be a string', 400);
    }

    const updated = await EventType.findOneAndUpdate(
      { type },
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return Response.success(res, updated, 200);
  } catch (err) {
    return Response.error(res, `Failed to update/add event type: ${err.message || err}`, 500);
  }
});

/**
 * @swagger
 * /api/eventTypes:
 *   delete:
 *     summary: Decrement count or remove event type
 *     tags: [EventTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Count decremented or event type removed
 *       400:
 *         description: Type does not exist
 *       500:
 *         description: Server error
 */
router.delete('/', async (req, res) => {
  try {
    const { type } = req.body;
    if (!type || typeof type !== 'string') {
      return Response.error(res, 'Type is required and must be a string', 400);
    }

    const existing = await EventType.findOne({ type });
    if (!existing) {
      return Response.error(res, `Type "${type}" does not exist`, 400);
    }

    if (existing.count > 1) {
      existing.count -= 1;
      await existing.save();
      return Response.success(res, existing, 200);
    } else {
      const result = await EventType.deleteOne({ _id: existing._id });
      return Response.success(res, { message: `Type "${type}" removed`, result }, 200);
    }
  } catch (err) {
    return Response.error(res, `Failed to delete event type: ${err.message || err}`, 500);
  }
});


export default router;