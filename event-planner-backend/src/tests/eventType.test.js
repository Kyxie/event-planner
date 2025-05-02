import request from 'supertest'
import express from 'express'
import router from '../controllers/eventType.js'
import mongoose from 'mongoose'
import EventType from '../models/EventType.js'

const app = express()
app.use(express.json())
app.use('/api/eventTypes', router)

jest.mock('../models/EventType.js')

describe('GET /api/eventTypes', () => {
  it('should return list of event types', async () => {
    const mockEventTypes = [
      { type: 'Dividends' },
      { type: 'Earnings Call' },
    ]

    const findMock = jest.fn().mockResolvedValue(mockEventTypes)
    mongoose.model('EventType').mockImplementation(() => ({
      find: findMock,
    }))

    const response = await request(app).get('/api/eventTypes')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(['Dividends', 'Earnings Call'])
  })

  it('should return filtered event types based on search query', async () => {
    const mockEventTypes = [{ type: 'Dividends' }]
    const findMock = jest.fn().mockResolvedValue(mockEventTypes)
    mongoose.model('EventType').mockImplementation(() => ({
      find: findMock,
    }))

    const response = await request(app).get('/api/eventTypes').query({ search: 'Div' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(['Dividends'])
  })

  it('should handle server error', async () => {
    const findMock = jest.fn().mockRejectedValue(new Error('Database error'))
    mongoose.model('EventType').mockImplementation(() => ({
      find: findMock,
    }))

    const response = await request(app).get('/api/eventTypes')

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to fetch event types: Database error')
  })
})

describe('POST /api/eventTypes', () => {
  it('should add or update event type successfully', async () => {
    const newType = { type: 'Webinar' }
    const mockEventType = { ...newType, count: 1 }

    const findOneAndUpdateMock = jest.fn().mockResolvedValue(mockEventType)
    mongoose.model('EventType').mockImplementation(() => ({
      findOneAndUpdate: findOneAndUpdateMock,
    }))

    const response = await request(app)
      .post('/api/eventTypes')
      .send(newType)

    expect(response.status).toBe(200)
    expect(response.body.type).toBe('Webinar')
    expect(response.body.count).toBe(1)
  })

  it('should return error if type is not provided', async () => {
    const response = await request(app).post('/api/eventTypes').send({})

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Type is required and must be a string')
  })

  it('should handle server error', async () => {
    const newType = { type: 'Webinar' }
    const findOneAndUpdateMock = jest.fn().mockRejectedValue(new Error('Database error'))
    mongoose.model('EventType').mockImplementation(() => ({
      findOneAndUpdate: findOneAndUpdateMock,
    }))

    const response = await request(app).post('/api/eventTypes').send(newType)

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to update/add event type: Database error')
  })
})

describe('DELETE /api/eventTypes', () => {
  it('should decrement count or remove event type successfully', async () => {
    const eventType = { type: 'Webinar', count: 2 }
    const mockEventType = { ...eventType, save: jest.fn().mockResolvedValue(eventType) }
    const findOneMock = jest.fn().mockResolvedValue(mockEventType)

    mongoose.model('EventType').mockImplementation(() => ({
      findOne: findOneMock,
      deleteOne: jest.fn().mockResolvedValue({}),
    }))

    const response = await request(app)
      .delete('/api/eventTypes')
      .send({ type: 'Webinar' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Type "Webinar" removed')
  })

  it('should return error if type does not exist', async () => {
    const findOneMock = jest.fn().mockResolvedValue(null)
    mongoose.model('EventType').mockImplementation(() => ({
      findOne: findOneMock,
    }))

    const response = await request(app)
      .delete('/api/eventTypes')
      .send({ type: 'NonExistentType' })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Type "NonExistentType" does not exist')
  })

  it('should handle server error', async () => {
    const findOneMock = jest.fn().mockRejectedValue(new Error('Database error'))
    mongoose.model('EventType').mockImplementation(() => ({
      findOne: findOneMock,
    }))

    const response = await request(app).delete('/api/eventTypes').send({ type: 'Webinar' })

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to delete event type: Database error')
  })
})
