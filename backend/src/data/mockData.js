// Mock data service for SkillSight Backend
// In production, this connects to Supabase PostgreSQL

export const DISTRICTS = [
  { id: 'd1', name: 'Coimbatore', state: 'Tamil Nadu', state_code: 'TN', district_code: 'TN001', lat: 11.0168, lng: 76.9558, population: 3458045, workforce: 850000 },
  { id: 'd2', name: 'Chennai', state: 'Tamil Nadu', state_code: 'TN', district_code: 'TN002', lat: 13.0827, lng: 80.2707, population: 7088000, workforce: 2200000 },
  { id: 'd3', name: 'Hosur', state: 'Tamil Nadu', state_code: 'TN', district_code: 'TN003', lat: 12.7409, lng: 77.8253, population: 720000, workforce: 320000 },
  { id: 'd4', name: 'Madurai', state: 'Tamil Nadu', state_code: 'TN', district_code: 'TN004', lat: 9.9252, lng: 78.1198, population: 1463400, workforce: 680000 },
  { id: 'd5', name: 'Tiruchirappalli', state: 'Tamil Nadu', state_code: 'TN', district_code: 'TN005', lat: 10.7905, lng: 78.7047, population: 1021717, workforce: 420000 },
  { id: 'd6', name: 'Tirunelveli', state: 'Tamil Nadu', state_code: 'TN', district_code: 'TN006', lat: 8.7139, lng: 77.7567, population: 680200, workforce: 290000 },
  { id: 'd7', name: 'Bengaluru', state: 'Karnataka', state_code: 'KA', district_code: 'KA001', lat: 12.9716, lng: 77.5946, population: 8443675, workforce: 3100000 },
  { id: 'd8', name: 'Mysuru', state: 'Karnataka', state_code: 'KA', district_code: 'KA002', lat: 12.2958, lng: 76.6394, population: 1100000, workforce: 430000 },
  { id: 'd9', name: 'Pune', state: 'Maharashtra', state_code: 'MH', district_code: 'MH001', lat: 18.5204, lng: 73.8567, population: 3124458, workforce: 1800000 },
  { id: 'd10', name: 'Mumbai', state: 'Maharashtra', state_code: 'MH', district_code: 'MH002', lat: 19.0760, lng: 72.8777, population: 12442373, workforce: 4200000 },
  { id: 'd11', name: 'Nagpur', state: 'Maharashtra', state_code: 'MH', district_code: 'MH003', lat: 21.1458, lng: 79.0882, population: 2405421, workforce: 680000 },
  { id: 'd12', name: 'Salem', state: 'Tamil Nadu', state_code: 'TN', district_code: 'TN007', lat: 11.6643, lng: 78.1460, population: 836973, workforce: 380000 },
]

export const OCCUPATIONS = [
  { id: 'o1', nco_code: '7421', title: 'Solar PV Technician', sector: 'Renewable Energy', sub_sector: 'Solar', nsqf_level: 4, demand: 7200, supply: 3800, gap: 3400, trend: 'RISING', confidence: 88 },
  { id: 'o2', nco_code: '7231', title: 'EV Technician', sector: 'Automotive', sub_sector: 'Electric Vehicles', nsqf_level: 4, demand: 6500, supply: 2900, gap: 3600, trend: 'RISING', confidence: 91 },
  { id: 'o3', nco_code: '7412', title: 'Industrial Electrician', sector: 'Manufacturing', sub_sector: 'Electrical', nsqf_level: 5, demand: 5800, supply: 3200, gap: 2600, trend: 'STABLE', confidence: 84 },
  { id: 'o4', nco_code: '7223', title: 'CNC Machine Operator', sector: 'Manufacturing', sub_sector: 'Precision Engineering', nsqf_level: 4, demand: 4900, supply: 2100, gap: 2800, trend: 'RISING', confidence: 82 },
  { id: 'o5', nco_code: '2151', title: 'AI/ML Engineer', sector: 'IT/Digital', sub_sector: 'Artificial Intelligence', nsqf_level: 7, demand: 8200, supply: 4100, gap: 4100, trend: 'SURGING', confidence: 79 },
  { id: 'o6', nco_code: '3511', title: 'Data Analyst', sector: 'IT/Digital', sub_sector: 'Data Science', nsqf_level: 6, demand: 6800, supply: 4200, gap: 2600, trend: 'RISING', confidence: 86 },
  { id: 'o7', nco_code: '7111', title: 'Welder', sector: 'Manufacturing', sub_sector: 'Metal Fabrication', nsqf_level: 3, demand: 3200, supply: 3800, gap: -600, trend: 'STABLE', confidence: 89 },
  { id: 'o8', nco_code: '9211', title: 'Data Entry Operator', sector: 'IT/Digital', sub_sector: 'Operations', nsqf_level: 2, demand: 1800, supply: 4200, gap: -2400, trend: 'DECLINING', confidence: 92 },
  { id: 'o9', nco_code: '7422', title: 'Wind Turbine Technician', sector: 'Renewable Energy', sub_sector: 'Wind', nsqf_level: 4, demand: 3100, supply: 1200, gap: 1900, trend: 'RISING', confidence: 76 },
  { id: 'o10', nco_code: '7521', title: 'Food Processing Operator', sector: 'Food & Agriculture', sub_sector: 'Processing', nsqf_level: 3, demand: 4200, supply: 3100, gap: 1100, trend: 'STABLE', confidence: 83 },
]

