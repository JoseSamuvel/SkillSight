import { useState } from 'react'
import { BarChart3, Filter, ArrowUp, ArrowDown, Info, Search, TrendingUp, TrendingDown } from 'lucide-react'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, BarChart, Bar, ReferenceLine
} from 'recharts'
import { mockOccupations, mockSectorData } from '../lib/mockData'

const riskColors: Record<string, string> = {
  SURGING: '#ef4444',
  RISING: '#f97316',
  STABLE: '#eab308',
  DECLINING: '#22c55e',
}

const gapColors = (gap: number) => {
  if (gap > 3000) return '#ef4444'
  if (gap > 1500) return '#f97316'
  if (gap > 0) return '#eab308'
  if (gap > -1000) return '#22c55e'
  return '#06b6d4'
}

export default function SkillGapAnalysis() {
  const [selectedSector, setSelectedSector] = useState('All Sectors')
  const [sortBy, setSortBy] = useState('gap')
  const [selectedOccupation, setSelectedOccupation] = useState(mockOccupations[0])
  const [searchTerm, setSearchTerm] = useState('')

  const sectors = ['All Sectors', ...Array.from(new Set(mockOccupations.map(o => o.sector)))]

  const filteredOccupations = mockOccupations
    .filter(o => selectedSector === 'All Sectors' || o.sector === selectedSector)
    .filter(o => o.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'gap') return Math.abs(b.gap) - Math.abs(a.gap)
      if (sortBy === 'demand') return b.demand - a.demand
      if (sortBy === 'confidence') return b.confidence - a.confidence
      return 0
    })

  const gapBarData = filteredOccupations.map(o => ({
    name: o.title.length > 20 ? o.title.slice(0, 20) + '…' : o.title,
    gap: o.gap,
    demand: o.demand,
    supply: o.demand - o.gap,
  }))

  const scatterData = mockOccupations.map(o => ({
    x: o.demand,
    y: o.demand - o.gap,
    z: Math.abs(o.gap),
    name: o.title,
    gap: o.gap,
    sector: o.sector,
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Skill Gap Analysis</h1>
        <p className="text-gray-400 text-sm mt-1">
          Demand vs effective supply by occupation · NCO-aligned taxonomy
        </p>
      </div>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Critical Shortages', value: mockOccupations.filter(o => o.gap > 3000).length, color: 'badge-danger' },
          { label: 'Moderate Shortages', value: mockOccupations.filter(o => o.gap > 0 && o.gap <= 3000).length, color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
          { label: 'Balanced', value: mockOccupations.filter(o => Math.abs(o.gap) < 500).length, color: 'badge-success' },
          { label: 'Oversupply', value: mockOccupations.filter(o => o.gap < -500).length, color: 'badge-warning' },
          { label: 'Surging Demand', value: mockOccupations.filter(o => o.trend === 'SURGING').length, color: 'badge-primary' },
        ].map((b, i) => (
          <div key={i} className={`badge text-sm ${b.color}`}>
            <span className="font-bold">{b.value}</span> {b.label}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search occupation..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field pl-9 w-56 text-sm"
          />
        </div>
        <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)} className="select-field w-44 text-sm">
          {sectors.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="select-field w-40 text-sm">
          <option value="gap">Sort by Gap</option>
          <option value="demand">Sort by Demand</option>
          <option value="confidence">Sort by Confidence</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupation List */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Occupations ({filteredOccupations.length})</h2>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {filteredOccupations.map(o => (
              <button
                key={o.id}
                onClick={() => setSelectedOccupation(o)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-700/50 border-b border-white/5 transition-all ${
                  selectedOccupation?.id === o.id ? 'bg-primary-600/10 border-l-2 border-l-primary-500' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{o.title}</div>
                  <div className="text-xs text-gray-500">{o.sector} · NCO {o.ncoCode}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-sm font-bold ${o.gap > 0 ? 'text-danger-400' : 'text-success-400'}`}>
                    {o.gap > 0 ? '+' : ''}{(o.gap / 1000).toFixed(1)}K
                  </div>
                  <div className={`text-xs ${riskColors[o.trend] ? 'font-medium' : 'text-gray-500'}`} style={{ color: riskColors[o.trend] }}>
                    {o.trend}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2 space-y-4">
          {selectedOccupation && (
            <>
              {/* Occupation Header */}
              <div className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedOccupation.title}</h2>
                    <p className="text-gray-400 text-sm">{selectedOccupation.sector} · NCO Code: {selectedOccupation.ncoCode} · NSQF Level {selectedOccupation.nsqfLevel}</p>
                  </div>
                  <div className={`badge ${
                    selectedOccupation.trend === 'SURGING' ? 'badge-danger' :
                    selectedOccupation.trend === 'RISING' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    selectedOccupation.trend === 'DECLINING' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {selectedOccupation.trend}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Current Demand', value: selectedOccupation.demand.toLocaleString(), color: 'text-primary-400' },
                    { label: 'Effective Supply', value: (selectedOccupation.demand - selectedOccupation.gap).toLocaleString(), color: 'text-success-400' },
                    { label: 'Skill Gap', value: (selectedOccupation.gap > 0 ? '+' : '') + selectedOccupation.gap.toLocaleString(), color: selectedOccupation.gap > 0 ? 'text-danger-400' : 'text-success-400' },
                    { label: 'Confidence', value: `${selectedOccupation.confidence}%`, color: 'text-white' },
                  ].map((m, i) => (
                    <div key={i} className="bg-surface-700/30 rounded-xl p-3 text-center">
                      <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                      <div className="text-xs text-gray-500">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demand vs Supply Bar */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Demand vs Supply — All Occupations</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={gapBarData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#d1d5db', fontSize: 9 }} width={120} />
                    <Tooltip contentStyle={{ background: '#141c36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Bar dataKey="demand" name="Demand" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="supply" name="Supply" fill="#22c55e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Skill Gap Index */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-2">Skill Gap Index (SGI) Explanation</h3>
                <div className="text-xs text-gray-400 mb-4">
                  SGI = Forecast Demand - Effective Forecast Supply. Positive = shortage, Negative = oversupply.
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: 'Severe Shortage', range: '>3000', color: '#ef4444' },
                    { label: 'Shortage', range: '1000–3000', color: '#f97316' },
                    { label: 'Balanced', range: '±500', color: '#22c55e' },
                    { label: 'Mild Surplus', range: '-500 to -1500', color: '#eab308' },
                    { label: 'Oversupply', range: '<-1500', color: '#06b6d4' },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
                      <span className="text-gray-400">{l.label} ({l.range})</span>
                    </div>
                  ))}
                </div>

                {/* Gap visualization */}
                <div className="mt-4 relative">
                  <div className="h-8 rounded-full bg-gradient-to-r from-cyan-500 via-success-500 via-warning-500 via-orange-500 to-danger-500 opacity-70" />
                  <div className="absolute inset-0 flex items-center px-4">
                    <div
                      className="w-3 h-3 bg-white rounded-full shadow-glow-primary transition-all duration-500"
                      style={{
                        marginLeft: `${Math.max(0, Math.min(95, ((selectedOccupation.gap + 4000) / 8000) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Oversupply</span>
                    <span>Balanced</span>
                    <span>Severe Shortage</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
