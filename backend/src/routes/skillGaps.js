import express from 'express'
import { SKILL_GAPS, OCCUPATIONS } from '../data/mockData.js'

const router = express.Router()

// GET /api/skill-gaps
router.get('/', (req, res) => {
  try {
    let { risk_level, sector, sort = 'gap_desc', limit = 50 } = req.query
    let gaps = [...SKILL_GAPS]

    if (risk_level) gaps = gaps.filter(g => g.risk_level === risk_level)
    if (sector) gaps = gaps.filter(g => g.sector === sector)

    if (sort === 'gap_desc') gaps.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    if (sort === 'gap_asc') gaps.sort((a, b) => a.gap - b.gap)
    if (sort === 'confidence') gaps.sort((a, b) => b.confidence - a.confidence)

    const summary = {
      total_shortage: gaps.filter(g => g.gap > 0).reduce((s, g) => s + g.gap, 0),
      total_surplus: Math.abs(gaps.filter(g => g.gap < 0).reduce((s, g) => s + g.gap, 0)),
      critical: gaps.filter(g => g.risk_level === 'CRITICAL').length,
      high: gaps.filter(g => g.risk_level === 'HIGH').length,
      balanced: gaps.filter(g => g.risk_level === 'BALANCED').length,
      oversupply: gaps.filter(g => g.risk_level === 'OVERSUPPLY').length,
    }

    res.json({ success: true, total: gaps.length, summary, data: gaps.slice(0, +limit) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/skill-gaps/district/:districtId
router.get('/district/:districtId', (req, res) => {
  try {
    const gaps = SKILL_GAPS.map(g => ({
      ...g,
      district_id: req.params.districtId,
      district_adjusted_gap: Math.round(g.gap * (0.7 + Math.random() * 0.6)),
    }))
    res.json({ success: true, district_id: req.params.districtId, data: gaps })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
