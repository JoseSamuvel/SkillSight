import { useState } from 'react'
import {
  MapPin, TrendingUp, TrendingDown, Users, Building2,
  ChevronDown, AlertCircle, Info, ArrowUpRight
} from 'lucide-react'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  LineChart, Line
} from 'recharts'
import { mockDistricts, mockOccupations, mockTrainingCentres } from '../lib/mockData'

export default function DistrictIntelligence() {
  const [selectedDistrict, setSelectedDistrict] = useState(mockDistricts[0])
  const [selectedState, setSelectedState] = useState('All States')

  const states = ['All States', 'Tamil Nadu', 'Karnataka', 'Maharashtra']
  const filteredDistricts = selectedState === 'All States'
    ? mockDistricts
    : mockDistricts.filter(d => d.state === selectedState)

  const districtCentres = mockTrainingCentres.filter(c => c.district === selectedDistrict.name)

  const healthData = [{ name: 'Health', value: selectedDistrict.healthScore, fill: selectedDistrict.healthScore > 75 ? '#22c55e' : selectedDistrict.healthScore > 60 ? '#eab308' : '#ef4444' }]

  const trendData = [
    { month: 'Jan', demand: 3200, supply: 2100 },
    { month: 'Feb', demand: 3400, supply: 2150 },
    { month: 'Mar', demand: 3700, supply: 2200 },
    { month: 'Apr', demand: 4100, supply: 2300 },
    { month: 'May', demand: 4500, supply: 2350 },
    { month: 'Jun', demand: 5100, supply: 2400 },
    { month: 'Jul', demand: 5800, supply: 2500 },
    { month: 'Aug', demand: 6200, supply: 2600 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">District Intelligence</h1>
        <p className="text-gray-400 text-sm mt-1">Deep-dive into district-level labour market conditions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* District Selector Panel */}
        <div className="glass-card p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Filter by State</label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="select-field text-sm"
            >
              {states.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider pt-2">Select District</div>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {filteredDistricts.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDistrict(d)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  selectedDistrict.id === d.id
                    ? 'bg-primary-600/20 border border-primary-500/30 text-white'
                    : 'hover:bg-surface-700/50 text-gray-400'
                }`}
              >
                <span className={`glow-dot flex-shrink-0 ${
                  d.riskLevel === 'CRITICAL' ? 'bg-danger-500' :
                  d.riskLevel === 'HIGH' ? 'bg-orange-500' :
                  d.riskLevel === 'MEDIUM' ? 'bg-warning-500' : 'bg-success-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{d.name}</div>
                  <div className="text-xs text-gray-600">{d.state}</div>
                </div>
                <div className="text-xs font-bold" style={{
                  color: d.riskLevel === 'CRITICAL' ? '#ef4444' :
                  d.riskLevel === 'HIGH' ? '#f97316' :
                  d.riskLevel === 'MEDIUM' ? '#eab308' : '#22c55e'
                }}>{d.healthScore}</div>
              </button>
            ))}
          </div>
        </div>

        {/* District Detail Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Card */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedDistrict.name}</h2>
                    <p className="text-gray-400 text-sm">{selectedDistrict.state} · {selectedDistrict.workforce.toLocaleString()} workforce</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className={`badge ${
                    selectedDistrict.riskLevel === 'CRITICAL' ? 'badge-danger' :
                    selectedDistrict.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    selectedDistrict.riskLevel === 'MEDIUM' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {selectedDistrict.riskLevel} RISK
                  </span>
                  <span className="badge badge-primary">
                    Demand ↑{selectedDistrict.demandGrowth}%
                  </span>
                  <span className="badge bg-surface-600/50 text-gray-400 border border-white/10">
                    Supply ↑{selectedDistrict.supplyGrowth}%
                  </span>
                </div>
              </div>
              {/* Health Gauge */}
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%" cy="50%"
                      innerRadius="60%" outerRadius="80%"
                      startAngle={90} endAngle={-270}
                      data={healthData}
                    >
                      <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'rgba(255,255,255,0.05)' }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{selectedDistrict.healthScore}</div>
                      <div className="text-xs text-gray-500">/100</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">Market Health</div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Demand Growth', value: `+${selectedDistrict.demandGrowth}%`, icon: TrendingUp, color: 'text-danger-400', bg: 'bg-danger-500/10', sub: 'QoQ' },
              { label: 'Supply Growth', value: `+${selectedDistrict.supplyGrowth}%`, icon: Users, color: 'text-success-400', bg: 'bg-success-500/10', sub: 'QoQ' },
              { label: 'Training Centres', value: districtCentres.length || '12', icon: Building2, color: 'text-primary-400', bg: 'bg-primary-500/10', sub: 'Active' },
            ].map((s, i) => (
              <div key={i} className="metric-card">
                <div className={`card-icon ${s.bg} mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className="text-xs text-gray-600">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Trend Chart */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Demand vs Supply Trend (2026)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#141c36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} labelStyle={{ color: '#9ca3af' }} itemStyle={{ color: '#e5e7eb' }} />
                <Line type="monotone" dataKey="demand" name="Demand" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="supply" name="Supply" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Occupation Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-danger-400" /> Top Shortage Occupations
              </h3>
              <div className="space-y-2">
                {mockOccupations.filter(o => o.gap > 0).slice(0, 5).map((o, i) => (
                  <div key={o.id} className="flex items-center gap-3 py-2">
                    <span className="text-xs font-bold text-gray-600 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{o.title}</div>
                      <div className="progress-bar mt-1">
                        <div className="progress-fill bg-danger-500" style={{ width: `${(o.gap / 5000) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-danger-400">+{(o.gap / 1000).toFixed(1)}K</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-warning-400" /> Oversupply / Saturation
              </h3>
              <div className="space-y-2">
                {mockOccupations.filter(o => o.gap < 0).map((o, i) => (
                  <div key={o.id} className="flex items-center gap-3 py-2">
                    <span className="text-xs font-bold text-gray-600 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{o.title}</div>
                      <div className="progress-bar mt-1">
                        <div className="progress-fill bg-warning-500" style={{ width: `${(Math.abs(o.gap) / 3000) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-warning-400">{(o.gap / 1000).toFixed(1)}K</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-warning-500/10 rounded-xl border border-warning-500/20">
                <div className="text-xs text-warning-400 font-medium flex items-center gap-1">
                  <Info size={12} /> Reskilling Opportunity
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Redirect oversupplied workers toward high-demand occupations via bridge programmes.
                </div>
              </div>
            </div>
          </div>

          {/* Training Centres */}
          {districtCentres.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Training Centres in {selectedDistrict.name}</h3>
              <div className="space-y-3">
                {districtCentres.map(c => (
                  <div key={c.id} className="flex items-center gap-4 p-3 bg-surface-700/30 rounded-xl">
                    <Building2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.sectors.join(' · ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-white">{c.enrollment}/{c.capacity}</div>
                      <div className="text-xs text-gray-500">enrolled</div>
                    </div>
                    <div className={`badge ${c.utilization > 90 ? 'badge-danger' : c.utilization > 70 ? 'badge-warning' : 'badge-success'}`}>
                      {c.utilization}% util.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
