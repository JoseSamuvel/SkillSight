import express from 'express'
import { NATIONAL_STATS, OCCUPATIONS, DISTRICTS } from '../data/mockData.js'

const router = express.Router()

// GET /api/analytics/national - Macro national indicators
router.get('/national', (req, res) => {
  try {
    res.json({
      success: true,
      data: NATIONAL_STATS,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/analytics/sectors - Sectoral distribution of demand, supply and gaps
router.get('/sectors', (req, res) => {
  try {
    const sectorMap = {}

    OCCUPATIONS.forEach(occ => {
      if (!sectorMap[occ.sector]) {
        sectorMap[occ.sector] = {
          sector: occ.sector,
          total_demand: 0,
          total_supply: 0,
          total_gap: 0,
          occupations_count: 0,
          avg_confidence: 0,
          confidence_sum: 0,
        }
      }
      const s = sectorMap[occ.sector]
      s.total_demand += occ.demand
      s.total_supply += occ.supply
      s.total_gap += occ.gap
      s.occupations_count += 1
      s.confidence_sum += occ.confidence
    })

    const sectorBreakdown = Object.values(sectorMap).map(s => ({
      ...s,
      avg_confidence: Math.round(s.confidence_sum / s.occupations_count),
      status: s.total_gap > 2000 ? 'SEVERE_SHORTAGE' : s.total_gap > 0 ? 'MODERATE_SHORTAGE' : 'SURPLUS',
    }))

    res.json({
      success: true,
      total_sectors: sectorBreakdown.length,
      data: sectorBreakdown,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/analytics/curriculum-drift - Qualification drift and NCVET misalignment
router.get('/curriculum-drift', (req, res) => {
  try {
    const driftData = [
      {
        qp_code: 'ELE/Q5901',
        title: 'Solar PV Installer (Suryamitra)',
        current_nsqf: 4,
        drift_score: 74,
        urgency: 'HIGH',
        last_updated: '2021-08-14',
        missing_skills: ['Microinverter Setup', 'LiFePO4 Storage Interfacing', 'IoT Telemetry Diagnostics', 'Bifacial Panel Mounting'],
        redundant_skills: ['Lead-acid Hydrometer Testing', 'Manual Inverter Synchronisation'],
        employers_reporting_gap_pct: 82,
        status: 'NCVET_REVIEW_PENDING'
      },
      {
        qp_code: 'ASC/Q1402',
        title: 'Automotive Electrician (EV Focus)',
        current_nsqf: 4,
        drift_score: 86,
        urgency: 'CRITICAL',
        last_updated: '2020-03-10',
        missing_skills: ['800V High Voltage Safety ISO 6469', 'CAN Bus Decoding', 'Thermal Runaway Containment', 'Battery Management System (BMS) Calibration'],
        redundant_skills: ['Carburetor Tuning', 'Lead Acid Battery Desulfation'],
        employers_reporting_gap_pct: 91,
        status: 'FLAGGED'
      },
      {
        qp_code: 'CSC/Q0201',
        title: 'CNC Operator Turning',
        current_nsqf: 4,
        drift_score: 52,
        urgency: 'MEDIUM',
        last_updated: '2022-11-20',
        missing_skills: ['Additive Hybrid Machining', 'Digital Twin G-Code Simulation', 'Automated CMM Quality Checks'],
        redundant_skills: ['Manual Vernier Only Calibration'],
        employers_reporting_gap_pct: 64,
        status: 'MONITORING'
      },
      {
        qp_code: 'SSC/Q0508',
        title: 'Data Entry Operator',
        current_nsqf: 2,
        drift_score: 93,
        urgency: 'CRITICAL',
        last_updated: '2019-06-18',
        missing_skills: ['LLM Prompt Engineering', 'Document AI Validation', 'Tabular Automation Scripts'],
        redundant_skills: ['Typing Speed Drill 30WPM', 'Physical Paper Filing System'],
        employers_reporting_gap_pct: 94,
        status: 'SUNSET_RECOMMENDED'
      }
    ]

    res.json({
      success: true,
      total_courses_audited: 310,
      courses_with_high_drift: 48,
      data: driftData,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
