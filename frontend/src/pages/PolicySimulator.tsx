import { useState } from 'react'
import {
  Sliders, Play, RotateCcw, TrendingDown, TrendingUp,
  DollarSign, Users, Building2, CheckCircle, AlertCircle, Info
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts'
import { mockPolicySimulations } from '../lib/mockData'

const scenarioColors = ['#6b7280', '#6366f1', '#22c55e', '#f97316']

export default function PolicySimulator() {
  const [evSeats, setEvSeats] = useState(0)
  const [solarSeats, setSolarSeats] = useState(0)
  const [capacityMove, setCapacityMove] = useState(0)
  const [reskillBudget, setReskillBudget] = useState(0)
  const [hasSimulated, setHasSimulated] = useState(false)
  const [activeScenario, setActiveScenario] = useState<string | null>(null)

  const calculateImpact = () => {
    const baseGap = 29000
    const evImpact = evSeats * 4.2
    const solarImpact = solarSeats * 3.8
    const moveImpact = capacityMove * 180
    const reskillImpact = (reskillBudget * 1000000) / 8000 * 2.1

    const totalReduction = evImpact + solarImpact + moveImpact + reskillImpact
    const newGap = Math.max(0, baseGap - totalReduction)
    const reduction = ((baseGap - newGap) / baseGap) * 100
    const totalCost = evSeats * 48000 + solarSeats * 42000 + capacityMove * 500000 + reskillBudget * 1000000

    return {
      newGap: Math.round(newGap),
      reduction: reduction.toFixed(1),
      totalCost,
      placementImprovement: Math.min(15, reduction * 0.4).toFixed(1),
      utilizationChange: Math.min(12, reduction * 0.3).toFixed(1),
      workersImpacted: Math.round(totalReduction),
      costPerWorker: totalCost > 0 ? Math.round(totalCost / Math.max(1, totalReduction)) : 0,
    }
  }

  const impact = calculateImpact()

  const comparisonData = [
    { name: 'Current', gap: 29000, placement: 68, utilization: 74, color: '#6b7280' },
    {
      name: 'Simulated',
      gap: impact.newGap,
      placement: 68 + parseFloat(impact.placementImprovement),
      utilization: 74 + parseFloat(impact.utilizationChange),
      color: '#6366f1'
    },
    { name: 'Scenario A\n(+20% EV)', gap: 24000, placement: 72, utilization: 79, color: '#22c55e' },
    { name: 'Scenario B\n(Reskill)', gap: 20500, placement: 76, utilization: 82, color: '#f97316' },
  ]

  const radarData = [
    { metric: 'Gap Reduction', current: 0, simulated: parseFloat(impact.reduction) },
    { metric: 'Placement Rate', current: 50, simulated: 50 + parseFloat(impact.placementImprovement) * 3 },
    { metric: 'Cost Efficiency', current: 40, simulated: impact.costPerWorker < 50000 ? 80 : 50 },
    { metric: 'Coverage', current: 45, simulated: Math.min(90, 45 + evSeats + solarSeats) },
    { metric: 'Speed', current: 60, simulated: reskillBudget > 2 ? 85 : 60 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Policy Simulator</h1>
        <p className="text-gray-400 text-sm mt-1">
          Simulate training interventions before committing resources · What-if scenario analysis
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-gray-400">
          <strong className="text-white">Human-in-the-loop design:</strong>{' '}
          This simulator provides evidence-based recommendations. All budget allocations require planner review and approval.
          The AI never autonomously allocates government funds.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary-400" />
            Intervention Controls
          </h2>

          {/* Preset Scenarios */}
          <div>
            <div className="text-xs text-gray-500 mb-2 font-medium">Quick Scenarios</div>
            <div className="space-y-2">
              {[
                { id: 'ev', label: '+20% EV Training', onClick: () => { setEvSeats(400); setSolarSeats(0); setCapacityMove(0); setReskillBudget(0) } },
                { id: 'solar', label: 'Reskill → Solar PV', onClick: () => { setEvSeats(0); setSolarSeats(300); setCapacityMove(0); setReskillBudget(3) } },
                { id: 'move', label: 'Relocate + Reskill', onClick: () => { setEvSeats(200); setSolarSeats(200); setCapacityMove(3); setReskillBudget(2) } },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => { s.onClick(); setActiveScenario(s.id); setHasSimulated(true) }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-all ${
                    activeScenario === s.id
                      ? 'bg-primary-600/20 border-primary-500/40 text-primary-400'
                      : 'bg-surface-700/30 border-white/5 text-gray-300 hover:border-white/15'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* EV Seats */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">EV Technician Seats</span>
              <span className="text-primary-400 font-semibold">+{evSeats}</span>
            </div>
            <input
              type="range" min={0} max={1000} step={50}
              value={evSeats}
              onChange={e => { setEvSeats(+e.target.value); setActiveScenario(null) }}
              className="w-full accent-primary-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0</span><span>1,000 seats</span>
            </div>
          </div>

          {/* Solar Seats */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">Solar PV Technician Seats</span>
              <span className="text-accent-400 font-semibold">+{solarSeats}</span>
            </div>
            <input
              type="range" min={0} max={1000} step={50}
              value={solarSeats}
              onChange={e => { setSolarSeats(+e.target.value); setActiveScenario(null) }}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Capacity Move */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">Centres to Relocate</span>
              <span className="text-success-400 font-semibold">{capacityMove} centres</span>
            </div>
            <input
              type="range" min={0} max={10} step={1}
              value={capacityMove}
              onChange={e => { setCapacityMove(+e.target.value); setActiveScenario(null) }}
              className="w-full accent-green-500 cursor-pointer"
            />
          </div>

          {/* Reskill Budget */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">Reskilling Budget</span>
              <span className="text-warning-400 font-semibold">₹{reskillBudget}Cr</span>
            </div>
            <input
              type="range" min={0} max={20} step={1}
              value={reskillBudget}
              onChange={e => { setReskillBudget(+e.target.value); setActiveScenario(null) }}
              className="w-full accent-yellow-500 cursor-pointer"
            />
          </div>

          <button
            onClick={() => setHasSimulated(true)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Play size={15} />
            Run Simulation
          </button>

          <button
            onClick={() => { setEvSeats(0); setSolarSeats(0); setCapacityMove(0); setReskillBudget(0); setHasSimulated(false); setActiveScenario(null) }}
            className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Impact Summary */}
          <div className={`glass-card p-6 ${hasSimulated ? 'border-primary-500/30' : ''} transition-all`}>
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-success-400" />
              Projected Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Gap Reduction',
                  value: hasSimulated ? `${impact.reduction}%` : '—',
                  before: '29,000', after: hasSimulated ? impact.newGap.toLocaleString() : '—',
                  icon: TrendingDown, color: 'text-success-400', bg: 'bg-success-500/10'
                },
                {
                  label: 'Total Cost',
                  value: hasSimulated ? `₹${(impact.totalCost / 10000000).toFixed(2)}Cr` : '—',
                  before: '₹0', after: hasSimulated ? `₹${(impact.totalCost / 10000000).toFixed(2)}Cr` : '—',
                  icon: DollarSign, color: 'text-warning-400', bg: 'bg-warning-500/10'
                },
                {
                  label: 'Workers Impacted',
                  value: hasSimulated ? impact.workersImpacted.toLocaleString() : '—',
                  before: '0', after: hasSimulated ? impact.workersImpacted.toLocaleString() : '—',
                  icon: Users, color: 'text-primary-400', bg: 'bg-primary-500/10'
                },
                {
                  label: 'Cost per Worker',
                  value: hasSimulated ? `₹${impact.costPerWorker.toLocaleString()}` : '—',
                  before: '—', after: hasSimulated ? `₹${impact.costPerWorker.toLocaleString()}` : '—',
                  icon: Building2, color: 'text-accent-400', bg: 'bg-accent-500/10'
                },
              ].map((m, i) => (
                <div key={i} className={`metric-card ${!hasSimulated ? 'opacity-50' : ''}`}>
                  <div className={`card-icon ${m.bg} mb-3`}>
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                  {hasSimulated && (
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="line-through">{m.before}</span>
                      {' → '}
                      <span className="text-white font-medium">{m.after}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Scenario Comparison — Skill Gap</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: '#141c36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="gap" name="Skill Gap" radius={[6, 6, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendation */}
          {hasSimulated && parseFloat(impact.reduction) > 0 && (
            <div className="glass-card p-6 border-success-500/20 animate-scale-in">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">AI Analyst Recommendation</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    This intervention is projected to reduce the national skill gap by{' '}
                    <strong className="text-success-400">{impact.reduction}%</strong>, impacting approximately{' '}
                    <strong className="text-white">{impact.workersImpacted.toLocaleString()}</strong> workers.
                    {reskillBudget > evSeats * 0.01 && (
                      <> The reskilling component offers the best cost-per-worker ratio at ₹{impact.costPerWorker.toLocaleString()},
                      significantly lower than fresh training (~₹48,000 per EV seat).</>
                    )}
                    {' '}Confidence: <strong className="text-primary-400">84%</strong>.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="btn-primary text-xs px-4 py-2">Approve for Review</button>
                    <button className="btn-secondary text-xs px-4 py-2">Export Report</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
