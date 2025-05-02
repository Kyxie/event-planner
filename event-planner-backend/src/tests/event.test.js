import request from 'supertest'
import express from 'express'
import router from '../controllers/event.js'
import mongoose from 'mongoose'
import Event from '../models/Event.js'

const app = express()
app.use(express.json())
app.use('/api/events', router)

// Mock Event model before each test
jest.mock('../models/Event.js')

describe('POST /api/events', () => {
  it('should create an event successfully', async () => {
    const newEvent = {
      title: 'Q1 Earnings Call',
      type: 'Dividends',
      start: '2025-04-15T09:00:00Z',
      end: '2025-04-15T10:00:00Z',
      priority: 1,
    }

    const mockEvent = { ...newEvent, _id: '12345' }
    Event.mockImplementationOnce(() => ({
      save: jest.fn().mockResolvedValue(mockEvent),
    }))

    const response = await request(app)
      .post('/api/events')
      .send(newEvent)

    expect(response.status).toBe(201)
    expect(response.body.title).toBe(newEvent.title)
    expect(response.body._id).toBe(mockEvent._id)
  })

  it('should return error when required fields are missing', async () => {
    const incompleteEvent = {
      title: 'Q1 Earnings Call',
      type: 'Dividends',
    }

    const response = await request(app)
      .post('/api/events')
      .send(incompleteEvent)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Missing required fields')
  })

  it('should return error for invalid date format', async () => {
    const invalidEvent = {
      title: 'Q1 Earnings Call',
      type: 'Dividends',
      start: 'invalid-date',
      end: '2025-04-15T10:00:00Z',
    }

    const response = await request(app)
      .post('/api/events')
      .send(invalidEvent)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Invalid date format')
  })

  it('should return error when start date is after end date', async () => {
    const invalidEvent = {
      title: 'Q1 Earnings Call',
      type: 'Dividends',
      start: '2025-04-15T11:00:00Z',
      end: '2025-04-15T10:00:00Z',
    }

    const response = await request(app)
      .post('/api/events')
      .send(invalidEvent)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Start date must be before end date')
  })
})

describe('GET /api/events', () => {
  it('should return events in a date range', async () => {
    const mockEvents = [
      { _id: '1', title: 'Q1 Earnings Call', start: '2025-04-15T09:00:00Z', end: '2025-04-15T10:00:00Z', priority: 1 },
      { _id: '2', title: 'Q2 Earnings Call', start: '2025-04-16T09:00:00Z', end: '2025-04-16T10:00:00Z', priority: 2 },
    ]

    Event.mockImplementationOnce(() => ({
      find: jest.fn().mockResolvedValue(mockEvents),
    }))

    const response = await request(app)
      .get('/api/events')
      .query({ startDate: '2025-04-14', endDate: '2025-04-17' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
  })
})
