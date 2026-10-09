import express from 'express'
import { EARLY_WARNINGS } from '../data/mockData.js'

const router = express.Router()

// GET /api/early-warning - List warnings
router.get('/', (req, res) => {
  try {
    let { severity, stage, district } = req.query
    let warnings = [...EARLY_WARNINGS]

    if (severity) {
      warnings = warnings.filter(w => w.severity.toLowerCase() === severity.toLowerCase())
    }
    if (stage) {
      warnings = warnings.filter(w => w.stage === +stage)
    }
    if (district) {
      warnings = warnings.filter(w => w.district.toLowerCase().includes(district.toLowerCase()))
    }

    res.json({
      success: true,
      total: warnings.length,
      data: warnings,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/early-warning/stats - Summary metrics
router.get('/stats', (req, res) => {
  try {
    const critical = EARLY_WARNINGS.filter(w => w.severity === 'CRITICAL').length
    const high = EARLY_WARNINGS.filter(w => w.severity === 'HIGH').length
    const medium = EARLY_WARNINGS.filter(w => w.severity === 'MEDIUM').length
    const low = EARLY_WARNINGS.filter(w => w.severity === 'LOW').length

    res.json({
      success: true,
      data: {
        total_active_alerts: EARLY_WARNINGS.length,
        critical_count: critical,
        high_count: high,
        medium_count: medium,
        low_count: low,
        avg_lead_time_days: 58,
        districts_affected: [...new Set(EARLY_WARNINGS.map(w => w.district))].length,
        system_confidence_score: 91.4,
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/early-warning/:id/acknowledge
router.post('/:id/acknowledge', (req, res) => {
  try {
    const warning = EARLY_WARNINGS.find(w => w.id === req.params.id)
    if (!warning) return res.status(404).json({ success: false, error: 'Warning not found' })

    const { notes, action_taken } = req.body
    res.json({
      success: true,
      message: `Alert ${req.params.id} successfully acknowledged.`,
      alert: {
        ...warning,
        status: 'ACKNOWLEDGED',
        acknowledged_at: new Date().toISOString(),
        notes: notes || 'Assigned to State Skill Development Mission for dispatch review.',
        action_taken: action_taken || 'Escalation to district skill coordinator.'
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/early-warning/:id
router.get('/:id', (req, res) => {
  try {
    const warning = EARLY_WARNINGS.find(w => w.id === req.params.id)
    if (!warning) return res.status(404).json({ success: false, error: 'Warning not found' })

    res.json({
      success: true,
      data: {
        ...warning,
        stages: [
          { stage: 1, name: 'Signal Detection', status: 'COMPLETED', date: '30 days ago' },
          { stage: 2, name: 'Cross-Source Corroboration', status: 'COMPLETED', date: '21 days ago' },
          { stage: 3, name: 'Deficit Velocity Acceleration', status: 'COMPLETED', date: '10 days ago' },
          { stage: 4, name: 'Lead Time Threshold Breached', status: warning.stage >= 4 ? 'ACTIVE' : 'PENDING' },
          { stage: 5, name: 'Imminent Production Chokepoint', status: warning.stage >= 5 ? 'CRITICAL_ALERT' : 'PENDING' },
        ],
        data_sources: ['NCS Vacancy Scrapes', 'PMKVY Enrollment Cohort', 'PLFS 2024 Survey', 'EPFO Net Additions']
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
