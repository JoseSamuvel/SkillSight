import { useState } from 'react'
import {
  AlertTriangle, AlertCircle, Clock, ChevronRight,
  TrendingUp, ArrowUp, Zap, Bell, Activity
} from 'lucide-react'
import { mockEarlyWarnings } from '../lib/mockData'

const stageColors = ['bg-gray-700', 'bg-blue-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500']
const stageLabels = ['', 'Rising Demand', 'Capacity Stagnant', 'Gap Widening', 'Shortage Forecast', 'Critical Shortage']

const severityConfig: Record<string, { color: string; bg: string; border: string; icon: any }> = {
  CRITICAL: { color: 'text-danger-400', bg: 'bg-danger-500/10', border: 'border-danger-500/30', icon: AlertTriangle },
  HIGH: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertCircle },
  MEDIUM: { color: 'text-warning-400', bg: 'bg-warning-500/10', border: 'border-warning-500/30', icon: Clock },
  LOW: { color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/30', icon: Bell },
}

export default function EarlyWarning() {
  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState(mockEarlyWarnings[0])

  const filtered = filter === 'ALL' ? mockEarlyWarnings : mockEarlyWarnings.filter(w => w.severity === filter)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Early Warning System</h1>
        <p className="text-gray-400 text-sm mt-1">
          Detects skill shortages before they become visible in conventional annual reporting
        </p>
      </div>

      {/* Stage explanation */}
      <div className="glass-card p-5">
        <div className="text-xs text-gray-500 font-medium mb-3">EARLY WARNING PROGRESSION</div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(stage => (
            <div key={stage} className="flex-1 text-center">
              <div className={`h-1.5 rounded-full mb-2 ${stageColors[stage]}`} />
              <div className="text-xs text-gray-400 leading-tight">{stageLabels[stage]}</div>
              <div className="text-xs text-gray-600 font-bold">Stage {stage}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          System detects shortage at Stage 2–3, allowing 6–12 months for intervention before Stage 5 (Critical)
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === f
                ? 'bg-primary-600/20 border-primary-500/40 text-primary-400'
                : 'bg-surface-700/30 border-white/5 text-gray-400 hover:border-white/15'
            }`}
          >
            {f === 'ALL' ? `All (${mockEarlyWarnings.length})` : (
              <span className="flex items-center gap-1.5">
                <span className={`glow-dot ${
                  f === 'CRITICAL' ? 'bg-danger-500' :
                  f === 'HIGH' ? 'bg-orange-500' :
                  f === 'MEDIUM' ? 'bg-warning-500' : 'bg-primary-500'
                }`} />
                {f} ({mockEarlyWarnings.filter(w => w.severity === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warning List */}
        <div className="space-y-3">
          {filtered.map(w => {
            const cfg = severityConfig[w.severity]
            const Icon = cfg.icon
            return (
              <button
                key={w.id}
                onClick={() => setSelected(w)}
                className={`w-full text-left glass-card p-4 hover:border-white/20 transition-all ${
                  selected?.id === w.id ? `border ${cfg.border}` : ''
                } ${cfg.bg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.border} border flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge text-xs py-0 px-1.5 ${
                        w.severity === 'CRITICAL' ? 'badge-danger' :
                        w.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        w.severity === 'MEDIUM' ? 'badge-warning' : 'badge-primary'
                      }`}>{w.severity}</span>
                      <span className="text-xs text-gray-500">Stage {w.stage}/5</span>
                    </div>
                    <div className="text-sm font-medium text-white truncate">{w.occupation}</div>
                    <div className="text-xs text-gray-400">{w.district}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${cfg.color} flex-shrink-0 mt-2`} />
                </div>

                {/* Stage Progress */}
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map(s => (
                    <div
                      key={s}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        s <= w.stage ? stageColors[Math.min(w.stage, 5)] : 'bg-surface-600'
                      }`}
                    />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Warning Detail */}
        <div className="lg:col-span-2">
          {selected && (() => {
            const cfg = severityConfig[selected.severity]
            const Icon = cfg.icon
            return (
              <div className="space-y-5">
                {/* Header */}
                <div className={`glass-card p-6 ${cfg.bg} border ${cfg.border}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${cfg.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`badge ${
                          selected.severity === 'CRITICAL' ? 'badge-danger' :
                          selected.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          selected.severity === 'MEDIUM' ? 'badge-warning' : 'badge-primary'
                        }`}>{selected.severity}</span>
                        <span className="text-sm text-gray-400">Stage {selected.stage} / 5</span>
                        {selected.daysUntilCritical && (
                          <span className="badge badge-danger">
                            <Clock size={10} /> {selected.daysUntilCritical}d to critical
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-white">{selected.occupation}</h2>
                      <p className="text-gray-400 text-sm mt-1">{selected.district}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-surface-900/50 rounded-xl">
                    <p className={`text-sm font-medium ${cfg.color}`}>{selected.message}</p>
                    <p className="text-xs text-gray-400 mt-1">Trend: {selected.trend}</p>
                  </div>
                </div>

                {/* Stage Progress Detail */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Warning Progression</h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(s => {
                      const isActive = s <= selected.stage
                      const isCurrent = s === selected.stage
                      return (
                        <div key={s} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          isCurrent ? `${cfg.bg} border ${cfg.border}` :
                          isActive ? 'bg-surface-700/40' : 'opacity-40'
                        }`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isActive ? stageColors[s] : 'bg-surface-600'
                          } ${isActive ? 'text-white' : 'text-gray-600'}`}>
                            {s}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                              {stageLabels[s]}
                            </div>
                            <div className="text-xs text-gray-500">
                              {s === 1 && 'Demand growth detected — supply unchanged'}
                              {s === 2 && 'Training capacity not responding to demand signal'}
                              {s === 3 && 'Supply-demand gap widening consistently'}
                              {s === 4 && 'Model forecasts shortage in next 6–12 months'}
                              {s === 5 && 'Critical shortage. Immediate intervention required.'}
                            </div>
                          </div>
                          {isCurrent && (
                            <span className={`badge ${cfg.color} bg-transparent border-0 text-xs`}>← Current</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-warning-400" />
                    Recommended Interventions
                  </h3>
                  <div className="space-y-2">
                    {[
                      'Immediately audit existing training capacity for this occupation',
                      'Assess adjacent-skill workforce available for bridge reskilling',
                      'Engage top employers to validate demand persistence',
                      'Open emergency batch at nearest suitable ITI/SSC centre',
                      'Trigger policy simulation for this district-occupation pair',
                    ].map((action, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-primary-400 font-bold text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                        {action}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="btn-primary text-xs px-4 py-2">Open Policy Simulator</button>
                    <button className="btn-secondary text-xs px-4 py-2">Flag for Review</button>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
