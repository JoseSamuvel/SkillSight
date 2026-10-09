import { useState } from 'react'
import { Target, CheckCircle2, Clock, TrendingUp, BarChart3, RefreshCw, Info } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine
} from 'recharts'

const interventions = [
  {
    id: 'i1',
    district: 'Hosur/Krishnagiri',
    occupation: 'EV Technician',
    action: 'Increased training by 600 seats',
    date: 'Apr 2025',
    projected: 4200,
    actual: 3100,
    accuracy: 73.8,
    status: 'COMPLETED',
    impact: 'HIGH',
  },
  {
    id: 'i2',
    district: 'Tamil Nadu (State)',
    occupation: 'Solar PV Technician',
    action: 'Bridge reskilling for 1,200 electricians',
    date: 'Jun 2025',
    projected: 3800,
    actual: 4100,
    accuracy: 92.7,
    status: 'COMPLETED',
    impact: 'VERY HIGH',
  },
  {
    id: 'i3',
    district: 'Coimbatore',
    occupation: 'CNC Operator',
    action: 'Curriculum update + 200 new seats',
    date: 'Aug 2025',
    projected: 2100,
    actual: 1800,
    accuracy: 85.7,
    status: 'IN PROGRESS',
    impact: 'MEDIUM',
  },
  {
    id: 'i4',
    district: 'Chennai',
    occupation: 'Data Entry Operator',
    action: 'Reduced seats by 40%, redirected to Data Analytics',
    date: 'Sep 2025',
    projected: -2000,
    actual: -1800,
    accuracy: 90.0,
    status: 'IN PROGRESS',
    impact: 'MEDIUM',
  },
]

const feedbackLoop = [
  { step: 'Data', label: 'Labour Signals', color: '#6366f1' },
  { step: 'Predict', label: 'Forecast', color: '#8b5cf6' },
  { step: 'Recommend', label: 'Policy Action', color: '#f97316' },
  { step: 'Implement', label: 'Training', color: '#22c55e' },
  { step: 'Outcome', label: 'Placement', color: '#eab308' },
  { step: 'Compare', label: 'Model Check', color: '#6366f1' },
]

const outcomeTimeline = [
  { month: 'Apr 25', predicted: 4200, actual: null },
  { month: 'May 25', predicted: 4000, actual: null },
  { month: 'Jun 25', predicted: 3800, actual: null },
  { month: 'Jul 25', predicted: 3600, actual: 3800 },
  { month: 'Aug 25', predicted: 3400, actual: 3500 },
  { month: 'Sep 25', predicted: 3200, actual: 3100 },
  { month: 'Oct 25', predicted: 3000, actual: 2900 },
  { month: 'Nov 25', predicted: 2800, actual: null },
  { month: 'Dec 25', predicted: 2600, actual: null },
]

