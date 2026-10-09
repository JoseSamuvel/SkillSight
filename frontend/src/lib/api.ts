// SkillSight Unified API Client
// Talks to backend Express API (/api/...) with seamless mockData fallbacks

import {
  mockDistricts,
  mockOccupations,
  mockNationalStats,
  mockForecastData,
  mockEarlyWarnings} from './mockData'

const API_BASE = '/api'

export const api = {
  // Districts
  async getDistricts(state?: string) {
    try {
      const url = state ? `${API_BASE}/districts?state=${encodeURIComponent(state)}` : `${API_BASE}/districts`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      return json.data
    } catch {
      return state ? mockDistricts.filter(d => d.state === state) : mockDistricts
    }
  },

  async getDistrict(id: string) {
    try {
      const res = await fetch(`${API_BASE}/districts/${id}`)
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      return json.data
    } catch {
      return mockDistricts.find(d => d.id === id) || mockDistricts[0]
    }
  },

  // Occupations & Skill Gaps
  async getOccupations(sector?: string) {
    try {
      const url = sector ? `${API_BASE}/occupations?sector=${encodeURIComponent(sector)}` : `${API_BASE}/occupations`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      return json.data
    } catch {
      return sector ? mockOccupations.filter(o => o.sector === sector) : mockOccupations
    }
  },

  async getSkillGaps(sector?: string) {
    try {
      const url = sector ? `${API_BASE}/skill-gaps?sector=${encodeURIComponent(sector)}` : `${API_BASE}/skill-gaps`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      return json.data
    } catch {
      return mockOccupations.map(o => ({
        occupation_id: o.id,
        occupation: o.title,
        sector: o.sector,
        gap: o.gap,
        demand: o.demand,
        effective_supply: o.supply,
        confidence: o.confidence,
        risk_level: o.gap > 3000 ? 'CRITICAL' : o.gap > 1500 ? 'HIGH' : o.gap > 0 ? 'MEDIUM' : 'OVERSUPPLY',
        trend: o.trend,
      }))
    }
  },

  // Forecast
  async getForecast(occupationId?: string, horizon = '4Q') {
    try {
      const res = await fetch(`${API_BASE}/forecast?horizon=${horizon}`)
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      return json.data
    } catch {
      return mockForecastData
    }
  },

  // Early Warnings
  async getEarlyWarnings() {
    try {
      const res = await fetch(`${API_BASE}/early-warning`)
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      return json.data
    } catch {
      return mockEarlyWarnings
    }
  },

  // National Stats
  async getNationalStats() {
    try {
      const res = await fetch(`${API_BASE}/analytics/national`)
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      return json.data
    } catch {
      return mockNationalStats
    }
  },

  // Policy Simulator
  async runSimulation(params: { evSeats: number; solarSeats: number; relocateCount: number; reskillBudget: number }) {
    try {
      const res = await fetch(`${API_BASE}/simulator/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      return json.results
    } catch {
      // Fallback calculation
      const totalCost = params.evSeats * 3200 + params.solarSeats * 2100 + params.relocateCount * 950 + params.reskillBudget
      const totalAdded = params.evSeats + params.solarSeats + params.relocateCount + Math.floor(params.reskillBudget / 1600)
      return {
        total_investment_inr: totalCost,
        total_capacity_added: totalAdded,
        estimated_placements: Math.round(totalAdded * 0.81),
        net_gap_reduction_percent: Math.min(100, Math.round((totalAdded / 14200) * 100)),
        roi_multiplier: '4.8x',
        radar_metrics: [
          { subject: 'Speed to Impact', value: 78 },
          { subject: 'Fiscal Efficiency', value: 85 },
          { subject: 'Industry Synergy', value: 92 },
          { subject: 'Sustainability', value: 80 },
          { subject: 'District Equity', value: 74 },
        ]
      }
    }
  },

  // AI Analyst Query
  async queryAI(query: string, conversationHistory = []) {
    try {
      const res = await fetch(`${API_BASE}/ai-analyst/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, conversation_history: conversationHistory }),
      })
      if (!res.ok) throw new Error('Network error')
      return await res.json()
    } catch {
      return null
    }
  }
}
