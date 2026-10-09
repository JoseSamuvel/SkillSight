import express from 'express'
import { DISTRICTS } from '../data/mockData.js'

const router = express.Router()

// GET /api/districts - List all districts with optional filters
router.get('/', (req, res) => {
  try {
    let { state, risk, limit = 50, offset = 0 } = req.query
    let districts = [...DISTRICTS]

    if (state) districts = districts.filter(d => d.state === state)
    
    const total = districts.length
    districts = districts.slice(+offset, +offset + +limit)

    res.json({
      success: true,
      total,
      limit: +limit,
      offset: +offset,
      data: districts,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/districts/:id - Get specific district with full intelligence
router.get('/:id', (req, res) => {
  try {
    const district = DISTRICTS.find(d => d.id === req.params.id || d.name === req.params.id)
    if (!district) return res.status(404).json({ success: false, error: 'District not found' })

    res.json({
      success: true,
      data: {
        ...district,
        labour_market_health: Math.floor(Math.random() * 30) + 60,
        demand_growth_qoq: Math.floor(Math.random() * 25) + 8,
        supply_growth_qoq: Math.floor(Math.random() * 15) + 5,
        risk_level: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)],
        top_shortage_occupations: ['Solar PV Technician', 'EV Technician', 'CNC Operator'],
        top_surplus_occupations: ['Data Entry Operator'],
        data_quality_score: Math.floor(Math.random() * 20) + 75,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
