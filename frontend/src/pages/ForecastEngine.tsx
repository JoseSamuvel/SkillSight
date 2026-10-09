import { useState } from 'react'
import {
  TrendingUp, Activity, ChevronDown, AlertTriangle, Info,
  CheckCircle2, Brain, BarChart2
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { mockOccupations, mockDistricts } from '../lib/mockData'

const generateForecastDetail = (_occupation: string) => {
  const base = Math.floor(Math.random() * 3000) + 2000
  return Array.from({ length: 12 }, (_, i) => ({
    period: `Q${(i % 4) + 1} ${2025 + Math.floor(i / 4)}`,
    demand: base + i * 400 + Math.random() * 300,
    supply: base * 0.6 + i * 100 + Math.random() * 200,
    forecast: i >= 8,
    upper: base + i * 400 + 1200,
    lower: base + i * 400 - 600,
  }))
}

const modelComponents = [
  { name: 'ARIMA/SARIMA', weight: '25%', description: 'Captures seasonality & autocorrelation in vacancy time series' },
  { name: 'XGBoost', weight: '30%', description: 'Handles non-linear relationships between economic signals and demand' },
  { name: 'ETS Smoothing', weight: '20%', description: 'Exponential smoothing for trend & seasonal decomposition' },
  { name: 'Hierarchical Shrinkage', weight: '15%', description: 'Borrows strength from state/national level for sparse districts' },
  { name: 'LightGBM', weight: '10%', description: 'Gradient boosting for multi-variate feature importance' },
]

export default function ForecastEngine() {
  const [selectedOccupation, setSelectedOccupation] = useState(mockOccupations[0].title)
  const [selectedDistrict, setSelectedDistrict] = useState(mockDistricts[0].name)
  const [horizon, setHorizon] = useState('4Q')
  const [showModelDetails, setShowModelDetails] = useState(false)

  const forecastData = generateForecastDetail(selectedOccupation)
  const forecastOnly = forecastData.filter(d => d.forecast)
  const projected12Month = forecastOnly[forecastOnly.length - 1]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Forecast Engine</h1>
        <p className="text-gray-400 text-sm mt-1">Ensemble ML forecasting with hierarchical shrinkage and uncertainty quantification</p>
      </div>

      {/* Controls */}
      <div className="glass-card p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Occupation</label>
            <select
              value={selectedOccupation}
              onChange={e => setSelectedOccupation(e.target.value)}
              className="select-field text-sm w-52"
            >
              {mockOccupations.map(o => <option key={o.id}>{o.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">District</label>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="select-field text-sm w-48"
            >
              {mockDistricts.map(d => <option key={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Forecast Horizon</label>
            <div className="flex">
              {['2Q', '4Q', '8Q'].map(h => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-4 py-2 text-sm font-medium border transition-all ${
                    horizon === h
                      ? 'bg-primary-600 border-primary-500 text-white'
                      : 'bg-surface-700/50 border-white/10 text-gray-400 hover:text-white'
                  } ${h === '2Q' ? 'rounded-l-xl' : h === '8Q' ? 'rounded-r-xl' : ''}`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setShowModelDetails(!showModelDetails)}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <Brain size={14} />
              Model Details
              <ChevronDown size={14} className={`transition-transform ${showModelDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {showModelDetails && (
          <div className="mt-5 pt-5 border-t border-white/5 animate-slide-down">
            <div className="text-xs text-gray-400 mb-3 font-medium">Ensemble Model Composition</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {modelComponents.map((m, i) => (
                <div key={i} className="bg-surface-700/30 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{m.name}</span>
                    <span className="text-xs text-primary-400 font-bold">{m.weight}</span>
                  </div>
                  <p className="text-xs text-gray-500">{m.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-primary-500/10 rounded-xl border border-primary-500/20">
              <div className="flex items-center gap-2 text-xs text-primary-400">
                <Info size={12} />
                <span className="font-medium">Hierarchical Forecasting:</span>
                <span className="text-gray-400">
                  When district-level data is sparse (&lt;30 observations), the model borrows information from state → national levels via shrinkage logic, preventing over-fitting on thin data.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forecast Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Projected 12M Demand',
            value: projected12Month ? Math.round(projected12Month.demand).toLocaleString() : '—',
            sub: 'Forecast',
            icon: TrendingUp, color: 'text-primary-400', bg: 'bg-primary-500/10'
          },
          {
            label: 'Projected 12M Supply',
            value: projected12Month ? Math.round(projected12Month.supply).toLocaleString() : '—',
            sub: 'Effective',
            icon: Activity, color: 'text-success-400', bg: 'bg-success-500/10'
          },
          {
            label: 'Projected Gap (12M)',
            value: projected12Month ? Math.round(projected12Month.demand - projected12Month.supply).toLocaleString() : '—',
            sub: 'Shortage',
            icon: AlertTriangle, color: 'text-danger-400', bg: 'bg-danger-500/10'
          },
          {
            label: '80% Confidence Interval',
            value: projected12Month
              ? `±${Math.round((projected12Month.upper - projected12Month.lower) / 2).toLocaleString()}`
              : '—',
            sub: 'Range',
            icon: BarChart2, color: 'text-warning-400', bg: 'bg-warning-500/10'
          },
        ].map((s, i) => (
          <div key={i} className="metric-card">
            <div className={`card-icon ${s.bg} mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            <div className="text-xs text-gray-600">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Forecast Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">
              {selectedOccupation} · {selectedDistrict}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Historical + forecast with 80% confidence interval · Dashed = projected period
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="glow-dot bg-success-500" />
            <span className="text-xs text-gray-400">Model MAE: 4.2% · Backtest MAPE: 6.1%</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="forecastDemand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastSupply" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(1)}K`} />
            <Tooltip contentStyle={{ background: '#141c36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
            <ReferenceLine x="Q1 2027" stroke="rgba(99,102,241,0.5)" strokeDasharray="4 4" label={{ value: 'Forecast Start', fill: '#818cf8', fontSize: 10 }} />
            <Area type="monotone" dataKey="upper" name="CI Upper" stroke="transparent" fill="url(#ciGrad)" />
            <Area type="monotone" dataKey="lower" name="CI Lower" stroke="transparent" fill="rgba(255,255,255,0)" />
            <Area type="monotone" dataKey="demand" name="Demand" stroke="#6366f1" strokeWidth={2.5} fill="url(#forecastDemand)" strokeDasharray="0" />
            <Area type="monotone" dataKey="supply" name="Effective Supply" stroke="#22c55e" strokeWidth={2} fill="url(#forecastSupply)" />
          </AreaChart>
        </ResponsiveContainer>

        {/* Confidence note */}
        <div className="mt-4 p-3 bg-surface-700/30 rounded-xl text-xs text-gray-400 flex items-start gap-2">
          <Info size={12} className="mt-0.5 text-primary-400 flex-shrink-0" />
          <div>
            <strong className="text-white">Forecast Uncertainty:</strong>{' '}
            Shaded region represents the 80% confidence interval. District-level forecasts use hierarchical shrinkage when local data points &lt;30.
            Never interpret point forecasts as facts — always review alongside confidence interval.
          </div>
        </div>
      </div>

      {/* Backtesting Results */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-success-400" />
          <h2 className="text-base font-semibold text-white">Backtesting Validation</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Model trained on data available up to the cutoff date, then compared against actual observations.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'MAPE (Backtest)', value: '6.1%', good: true },
            { label: 'RMSE', value: '312', good: true },
            { label: 'Interval Coverage', value: '83.4%', good: true },
            { label: 'Training Periods', value: '3 (2023–2025)', good: true },
          ].map((m, i) => (
            <div key={i} className="bg-surface-700/30 rounded-xl p-4 text-center">
              <div className={`text-xl font-bold ${m.good ? 'text-success-400' : 'text-warning-400'}`}>{m.value}</div>
              <div className="text-xs text-gray-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
