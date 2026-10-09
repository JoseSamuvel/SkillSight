import express from 'express'
import { OCCUPATIONS } from '../data/mockData.js'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    let { sector, trend, nsqf_level, limit = 50 } = req.query
    let occupations = [...OCCUPATIONS]
    if (sector) occupations = occupations.filter(o => o.sector === sector)
    if (trend) occupations = occupations.filter(o => o.trend === trend)
    if (nsqf_level) occupations = occupations.filter(o => o.nsqf_level === +nsqf_level)
    res.json({ success: true, total: occupations.length, data: occupations.slice(0, +limit) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:id', (req, res) => {
  try {
    const occ = OCCUPATIONS.find(o => o.id === req.params.id || o.nco_code === req.params.id)
    if (!occ) return res.status(404).json({ success: false, error: 'Occupation not found' })
    res.json({ success: true, data: { ...occ, required_skills: ['Core Technical', 'Safety', 'Digital Literacy'], related_qualifications: ['QP/NOS v3.0', 'NSQF Level ' + occ.nsqf_level] } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