export const NATIONAL_STATS = {
  total_skill_shortage: 2800000,
  total_oversupply: 1400000,
  emerging_skills: 137,
  saturated_occupations: 82,
  high_risk_districts: 94,
  training_centres: 14200,
  active_learners: 890000,
  avg_placement_rate: 68,
  avg_confidence: 84,
  states_monitored: 28,
  districts_analyzed: 724,
  data_sources: ['NCS', 'PLFS', 'e-Shram', 'ASI', 'Skill India Digital'],
  last_updated: new Date().toISOString(),
}

export const FORECAST_DATA = Array.from({ length: 12 }, (_, i) => {
  const baseQ = i % 4 + 1
  const year = 2025 + Math.floor(i / 4)
  const isForecast = i >= 8
  const base = 42000 + i * 4000
  return {
    period: `Q${baseQ} ${year}`,
    demand: base,
    supply: Math.round(31000 + i * 500 + Math.random() * 300),
    gap: Math.round(base - (31000 + i * 500)),
    is_forecast: isForecast,
    confidence_upper: isForecast ? base + 3000 + i * 500 : null,
    confidence_lower: isForecast ? base - 2000 : null,
  }
})

export const SKILL_GAPS = OCCUPATIONS.map(o => ({
  occupation_id: o.id,
  occupation: o.title,
  sector: o.sector,
  gap: o.gap,
  gap_index: Math.round((o.gap / o.demand) * 100),
  demand: o.demand,
  effective_supply: o.demand - o.gap,
  confidence: o.confidence,
  risk_level: o.gap > 3000 ? 'CRITICAL' : o.gap > 1500 ? 'HIGH' : o.gap > 0 ? 'MEDIUM' : o.gap < -1500 ? 'OVERSUPPLY' : 'BALANCED',
  trend: o.trend,
}))

export const RECOMMENDATIONS = [
  {
    id: 'r1', type: 'INCREASE', priority: 'CRITICAL',
    district_id: 'd3', district: 'Hosur/Krishnagiri',
    occupation_id: 'o2', occupation: 'EV Technician',
    gap: 1970, confidence: 86,
    title: 'Increase EV Technician Training Capacity',
    description: 'Increase EV Technician training by 800 seats across 2 existing centres in Hosur cluster',
    evidence: [
      'Vacancy demand increased 31% in last 2 quarters',
      '42 employers posted EV-related roles in district',
      'Only 28% of projected demand covered by existing capacity',
      '3 EV assembly plants announced for 2026–27',
    ],
    cost_estimate: 2400000,
    impact_score: 94,
    status: 'PENDING_REVIEW',
  },
  {
    id: 'r2', type: 'RESKILL', priority: 'HIGH',
    district_id: 'd1', district: 'Coimbatore',
    occupation_id: 'o1', occupation: 'Solar PV Technician',
    gap: 2840, confidence: 91,
    title: 'Bridge Reskilling Programme: Electricians → Solar PV',
    description: 'Deploy 6-week bridge programme converting underemployed electricians to Solar PV technicians',
    evidence: [
      '4,200 underemployed electricians in district',
      'Solar demand grew 24% last quarter',
      'Cost per reskilled worker 60% lower than fresh training',
    ],
    cost_estimate: 1800000,
    impact_score: 88,
    status: 'APPROVED',
  },
  {
    id: 'r3', type: 'RELOCATE', priority: 'HIGH',
    district_id: 'd2', district: 'Chennai → Hosur',
    occupation_id: 'o4', occupation: 'CNC Operator Training',
    gap: 2200, confidence: 82,
    title: 'Relocate CNC Training Capacity from Chennai to Hosur',
    description: 'Relocate 40% of Chennai CNC training capacity to Hosur industrial cluster',
    evidence: ['Chennai CNC centres at 45% utilization', 'Hosur demand-supply imbalance identified 8 months ago'],
    cost_estimate: 900000,
    impact_score: 76,
    status: 'PENDING_REVIEW',
  },
  {
    id: 'r4', type: 'REDUCE', priority: 'MEDIUM',
    district_id: 'd5', district: 'Tiruchirappalli',
    occupation_id: 'o8', occupation: 'Data Entry Operator',
    gap: -2400, confidence: 92,
    title: 'Reduce Data Entry Training, Redirect to Data Analytics',
    description: 'Reduce Data Entry seats by 60%, convert programmes to Data Analytics',
    evidence: ['Persistent oversupply for 6+ quarters', 'Placement rate dropped to 23%', 'AI automation reducing demand structurally'],
    cost_estimate: 0,
    impact_score: 71,
    status: 'IN_PROGRESS',
  },
]

