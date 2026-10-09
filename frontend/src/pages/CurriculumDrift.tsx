import { useState } from 'react'
import { BookOpen, AlertTriangle, TrendingUp, RefreshCw, ArrowRight, Info } from 'lucide-react'
import { mockCurriculumDrift } from '../lib/mockData'

const urgencyConfig: Record<string, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: 'text-danger-400', bg: 'bg-danger-500/10', border: 'border-danger-500/30' },
  HIGH: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  MEDIUM: { color: 'text-warning-400', bg: 'bg-warning-500/10', border: 'border-warning-500/30' },
}

export default function CurriculumDrift() {
  const [selected, setSelected] = useState(mockCurriculumDrift[0])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Curriculum Drift Detector</h1>
        <p className="text-gray-400 text-sm mt-1">
          Identifies gaps between existing QP/NOS curriculum and skills increasingly demanded in job market
        </p>
      </div>

      <div className="bg-warning-500/10 border border-warning-500/20 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300">
          <strong className="text-white">{mockCurriculumDrift.filter(c => c.urgency === 'CRITICAL').length} Critical</strong> and{' '}
          <strong className="text-white">{mockCurriculumDrift.filter(c => c.urgency === 'HIGH').length} High</strong> curriculum drift alerts detected.
          These qualifications should be flagged to NCVET for immediate revision.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="space-y-3">
          {mockCurriculumDrift.map((c, i) => {
            const cfg = urgencyConfig[c.urgency]
            return (
              <button
                key={i}
                onClick={() => setSelected(c)}
                className={`w-full text-left glass-card p-4 transition-all ${
                  selected.qualification === c.qualification ? `border ${cfg.border} ${cfg.bg}` : 'hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-sm font-medium text-white leading-tight">{c.qualification}</div>
                  <span className={`badge text-xs py-0 flex-shrink-0 ${
                    c.urgency === 'CRITICAL' ? 'badge-danger' :
                    c.urgency === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'badge-warning'
                  }`}>{c.urgency}</span>
                </div>
                <div className="text-xs text-gray-500 mb-3">Last updated: {c.lastUpdated}</div>

                {/* Drift Score */}
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">Drift Score</div>
                  <div className="flex-1 progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${c.driftScore}%`,
                        backgroundColor: c.driftScore > 70 ? '#ef4444' : c.driftScore > 50 ? '#f97316' : '#eab308'
                      }}
                    />
                  </div>
                  <div className={`text-xs font-bold ${cfg.color}`}>{c.driftScore}%</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-5">
          {selected && (() => {
            const cfg = urgencyConfig[selected.urgency]
            return (
              <>
                {/* Header */}
                <div className={`glass-card p-6 border ${cfg.border} ${cfg.bg}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                      <BookOpen className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{selected.qualification}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`badge ${
                          selected.urgency === 'CRITICAL' ? 'badge-danger' :
                          selected.urgency === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          'badge-warning'
                        }`}>{selected.urgency} DRIFT</span>
                        <span className="text-xs text-gray-500">Last revised: {selected.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="ml-auto text-center">
                      <div className={`text-3xl font-bold ${cfg.color}`}>{selected.driftScore}%</div>
                      <div className="text-xs text-gray-500">drift score</div>
                    </div>
                  </div>

                  <div className="progress-bar h-3">
                    <div
                      className="progress-fill h-3"
                      style={{
                        width: `${selected.driftScore}%`,
                        background: selected.driftScore > 70
                          ? 'linear-gradient(90deg, #ef4444, #f87171)'
                          : selected.driftScore > 50
                          ? 'linear-gradient(90deg, #f97316, #fb923c)'
                          : 'linear-gradient(90deg, #eab308, #fbbf24)'
                      }}
                    />
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-danger-400" />
                      Skills Missing from QP/NOS
                    </h3>
                    <div className="space-y-2">
                      {selected.missingSkills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300 py-1 border-b border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-danger-500 flex-shrink-0" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success-400" />
                      Emerging Market Demand
                    </h3>
                    <div className="space-y-2">
                      {selected.emergingDemand.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300 py-1 border-b border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-success-500 flex-shrink-0" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gap Mapping */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-400" />
                    Skill Gap Mapping
                  </h3>
                  <div className="space-y-2">
                    {selected.missingSkills.map((skill, i) => {
                      const emerging = selected.emergingDemand[i] || selected.emergingDemand[0]
                      return (
                        <div key={i} className="flex items-center gap-3 text-xs">
                          <div className="px-3 py-2 bg-danger-500/10 border border-danger-500/20 rounded-lg text-danger-300 flex-1 text-center">
                            {skill} (Missing)
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          <div className="px-3 py-2 bg-success-500/10 border border-success-500/20 rounded-lg text-success-300 flex-1 text-center">
                            {emerging} (Market)
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Action */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-primary-400" />
                    Recommended Actions
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold text-xs mt-0.5">1.</span>
                      Flag QP/NOS for revision with NCVET — include employer evidence from NCS postings
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold text-xs mt-0.5">2.</span>
                      Convene SSC working group to update {selected.missingSkills.length} missing skill modules
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold text-xs mt-0.5">3.</span>
                      Instruct existing training centres to include {selected.emergingDemand[0]} as supplementary module
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="btn-primary text-xs px-4 py-2">Flag to NCVET</button>
                    <button className="btn-secondary text-xs px-4 py-2">Generate Revision Brief</button>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
