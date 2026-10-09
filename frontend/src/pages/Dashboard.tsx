import { useState } from 'react'
import {
  TrendingUp, TrendingDown, AlertTriangle, Users, Building2,
  Activity, Globe, Zap, ArrowUp, ArrowDown, Info, ChevronRight
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts'
import {
  mockNationalStats, mockForecastData, mockSectorData,
  mockEarlyWarnings, mockDistricts, mockOccupations
} from '../lib/mockData'
import { useNavigate } from 'react-router-dom'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-gray-400 mb-2 font-medium">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex justify-between gap-4">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-bold text-white">{p.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [selectedState, setSelectedState] = useState('All India')

  const stats = mockNationalStats
  const criticalWarnings = mockEarlyWarnings.filter(w => w.severity === 'CRITICAL')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">National Command Centre</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time labour market intelligence across India · Updated{' '}
            <span className="text-success-500">just now</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="select-field text-sm w-44"
          >
            <option>All India</option>
            <option>Tamil Nadu</option>
            <option>Karnataka</option>
            <option>Maharashtra</option>
          </select>
          <button onClick={() => navigate('/simulator')} className="btn-primary text-sm">
            Policy Simulator
          </button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalWarnings.length > 0 && (
        <div className="bg-danger-500/10 border border-danger-500/30 rounded-2xl p-4 flex items-center gap-4 animate-pulse-glow">
          <div className="w-10 h-10 rounded-xl bg-danger-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-danger-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-danger-400">
              {criticalWarnings.length} Critical Skill Shortage{criticalWarnings.length > 1 ? 's' : ''} Detected
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {criticalWarnings.map(w => `${w.district} → ${w.occupation}`).join(' · ')}
            </div>
          </div>
          <button
            onClick={() => navigate('/early-warning')}
            className="text-danger-400 hover:text-danger-300 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Macro Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Projected Skill Shortage',
            value: `${(stats.totalSkillShortage / 1000000).toFixed(1)}M`,
            icon: TrendingUp, iconColor: 'text-danger-400', bg: 'bg-danger-500/10',
            sub: '+12% vs last quarter', subColor: 'text-danger-400', trend: 'up'
          },
          {
            label: 'Skill Oversupply',
            value: `${(stats.totalOversupply / 1000000).toFixed(1)}M`,
            icon: TrendingDown, iconColor: 'text-warning-400', bg: 'bg-warning-500/10',
            sub: '-3% vs last quarter', subColor: 'text-success-500', trend: 'down'
          },
          {
            label: 'Active Learners',
            value: `${(stats.activeLearners / 1000).toFixed(0)}K`,
            icon: Users, iconColor: 'text-primary-400', bg: 'bg-primary-500/10',
            sub: `${stats.trainingCentres.toLocaleString()} centres`, subColor: 'text-gray-400', trend: null
          },
          {
            label: 'Avg Placement Rate',
            value: `${stats.placementRate}%`,
            icon: Activity, iconColor: 'text-success-400', bg: 'bg-success-500/10',
            sub: '+2.4pp this quarter', subColor: 'text-success-400', trend: 'up'
          },
        ].map((s, i) => (
          <div key={i} className="metric-card hover:border-white/20 transition-all duration-200 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className={`card-icon ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              {s.trend && (
                <span className={s.trend === 'up' ? (s.label.includes('Shortage') ? 'text-danger-400' : 'text-success-400') : 'text-success-400'}>
                  {s.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </span>
              )}
            </div>
            <div className="stat-number text-2xl mb-1">{s.value}</div>
            <div className="text-xs text-gray-500 font-medium mb-1">{s.label}</div>
            <div className={`text-xs ${s.subColor}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Districts Analyzed', value: stats.districtsAnalyzed, icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Emerging Skills', value: stats.emergingSkills, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Saturated Occupations', value: stats.saturatedOccupations, icon: TrendingDown, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'High-Risk Districts', value: stats.highRiskDistricts, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer">
            <div className={`card-icon ${s.bg} flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{s.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand-Supply Forecast Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">National Demand-Supply Forecast</h2>
              <p className="text-xs text-gray-400 mt-0.5">Historical + projected labour demand vs effective supply</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary-400 rounded inline-block" />Demand</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-success-500 rounded inline-block" />Supply</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-danger-400 rounded inline-block" />Gap</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockForecastData}>
              <defs>
                <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="demand" name="Demand" stroke="#6366f1" strokeWidth={2} fill="url(#demandGrad)" />
              <Area type="monotone" dataKey="supply" name="Supply" stroke="#22c55e" strokeWidth={2} fill="url(#supplyGrad)" />
              <Area type="monotone" dataKey="gap" name="Gap" stroke="#ef4444" strokeWidth={2} fill="url(#gapGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-gray-500 text-center">
            Dashed lines indicate forecast period (Q1–Q4 2027) · 80% confidence interval
          </div>
        </div>

        {/* Sector Risk Breakdown */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-4">Sector Risk Breakdown</h2>
          <div className="space-y-3">
            {mockSectorData.map((s, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-300 font-medium">{s.sector}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{(s.gap / 1000).toFixed(1)}K gap</span>
                    <span className={`badge text-xs py-0 px-1.5 ${
                      s.risk === 'CRITICAL' ? 'badge-danger' :
                      s.risk === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      s.risk === 'MEDIUM' ? 'badge-warning' : 'badge-success'
                    }`}>{s.risk}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill transition-all duration-700"
                    style={{
                      width: `${Math.min((s.gap / 45000) * 100, 100)}%`,
                      backgroundColor: s.color
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-0.5">+{s.growth}% demand growth</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Shortage Districts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Top Shortage Districts</h2>
            <button onClick={() => navigate('/district')} className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1 transition-colors">
              View All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {mockDistricts.filter(d => d.riskLevel === 'CRITICAL' || d.riskLevel === 'HIGH').slice(0, 5).map((d, i) => (
              <div key={d.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-700/40 transition-all cursor-pointer group" onClick={() => navigate('/district')}>
                <div className="w-6 h-6 rounded-full bg-surface-600 flex items-center justify-center text-xs font-bold text-gray-400">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{d.name}</div>
                  <div className="text-xs text-gray-500">{d.state}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold" style={{ color: d.riskLevel === 'CRITICAL' ? '#ef4444' : d.riskLevel === 'HIGH' ? '#f97316' : '#eab308' }}>
                    {d.riskLevel}
                  </div>
                  <div className="text-xs text-gray-500">+{d.demandGrowth}% demand</div>
                </div>
                <div className={`badge ${d.riskLevel === 'CRITICAL' ? 'badge-danger' : d.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'badge-warning'}`}>
                  {100 - d.healthScore}% gap
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Shortage Occupations */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Critical Skill Gaps</h2>
            <button onClick={() => navigate('/skill-gaps')} className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1 transition-colors">
              Deep Dive <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {mockOccupations.filter(o => o.gap > 0).slice(0, 5).map((o, i) => (
              <div key={o.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-700/40 transition-all cursor-pointer" onClick={() => navigate('/skill-gaps')}>
                <div className="w-6 h-6 rounded-full bg-surface-600 flex items-center justify-center text-xs font-bold text-gray-400">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{o.title}</div>
                  <div className="text-xs text-gray-500">{o.sector} · NCO {o.ncoCode}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-danger-400">+{o.gap.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">gap</div>
                </div>
                <div className={`badge ${
                  o.trend === 'SURGING' ? 'badge-danger' :
                  o.trend === 'RISING' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'badge-primary'
                }`}>
                  {o.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confidence Score footer */}
      <div className="glass-card p-4 flex items-center gap-4">
        <Info className="w-4 h-4 text-primary-400 flex-shrink-0" />
        <div className="text-xs text-gray-400">
          <span className="text-white font-medium">Data Confidence:</span>{' '}
          Overall model confidence is{' '}
          <span className="text-primary-400 font-medium">{stats.avgConfidence}%</span>.{' '}
          Forecasts are based on NCS vacancy data, PLFS baseline, e-Shram workforce stock, industry economic signals,
          and training capacity from Skill India Digital. Forecast uncertainty increases beyond 6-month horizon.{' '}
          <span className="text-gray-500">Dashed areas indicate 80% confidence intervals.</span>
        </div>
      </div>
    </div>
  )
}
