import http from 'http'
import createApp from './app.js'

const PORT = process.env.PORT || 8000
const app = createApp(PORT)
const server = http.createServer(app)

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`)
})

server.on('error', (err) => {
  console.error('❌ Server error:', err)
})
