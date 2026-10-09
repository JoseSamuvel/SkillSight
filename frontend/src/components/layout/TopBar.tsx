import { useState } from 'react'
import { Bell, Search, Globe, User, Menu, Download, RefreshCw } from 'lucide-react'
import { mockEarlyWarnings } from '../../lib/mockData'

interface TopBarProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const [lang, setLang] = useState('EN')
  const [showNotifs, setShowNotifs] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const criticalWarnings = mockEarlyWarnings.filter(w => w.severity === 'CRITICAL' || w.severity === 'HIGH')

  const langOptions = ['EN', 'HI', 'TA', 'TE', 'KA']

  return (
    <header className="h-14 bg-surface-800/60 backdrop-blur-xl border-b border-white/5 flex items-center px-6 gap-4 flex-shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onToggleSidebar}
        className="text-gray-400 hover:text-white transition-colors md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search districts, skills, occupations..."
          className="w-full bg-surface-700/50 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Data refresh indicator */}
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-surface-700/30 hover:bg-surface-600/50 rounded-lg transition-all border border-white/5">
          <RefreshCw size={12} className="animate-spin-slow" />
          <span className="hidden sm:block">Live Data</span>
          <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
        </button>

        {/* Language switcher */}
        <div className="relative">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-surface-700/30 hover:bg-surface-600/50 rounded-lg transition-all border border-white/5"
          >
            <Globe size={12} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-current cursor-pointer focus:outline-none"
            >
              {langOptions.map(l => <option key={l} value={l} className="bg-surface-800">{l}</option>)}
            </select>
          </button>
        </div>

        {/* Export */}
        <button className="p-2 text-gray-400 hover:text-white hover:bg-surface-600/50 rounded-lg transition-all border border-white/5">
          <Download size={15} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false) }}
            className="relative p-2 text-gray-400 hover:text-white hover:bg-surface-600/50 rounded-lg transition-all border border-white/5"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card z-50 animate-slide-down p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                <span className="text-sm font-semibold text-white">Early Warnings</span>
                <span className="badge-danger text-xs">{criticalWarnings.length} Active</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {criticalWarnings.map(w => (
                  <div key={w.id} className="px-4 py-3 hover:bg-surface-700/50 border-b border-white/5 transition-colors">
                    <div className="flex items-start gap-2">
                      <span className={`glow-dot mt-1.5 ${w.severity === 'CRITICAL' ? 'bg-danger-500' : 'bg-warning-500'}`} />
                      <div>
                        <div className="text-xs font-medium text-white">{w.district} · {w.occupation}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{w.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false) }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-surface-600/50 rounded-lg transition-all border border-white/5"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <User size={12} className="text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-medium text-white">MSDE Planner</div>
              <div className="text-xs text-gray-500">National Admin</div>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-card z-50 animate-slide-down py-2">
              {['Dashboard', 'Settings', 'API Access', 'Export Data', 'Sign Out'].map(item => (
                <button key={item} className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-surface-600/50 text-left transition-colors">
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
