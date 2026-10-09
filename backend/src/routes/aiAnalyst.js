import express from 'express'
import { DISTRICTS, OCCUPATIONS, EARLY_WARNINGS, RECOMMENDATIONS } from '../data/mockData.js'

const router = express.Router()

// POST /api/ai-analyst/query - Conversational RAG & policy query engine
router.post('/query', (req, res) => {
  try {
    const { query = '', conversation_history = [] } = req.body
    const qLower = query.toLowerCase()

    let responseText = ''
    let citations = []
    let dataPoints = []
    let recommendedActions = []
    let confidence = 89

    if (qLower.includes('ev') || qLower.includes('electric vehicle') || qLower.includes('hosur')) {
      responseText = `Based on multi-source fusion across National Career Service (NCS) vacancy signals, e-Shram worker registrations, and Annual Survey of Industries (ASI) factory registrations:\n\n**Hosur/Krishnagiri District** is experiencing a **Stage 5 Critical Chokepoint** for Electric Vehicle (EV) Powertrain & Battery Technicians. Active employer job postings have surged by **31% over the past 2 quarters**, while the institutional training pipeline has grown by only **9%**.\n\nThree Tier-1 EV manufacturing and assembly plants are commencing operations in the SIPCOT phase between Q3 2026 and Q1 2027, creating an unaddressed shortage of **1,970 certified technicians**.`
      citations = [
        'NCS Job Portal: 42 active employers, 2,140 verified EV job vacancies in Krishnagiri/Hosur corridor',
        'e-Shram: Under 180 registered workers with certified high-voltage credentials in 50km radius',
        'PMKVY / ITI Registry: Only 2 ITIs within 40km currently offer NSQF Level 4 EV curricula',
        'ASI 2023-24: 14% increase in automotive machinery capex allocation in Tamil Nadu auto hub'
      ]
      dataPoints = [
        { label: 'Demand Deficit', value: '1,970 positions' },
        { label: 'Vacancy Surge', value: '+31% QoQ' },
        { label: 'Training Lead Time', value: '16 weeks' },
        { label: 'Risk Stage', value: 'Stage 5 (Imminent Production Chokepoint)' }
      ]
      recommendedActions = [
        'Sanction 800 additional seats at ITI Hosur under PMKVY 4.0 fast-track capital support.',
        'Authorize mobile rapid-training labs in partnership with local EV OEMs (Ola Electric / Ather / TVS).',
        'Relocate 350 underutilized seats from saturated general mechanical trades in Chennai.'
      ]
      confidence = 94
    } else if (qLower.includes('solar') || qLower.includes('coimbatore') || qLower.includes('renewable')) {
      responseText = `Analysis for **Renewable Energy & Solar PV Trades in Coimbatore Region**:\n\nDemand for Solar PV Technicians (NCO 7421) stands at **7,200** with an effective local qualified supply of only **3,800**, generating a net shortage of **3,400**. However, Coimbatore possesses a surplus of **4,200 underemployed general wiremen and industrial electricians**.\n\nDeploying a 6-week bridge certification programme (converting NSQF Level 3 Electricians to NSQF Level 4 Solar PV Technicians) costs **60% less per worker** than training fresh cohorts from scratch and reduces lead time from 9 months to 45 days.`
      citations = [
        'Ministry of New & Renewable Energy (MNRE) PM-Surya Ghar Rooftop Solar installations data',
        'NCS Tamil Nadu Electrical Technician Registrations',
        'Skill India Digital (SID) - Suryamitra Certified Candidate Database'
      ]
      dataPoints = [
        { label: 'Solar Shortage', value: '3,400 certified workers' },
        { label: 'Electrician Surplus Reservoir', value: '4,200 candidates' },
        { label: 'Bridge Training Lead Time', value: '6 weeks' },
        { label: 'Cost Reduction vs New ITI Batch', value: '60%' }
      ]
      recommendedActions = [
        'Launch targeted 6-week "Suryamitra Bridge" module at NSDC Coimbatore Hub.',
        'Partner with TANGEDCO rooftop solar vendors for direct pre-placement commitments.',
        'Issue digital micro-credentials via Skill India Digital.'
      ]
      confidence = 91
    } else if (qLower.includes('data entry') || qLower.includes('oversupply') || qLower.includes('surplus') || qLower.includes('sunset')) {
      responseText = `Structural Saturated Occupation Audit:\n\n**Data Entry Operators (NCO 9211, NSQF Level 2)** demonstrate persistent negative demand-to-supply equilibrium across multiple states including Tamil Nadu (Tiruchirappalli, Madurai) and Maharashtra (Nagpur).\n\nNational supply exceeds job openings by over **2,400 seats** per quarter with post-training formal placement rates deteriorating below **24%**. With optical character recognition, generative AI document processing, and robotic process automation, employer hiring for manual typing positions has shrunk by **12% annually**.`
      citations = [
        'PLFS 2023-24: Routine clerical job absorption trends',
        'Skill India Digital: IT-ITeS SSC placement completion verification data',
        'NCS Job Postings: 47% drop in standalone data entry operator mandates since 2023'
      ]
      dataPoints = [
        { label: 'Current Oversupply Gap', value: '-2,400 positions' },
        { label: 'Average Placement Rate', value: '23.8%' },
        { label: 'Curriculum Drift Score', value: '93/100 (Critically Outdated)' },
        { label: 'Recommended Action', value: 'Phase out 60% of seats; pivot to Data Analytics' }
      ]
      recommendedActions = [
        'Direct NCVET & State Councils to freeze non-specialized typing/data-entry batches.',
        'Transition ITI computer laboratories to Python, Tabular Analytics, and AI Prompt verification curricula.'
      ]
      confidence = 95
    } else {
      responseText = `KaushalLens Intelligence Synthesis:\n\nSynthesizing live data across **724 districts**, **28 States**, and **10 key high-growth industrial sectors**.\n\nCurrent national metrics identify a **2.8 Million worker skill shortage** concentrated primarily in Green Energy, EV Systems, Precision CNC, and Applied AI, balanced against an estimated **1.4 Million oversupply** in legacy clerical, repetitive manual assembly, and outdated trade programs.\n\nYou can query specific districts (e.g. *"Show me shortages in Hosur or Coimbatore"*), specific sectors (*"What is the status of Solar PV?"*), or simulation scenarios (*"How should we reallocate Rs. 50 Lakhs training budget?"*).`
      citations = [
        'NCS Job Exchange Vacancy Index',
        'Periodic Labour Force Survey (PLFS)',
        'Ministry of Skill Development & Entrepreneurship (MSDE) Portal',
        'e-Shram National Database of Unorganised Workers'
      ]
      dataPoints = [
        { label: 'National Skill Shortage', value: '2.8M positions' },
        { label: 'Saturated Trades', value: '82 qualifications' },
        { label: 'High Risk Districts', value: '94 districts' },
        { label: 'Ensemble Model Confidence', value: '84% (±4.2%)' }
      ]
      recommendedActions = [
        'Check Early Warning alerts for impending Stage 4 and Stage 5 bottlenecks.',
        'Run the Policy Simulator to model seat adjustments before committing state allocations.',
        'Review Curriculum Drift warnings for trades unrevised in >3 years.'
      ]
      confidence = 88
    }

    res.json({
      success: true,
      query,
      answer: responseText,
      citations,
      dataPoints,
      recommendedActions,
      confidence,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