export default function OutcomeTracker() {
  const [selected, setSelected] = useState(interventions[0])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Outcome Tracker</h1>
        <p className="text-gray-400 text-sm mt-1">
          Closed-loop feedback — tracking whether government interventions actually reduced predicted skill gaps
        </p>
      </div>

      {/* Closed Loop Diagram */}
      <div className="glass-card p-6">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">Closed-Loop Intelligence System</div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {feedbackLoop.map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold mb-1 mx-auto"
                  style={{ backgroundColor: step.color + '30', border: `1px solid ${step.color}50` }}
                >
                  <span style={{ color: step.color }}>{i + 1}</span>
                </div>
                <div className="text-xs text-gray-400 w-16 text-center leading-tight">{step.label}</div>
              </div>
              {i < feedbackLoop.length - 1 && (
                <div className="flex-shrink-0 w-6 h-0.5 bg-gradient-to-r from-gray-600 to-gray-500" />
              )}
            </div>
          ))}
          <div className="ml-2 text-xs text-primary-400 flex-shrink-0 font-medium">
            ↩ Calibrates Model
          </div>
        </div>
        <div className="mt-4 p-3 bg-surface-700/30 rounded-xl text-xs text-gray-400">
          <Info className="w-3 h-3 text-primary-400 inline mr-1.5" />
          When actual outcomes differ from predictions, the system updates model weights — improving future forecast accuracy.
          This is what separates KaushalLens from a static dashboard.
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Interventions Tracked', value: interventions.length, color: 'text-white' },
          { label: 'Avg Forecast Accuracy', value: `${(interventions.reduce((s, i) => s + i.accuracy, 0) / interventions.length).toFixed(1)}%`, color: 'text-success-400' },
          { label: 'Completed', value: interventions.filter(i => i.status === 'COMPLETED').length, color: 'text-primary-400' },
          { label: 'In Progress', value: interventions.filter(i => i.status === 'IN PROGRESS').length, color: 'text-warning-400' },
        ].map((s, i) => (
          <div key={i} className="metric-card text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intervention List */}
        <div className="space-y-3">
          {interventions.map(intervention => (
            <button
              key={intervention.id}
              onClick={() => setSelected(intervention)}
              className={`w-full text-left glass-card p-4 hover:border-white/20 transition-all ${
                selected.id === intervention.id ? 'border-primary-500/30 bg-primary-500/5' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge text-xs py-0 ${
                  intervention.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'
                }`}>
                  {intervention.status}
                </span>
                <span className={`badge text-xs py-0 ${
                  intervention.impact === 'VERY HIGH' ? 'badge-danger' :
                  intervention.impact === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'badge-primary'
                }`}>
                  {intervention.impact}
                </span>
              </div>
              <div className="text-sm font-medium text-white">{intervention.occupation}</div>
              <div className="text-xs text-gray-400">{intervention.district}</div>
              <div className="text-xs text-gray-500 mt-2">{intervention.action}</div>
              <div className="mt-3 flex items-center gap-2">
                <div className="text-xs text-gray-500">Accuracy</div>
                <div className="flex-1 progress-bar">
                  <div className="progress-fill bg-success-500" style={{ width: `${intervention.accuracy}%` }} />
                </div>
                <div className="text-xs font-bold text-success-400">{intervention.accuracy}%</div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-5">
          {selected && (
            <>
              {/* Header */}
              <div className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${selected.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                        {selected.status === 'COMPLETED' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {selected.status}
                      </span>
                      <span className="text-xs text-gray-500">{selected.date}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{selected.occupation}</h2>
                    <p className="text-gray-400 text-sm">{selected.district}</p>
                    <p className="text-gray-500 text-sm mt-1">{selected.action}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success-400">{selected.accuracy}%</div>
                    <div className="text-xs text-gray-500">accuracy</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Projected Gap (Post)', value: selected.projected.toLocaleString(), color: 'text-primary-400' },
                    { label: 'Actual Gap (Observed)', value: selected.actual?.toLocaleString() || '—', color: 'text-success-400' },
                    { label: 'Prediction Error', value: selected.actual ? `${Math.abs(((selected.actual - selected.projected) / selected.projected) * 100).toFixed(1)}%` : '—', color: 'text-warning-400' },
                  ].map((m, i) => (
                    <div key={i} className="bg-surface-700/30 rounded-xl p-3 text-center">
                      <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome Chart */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary-400" />
                  Predicted vs Actual Outcomes
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={outcomeTimeline}>
                    <defs>
                      <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#141c36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#6366f1" strokeWidth={2} fill="url(#predGrad)" strokeDasharray="5 3" />
                    <Area type="monotone" dataKey="actual" name="Actual" stroke="#22c55e" strokeWidth={2.5} fill="url(#actualGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Feedback */}
              <div className="glass-card p-5 border border-primary-500/20 bg-primary-500/5">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary-400" />
                  Model Calibration Feedback
                </h3>
                <p className="text-sm text-gray-300">
                  This intervention had a forecast accuracy of{' '}
                  <strong className="text-success-400">{selected.accuracy}%</strong>.
                  The model has updated its district-level demand weights for{' '}
                  <strong className="text-white">{selected.occupation}</strong> based on this outcome.
                  Future forecasts for similar district-occupation pairs will incorporate this observation.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
