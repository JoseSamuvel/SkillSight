import { useState } from 'react'
import { Sparkles, TrendingUp, Layers, Globe, ChevronRight, ArrowUpRight, Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { mockSkillEmergingData } from '../lib/mockData'

const stageColors: Record<string, { color: string; bg: string; border: string }> = {
  EMERGING: { color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/30' },
  GROWING: { color: 'text-success-400', bg: 'bg-success-500/10', border: 'border-success-500/30' },
  ESTABLISHED: { color: 'text-gray-400', bg: 'bg-surface-700/50', border: 'border-white/10' },
}

const barColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e0e7ff', '#f0f9ff', '#06b6d4', '#22c55e']

export default function EmergingSkills() {
  const [selected, setSelected] = useState(mockSkillEmergingData[0])
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL' ? mockSkillEmergingData : mockSkillEmergingData.filter(s => s.stage === filter)

  const chartData = mockSkillEmergingData.map(s => ({
    name: s.skill.length > 22 ? s.skill.slice(0, 22) + '…' : s.skill,
    growth: s.growth,
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Emerging Skill Detector</h1>
        <p className="text-gray-400 text-sm mt-1">
          Detects new skills rising across job postings before they appear in formal curricula
        </p>
      </div>

      {/* Detection Pipeline */}
      <div className="glass-card p-5">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">Detection Pipeline</div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            'New Skill Appears', 'Growing Across Postings', 'Multi-Sector Spread',
            'Employer Diversity ↑', 'Economic Signals Align', '→ Classified as EMERGING'
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className={`px-3 py-2 rounded-xl text-xs font-medium border ${
                i === 5
                  ? 'bg-primary-600/20 border-primary-500/30 text-primary-400 font-bold'
                  : 'bg-surface-700/40 border-white/5 text-gray-300'
              }`}>
                {step}
              </div>
              {i < 5 && <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Growth Chart */}
      <div className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-4">Skill Demand Growth (% YoY)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `+${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#d1d5db', fontSize: 9 }} width={150} />
            <Tooltip
              contentStyle={{ background: '#141c36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              formatter={(v: any) => [`+${v}%`, 'Demand Growth']}
            />
            <Bar dataKey="growth" radius={[0, 6, 6, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['ALL', 'EMERGING', 'GROWING', 'ESTABLISHED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === f
                ? 'bg-primary-600/20 border-primary-500/40 text-primary-400'
                : 'bg-surface-700/30 border-white/5 text-gray-400 hover:border-white/15'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((skill, i) => {
          const cfg = stageColors[skill.stage]
          const isSelected = selected.skill === skill.skill
          return (
            <button
              key={i}
              onClick={() => setSelected(skill)}
              className={`glass-card p-5 text-left hover:border-white/20 transition-all ${
                isSelected ? `border ${cfg.border} ${cfg.bg}` : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-white">{skill.skill}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {skill.sectors.map(s => (
                      <span key={s} className="badge bg-surface-600/50 text-gray-400 border border-white/10 text-xs py-0">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-2xl font-bold text-success-400">+{skill.growth}%</div>
                  <div className="text-xs text-gray-500">YoY growth</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`badge ${
                  skill.stage === 'EMERGING' ? 'badge-primary' :
                  skill.stage === 'GROWING' ? 'badge-success' : 'bg-surface-600/50 text-gray-400 border border-white/10'
                }`}>
                  <Sparkles size={10} />
                  {skill.stage}
                </span>
                <div className="progress-bar w-24">
                  <div
                    className="progress-fill bg-primary-500"
                    style={{ width: `${Math.min((skill.growth / 300) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Cross-Sector Spread */}
      {selected && (
        <div className="glass-card p-6 animate-scale-in">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary-400" />
            Cross-Sector Spread: {selected.skill}
          </h2>
          <div className="flex flex-wrap gap-3">
            {selected.sectors.map((sector, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-primary-400" />
                <span className="text-sm text-primary-300 font-medium">{sector}</span>
                <ArrowUpRight className="w-3 h-3 text-primary-400" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-surface-700/30 rounded-xl text-xs text-gray-400">
            <strong className="text-white">Training Recommendation:</strong>{' '}
            This skill should be incorporated as a supplementary module in existing related qualifications.
            Cross-sector demand indicates high employment flexibility for trained workers.
            Estimated time-to-curriculum integration: 3–6 months via NCVET fast-track.
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn-primary text-xs px-4 py-2">Add to Watch List</button>
            <button className="btn-secondary text-xs px-4 py-2">Notify SSC Partners</button>
          </div>
        </div>
      )}
    </div>
  )
}
