import express from 'express'
import { RECOMMENDATIONS } from '../data/mockData.js'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    let { type, priority, status, district_id, limit = 20 } = req.query
    let recs = [...RECOMMENDATIONS]
    if (type) recs = recs.filter(r => r.type === type)
    if (priority) recs = recs.filter(r => r.priority === priority)
    if (status) recs = recs.filter(r => r.status === status)
    if (district_id) recs = recs.filter(r => r.district_id === district_id)
    recs.sort((a, b) => b.impact_score - a.impact_score)
    res.json({ success: true, total: recs.length, data: recs.slice(0, +limit) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:id', (req, res) => {
  const rec = RECOMMENDATIONS.find(r => r.id === req.params.id)
  if (!rec) return res.status(404).json({ success: false, error: 'Recommendation not found' })
  res.json({ success: true, data: rec })
})

router.put('/:id/status', (req, res) => {
  const { status, reviewer_notes } = req.body
  const rec = RECOMMENDATIONS.find(r => r.id === req.params.id)
  if (!rec) return res.status(404).json({ success: false, error: 'Not found' })
  rec.status = status
  res.json({ success: true, message: `Status updated to ${status}`, data: { ...rec, reviewer_notes, updated_at: new Date().toISOString() } })
})

export default router
