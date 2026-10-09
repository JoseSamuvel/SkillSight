import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import dotenv from 'dotenv'

// Routes
import districtsRouter from './routes/districts.js'
import occupationsRouter from './routes/occupations.js'
import skillGapsRouter from './routes/skillGaps.js'
import forecastRouter from './routes/forecast.js'
import recommendationsRouter from './routes/recommendations.js'
import trainingRouter from './routes/training.js'
import earlyWarningRouter from './routes/earlyWarning.js'
import analyticsRouter from './routes/analytics.js'
import simulatorRouter from './routes/simulator.js'
import aiAnalystRouter from './routes/aiAnalyst.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ─── Security & Middleware ────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(compression())
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/districts', districtsRouter)
app.use('/api/occupations', occupationsRouter)
app.use('/api/skill-gaps', skillGapsRouter)
app.use('/api/forecast', forecastRouter)
app.use('/api/recommendations', recommendationsRouter)
app.use('/api/training', trainingRouter)
app.use('/api/early-warning', earlyWarningRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/simulator', simulatorRouter)
app.use('/api/ai-analyst', aiAnalystRouter)

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'SkillSight Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// ─── API Info ─────────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    name: 'SkillSight API',
    version: '2.0.0',
    description: 'Labour Market Intelligence & Skill Demand-Supply Forecasting Engine',
    endpoints: {
      districts: 'GET /api/districts',
      occupations: 'GET /api/occupations',
      skillGaps: 'GET /api/skill-gaps',
      forecast: 'GET /api/forecast',
      recommendations: 'GET /api/recommendations',
      training: 'GET /api/training',
      earlyWarning: 'GET /api/early-warning',
      analytics: 'GET /api/analytics/national',
      simulator: 'POST /api/simulator/run',
      aiAnalyst: 'POST /api/ai-analyst/query',
    },
    dataSources: ['NCS', 'PLFS', 'e-Shram', 'ASI', 'Skill India Digital', 'NCO', 'NQR'],
  })
})

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  })
})

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.url} not found` })
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 SkillSight Backend running on port ${PORT}`)
  console.log(`📊 API: http://localhost:${PORT}/api`)
  console.log(`🏥 Health: http://localhost:${PORT}/health\n`)
})

export default app