export const EARLY_WARNINGS = [
  { id: 'ew1', severity: 'CRITICAL', district: 'Hosur/Krishnagiri', occupation: 'EV Technician', stage: 5, days_until_critical: 0, trend: 'demand +31%, supply +9%', message: 'Critical shortage. Immediate intervention required.' },
  { id: 'ew2', severity: 'HIGH', district: 'Tamil Nadu', occupation: 'Solar PV Technician', stage: 4, days_until_critical: 47, trend: 'demand +24%, capacity unchanged', message: 'Forecast indicates shortage in 47 days.' },
  { id: 'ew3', severity: 'HIGH', district: 'Bengaluru', occupation: 'AI/ML Engineer', stage: 4, days_until_critical: 62, trend: 'demand +28%, institutional supply flat', message: 'High-skill gap widening. Training lead time insufficient.' },
  { id: 'ew4', severity: 'MEDIUM', district: 'Tirunelveli', occupation: 'Wind Turbine Technician', stage: 3, days_until_critical: 124, trend: 'demand +19%, supply +6%', message: 'Supply-demand gap widening steadily.' },
  { id: 'ew5', severity: 'LOW', district: 'Tiruchirappalli', occupation: 'Data Entry Operator', stage: 2, days_until_critical: null, trend: 'demand -12%, supply flat', message: 'Persistent oversaturation risk.' },
]

export const TRAINING_CENTRES = [
  { id: 'tc1', name: 'NSDC Coimbatore Hub', district: 'Coimbatore', district_id: 'd1', capacity: 1200, enrollment: 980, sectors: ['Manufacturing', 'Renewable Energy'], utilization_rate: 82, placement_rate: 74, lat: 11.0168, lng: 76.9558 },
  { id: 'tc2', name: 'Skill India Chennai Centre', district: 'Chennai', district_id: 'd2', capacity: 2400, enrollment: 1080, sectors: ['IT/Digital', 'Manufacturing'], utilization_rate: 45, placement_rate: 68, lat: 13.0827, lng: 80.2707 },
  { id: 'tc3', name: 'ITI Hosur', district: 'Hosur', district_id: 'd3', capacity: 600, enrollment: 591, sectors: ['Automotive', 'Manufacturing'], utilization_rate: 98, placement_rate: 81, lat: 12.7409, lng: 77.8253 },
  { id: 'tc4', name: 'PMKVY Madurai', district: 'Madurai', district_id: 'd4', capacity: 800, enrollment: 620, sectors: ['Textiles', 'Food Processing'], utilization_rate: 78, placement_rate: 69, lat: 9.9252, lng: 78.1198 },
  { id: 'tc5', name: 'SSC Bengaluru Tech Centre', district: 'Bengaluru', district_id: 'd7', capacity: 3200, enrollment: 2890, sectors: ['IT/Digital', 'Electronics'], utilization_rate: 90, placement_rate: 79, lat: 12.9716, lng: 77.5946 },
  { id: 'tc6', name: 'ITI Pune Industrial', district: 'Pune', district_id: 'd9', capacity: 1800, enrollment: 1620, sectors: ['Automotive', 'Manufacturing'], utilization_rate: 90, placement_rate: 76, lat: 18.5204, lng: 73.8567 },
]
