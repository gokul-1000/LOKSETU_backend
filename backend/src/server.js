import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Load environment variables
dotenv.config()

// Routes
import authRoutes from './routes/auth.js'
import complaintRoutes from './routes/complaints.js'
import departmentRoutes from './routes/departments.js'
import zoneRoutes from './routes/zones.js'
import analyticsRoutes from './routes/analytics.js'
import llmRoutes from './routes/llm.js'
import imageRoutes from './routes/images.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = process.env.PORT || 5000

// ────────────────────────────────────────────────────────────────
// MIDDLEWARE
// ────────────────────────────────────────────────────────────────

app.use(morgan('dev'))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// ────────────────────────────────────────────────────────────────
// ROUTES
// ────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LokSetu Backend' })
})

app.use('/api/auth', authRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/zones', zoneRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/llm', llmRoutes)
app.use('/api/images', imageRoutes)

// ────────────────────────────────────────────────────────────────
// ERROR HANDLING
// ────────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ────────────────────────────────────────────────────────────────
// START SERVER
// ────────────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`🚀 LokSetu Backend running on http://localhost:${port}`)
  console.log(`📊 LLM Backend: ${process.env.LLM_BACKEND_URL || 'http://localhost:8000'}`)
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})
