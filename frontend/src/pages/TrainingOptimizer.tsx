import { useState } from 'react'
import { Building2, ArrowRight, ArrowLeft, TrendingUp, TrendingDown, Users, AlertCircle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { mockTrainingCentres } from '../lib/mockData'

const optimizationResults = [
  { centre: 'NSDC Coimbatore', current: 1200, recommended: 1600, change: +400, sector: 'Solar/EV', action: 'INCREASE' },
  { centre: 'Skill India Chennai', current: 2400, recommended: 1800, change: -600, sector: 'IT/Digital', action: 'REDUCE' },
  { centre: 'ITI Hosur', current: 600, recommended: 1000, change: +400, sector: 'EV/Automotive', action: 'INCREASE' },
  { centre: 'PMKVY Madurai', current: 800, recommended: 700, change: -100, sector: 'Textiles', action: 'REDUCE' },
  { centre: 'SSC Bengaluru', current: 3200, recommended: 3200, change: 0, sector: 'IT/Digital', action: 'MAINTAIN' },
  { centre: 'ITI Pune Industrial', current: 1800, recommended: 2200, change: +400, sector: 'Automotive/EV', action: 'INCREASE' },
]

export default function TrainingOptimizer() {
  const [budget, setBudget] = useState(10)
  const [period, setPeriod] = useState(12)
  const [hasOptimized, setHasOptimized] = useState(false)

  const totalBefore = optimizationResults.reduce((s, c) => s + c.current, 0)
  const totalAfter = optimizationResults.reduce((s, c) => s + c.recommended, 0)
  const projectedGapReduction = 47.3

  const chartData = optimizationResults.map(c => ({
    name: c.centre.replace('Skill India ', '').replace('NSDC ', '').replace(' Industrial', '').replace(' Coimbatore', '').replace(' Centre', ''),
    current: c.current,
    recommended: c.recommended,
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Training Capacity Optimizer</h1>
        <p className="text-gray-400 text-sm mt-1">
          AI-driven recommendation engine for optimal training seat allocation across centres
        </p>
      </div>

      {/* Budget Controls */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Optimization Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Available Budget</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">₹</span>
              <input
                type="range" min={1} max={50} step={1}
                value={budget}
                onChange={e => setBudget(+e.target.value)}
                className="flex-1 accent-primary-500"
              />
              <span className="text-primary-400 font-bold text-sm w-12">{budget}Cr</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Training Period</label>
            <div className="flex items-center gap-2">
              <input
                type="range" min={3} max={24} step={3}
                value={period}
                onChange={e => setPeriod(+e.target.value)}
                className="flex-1 accent-accent-500"
              />
              <span className="text-accent-400 font-bold text-sm w-20">{period} months</span>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setHasOptimized(true)}
              className="btn-primary w-full"
            >
              Run Optimization
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {hasOptimized && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-scale-in">
          {[
            { label: 'Total Capacity Before', value: totalBefore.toLocaleString(), color: 'text-gray-400' },
            { label: 'Total Capacity After', value: totalAfter.toLocaleString(), color: 'text-white' },
            { label: 'Net Change', value: `+${(totalAfter - totalBefore).toLocaleString()}`, color: 'text-success-400' },
            { label: 'Projected Gap Reduction', value: `${projectedGapReduction}%`, color: 'text-primary-400' },
          ].map((s, i) => (
            <div key={i} className="metric-card text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Centre Recommendations */}
      <div className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-5">
          {hasOptimized ? 'AI Optimization Results' : 'Current Training Centres'}
        </h2>

        {hasOptimized ? (
          <>
            <div className="space-y-3 mb-6">
              {optimizationResults.map((c, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  c.action === 'INCREASE' ? 'bg-success-500/5 border-success-500/20' :
                  c.action === 'REDUCE' ? 'bg-danger-500/5 border-danger-500/20' :
                  'bg-surface-700/30 border-white/5'
                }`}>
                  <Building2 className={`w-5 h-5 flex-shrink-0 ${
                    c.action === 'INCREASE' ? 'text-success-400' :
                    c.action === 'REDUCE' ? 'text-danger-400' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{c.centre}</div>
                    <div className="text-xs text-gray-500">{c.sector}</div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <div className="text-gray-400">{c.current.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">current</div>
                    </div>
                    {c.action === 'INCREASE' ? (
                      <ArrowRight className="w-4 h-4 text-success-400" />
                    ) : c.action === 'REDUCE' ? (
                      <ArrowLeft className="w-4 h-4 text-danger-400" />
                    ) : (
                      <span className="w-4 h-0.5 bg-gray-600 rounded" />
                    )}
                    <div className="text-right">
                      <div className="font-bold text-white">{c.recommended.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">recommended</div>
                    </div>
                    <div className={`badge ${
                      c.action === 'INCREASE' ? 'badge-success' :
                      c.action === 'REDUCE' ? 'badge-danger' : 'badge-primary'
                    }`}>
                      {c.change > 0 ? '+' : ''}{c.change} seats
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Chart */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Capacity Before vs After</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#d1d5db', fontSize: 9 }} width={110} />
                  <Tooltip contentStyle={{ background: '#141c36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="current" name="Current" fill="#4b5563" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="recommended" name="Recommended" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Projected Impact */}
            <div className="mt-5 p-5 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
              <h3 className="text-sm font-semibold text-primary-400 mb-3">Projected Impact (12 months)</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 text-xs">Shortage Before</div>
                  <div className="text-xl font-bold text-white mt-1">18,400</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Shortage After</div>
                  <div className="text-xl font-bold text-success-400 mt-1">9,720</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Gap Reduction</div>
                  <div className="text-xl font-bold text-primary-400 mt-1">47.3%</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="btn-primary text-xs px-4 py-2">Submit for Planner Approval</button>
                <button className="btn-secondary text-xs px-4 py-2">Export Plan (PDF)</button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {mockTrainingCentres.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4 bg-surface-700/30 rounded-xl">
                <Building2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.district} · {c.sectors.join(', ')}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{c.enrollment}/{c.capacity}</div>
                  <div className="text-xs text-gray-500">enrolled/capacity</div>
                </div>
                <div className={`badge ${
                  c.utilization > 90 ? 'badge-danger' :
                  c.utilization > 70 ? 'badge-warning' : 'badge-success'
                }`}>
                  {c.utilization}% utilized
                </div>
                <div className={`badge ${c.placement > 75 ? 'badge-success' : 'badge-warning'}`}>
                  {c.placement}% placement
                </div>
              </div>
            ))}
            <div className="text-center py-4 text-gray-500 text-sm">
              Set parameters above and click "Run Optimization" to see AI-driven recommendations
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
