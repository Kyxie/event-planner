import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import createError from 'http-errors'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import cors from 'cors'

// Controllers
import indexRouter from './controllers/index.js'
import eventRouter from './controllers/event.js'

// Loading .env
dotenv.config()

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

export default function createApp(PORT) {
  // Swagger
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Event Planner API',
      version: '1.0.0',
      description: 'API documentation for Event Planner backend',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  }

  const swaggerOptions = {
    swaggerDefinition,
    apis: ['./src/controllers/*.js'],
  }

  const swaggerSpec = swaggerJSDoc(swaggerOptions)

  const app = express()

  // Cors
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  )

  // Middleware
  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Controller
  app.use('/api', indexRouter)
  app.use('/api/events', eventRouter)

  // 404
  app.use((req, res, next) => {
    next(createError(404, 'Not Found'))
  })

  // Error
  app.use((err, req, res, next ) => {
    console.error('❌ Error:', err.message)
    res.status(err.status || 500).json({
      error: err.message,
      stack: req.app.get('env') === 'development' ? err.stack : undefined,
    })
  })

  return app
}
