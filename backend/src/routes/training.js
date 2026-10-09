import express from 'express'
import { TRAINING_CENTRES, DISTRICTS, OCCUPATIONS } from '../data/mockData.js'

const router = express.Router()

// GET /api/training - List training centres
router.get('/', (req, res) => {
  try {
    let { district_id, sector, min_utilization, limit = 50 } = req.query
    let centres = [...TRAINING_CENTRES]

    if (district_id) {
      centres = centres.filter(c => c.district_id === district_id || c.district.toLowerCase() === district_id.toLowerCase())
    }
    if (sector) {
      centres = centres.filter(c => c.sectors.some(s => s.toLowerCase().includes(sector.toLowerCase())))
    }
    if (min_utilization) {
      centres = centres.filter(c => c.utilization_rate >= +min_utilization)
    }

    res.json({
      success: true,
      total: centres.length,
      data: centres.slice(0, +limit),
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/training/optimizer - Get optimization recommendations
router.get('/optimizer', (req, res) => {
  try {
    const recommendations = [
      {
        id: 'opt-1',
        centre_id: 'tc3',
        centre_name: 'ITI Hosur',
        district: 'Hosur',
        action: 'EXPAND',
        sector: 'Automotive / EV',
        seat_change: +400,
        current_capacity: 600,
        proposed_capacity: 1000,
        capex_estimate_inr: 1200000,
        projected_placement_rate: 88,
        roi_ratio: '3.4x',
        priority: 'CRITICAL',
        rationale: 'Severe EV technician shortage in Hosur auto cluster; current 98% utilization.'
      },
      {
        id: 'opt-2',
        centre_id: 'tc1',
        centre_name: 'NSDC Coimbatore Hub',
        district: 'Coimbatore',
        action: 'CONVERT_PROGRAM',
        sector: 'Renewable Energy / Solar PV',
        seat_change: +250,
        current_capacity: 1200,
        proposed_capacity: 1200,
        capex_estimate_inr: 600000,
        projected_placement_rate: 85,
        roi_ratio: '4.1x',
        priority: 'HIGH',
        rationale: 'Repurpose low-placement traditional trades into Solar PV installer certifications.'
      },
      {
        id: 'opt-3',
        centre_id: 'tc2',
        centre_name: 'Skill India Chennai Centre',
        district: 'Chennai',
        action: 'RIGHT_SIZE',
        sector: 'IT / Operations (Data Entry)',
        seat_change: -600,
        current_capacity: 2400,
        proposed_capacity: 1800,
        capex_estimate_inr: 0,
        projected_placement_rate: 76,
        roi_ratio: '2.2x',
        priority: 'MEDIUM',
        rationale: 'Overcapacity in saturated generic office roles; reallocate funding to emergent skills.'
      }
    ]

    res.json({
      success: true,
      summary: {
        total_seats_reallocated: 1250,
        net_budget_required_inr: 1800000,
        projected_avg_placement_boost_percent: 14.5,
      },
      data: recommendations,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/training/optimize - Simulate dynamic training reallocation
router.post('/optimize', (req, res) => {
  try {
    const { budget = 5000000, target_sectors = [], priority_districts = [] } = req.body

    const calculated_seats = Math.floor(budget / 3500)
    const expected_jobs = Math.floor(calculated_seats * 0.78)
    const annual_economic_benefit = expected_jobs * 220000

    res.json({
      success: true,
      simulation: {
        budget_allocated: budget,
        seats_created_or_shifted: calculated_seats,
        estimated_placements: expected_jobs,
        economic_impact_inr: annual_economic_benefit,
        payback_period_months: 6.2,
        target_sectors: target_sectors.length > 0 ? target_sectors : ['Renewable Energy', 'EV Mobility', 'Advanced Manufacturing'],
        priority_districts: priority_districts.length > 0 ? priority_districts : ['Hosur', 'Coimbatore', 'Bengaluru'],
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/training/:id - Get specific centre
router.get('/:id', (req, res) => {
  try {
    const centre = TRAINING_CENTRES.find(c => c.id === req.params.id)
    if (!centre) return res.status(404).json({ success: false, error: 'Training centre not found' })

    res.json({ success: true, data: centre })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
