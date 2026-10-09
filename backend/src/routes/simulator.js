import express from 'express'

const router = express.Router()

// POST /api/simulator/run - Run dynamic policy scenario simulation
router.post('/run', (req, res) => {
  try {
    const {
      evSeats = 800,
      solarSeats = 1200,
      relocateCount = 350,
      reskillBudget = 2500000,
    } = req.body

    // Dynamic policy calculus
    const costPerEvSeat = 3200
    const costPerSolarSeat = 2100
    const costPerRelocationSeat = 950

    const evCost = evSeats * costPerEvSeat
    const solarCost = solarSeats * costPerSolarSeat
    const relocateCost = relocateCount * costPerRelocationSeat
    const reskilledWorkers = Math.floor(reskillBudget / 1600)

    const totalCost = evCost + solarCost + relocateCost + reskillBudget
    const totalNewSupply = evSeats + solarSeats + relocateCount + reskilledWorkers

    // Baseline shortage: 2,800,000 national / ~15,000 across targeted high-risk zones
    const targetClusterShortage = 14200
    const netGapRemaining = Math.max(0, targetClusterShortage - Math.floor(totalNewSupply * 0.88))
    const gapReductionPercent = Math.min(100, Math.round(((targetClusterShortage - netGapRemaining) / targetClusterShortage) * 100))

    const placementRate = 0.81
    const placedWorkers = Math.round(totalNewSupply * placementRate)
    const avgStartingWageINR = 240000 // Rs. 20,000 / month
    const annualGdpContribution = placedWorkers * avgStartingWageINR
    const fiscalRoiRatio = (annualGdpContribution / (totalCost || 1)).toFixed(2)

    // Radar metrics for policy trade-offs (0 - 100)
    const radarMetrics = [
      { subject: 'Speed to Impact', value: Math.min(95, Math.round(60 + (reskillBudget / 500000) * 4)) },
      { subject: 'Fiscal Efficiency', value: Math.min(98, Math.round(55 + (+fiscalRoiRatio * 3))) },
      { subject: 'Industry Synergy', value: Math.min(96, Math.round(70 + (evSeats / 200) * 3)) },
      { subject: 'Long-term Sustainability', value: Math.min(92, Math.round(65 + (solarSeats / 300) * 2)) },
      { subject: 'District Equity', value: Math.min(90, Math.round(50 + (relocateCount / 100) * 6)) },
    ]

    res.json({
      success: true,
      parameters: { evSeats, solarSeats, relocateCount, reskillBudget },
      results: {
        total_investment_inr: totalCost,
        total_capacity_added: totalNewSupply,
        estimated_placements: placedWorkers,
        net_gap_reduction_percent: gapReductionPercent,
        gap_units_closed: targetClusterShortage - netGapRemaining,
        roi_multiplier: `${fiscalRoiRatio}x`,
        annual_economic_value_inr: annualGdpContribution,
        payback_period_months: (+totalCost / (annualGdpContribution / 12)).toFixed(1),
        radar_metrics: radarMetrics,
        district_impact: [
          { district: 'Hosur / Krishnagiri', ev_gap_before: 1970, ev_gap_after: Math.max(0, 1970 - evSeats), status: evSeats >= 1500 ? 'RESOLVED' : 'PARTIALLY_MITIGATED' },
          { district: 'Coimbatore', solar_gap_before: 2840, solar_gap_after: Math.max(0, 2840 - Math.round(solarSeats * 0.65)), status: solarSeats >= 2000 ? 'RESOLVED' : 'PARTIALLY_MITIGATED' },
          { district: 'Chennai', underutilized_seats_freed: relocateCount, reallocation_efficiency: '92%' },
        ]
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
