import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, MapPin, BarChart3, TrendingUp, Sliders,
  Building2, AlertTriangle, Bot, BookOpen, Sparkles, Target,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'National Command', badge: null },
  { path: '/district', icon: MapPin, label: 'District Intelligence', badge: '94' },
  { path: '/skill-gaps', icon: BarChart3, label: 'Skill Gap Analysis', badge: null },
  { path: '/forecast', icon: TrendingUp, label: 'Forecast Engine', badge: null },
  { path: '/early-warning', icon: AlertTriangle, label: 'Early Warning', badge: '5', badgeColor: 'danger' },
  { path: '/simulator', icon: Sliders, label: 'Policy Simulator', badge: null },
  { path: '/training', icon: Building2, label: 'Training Optimizer', badge: null },
  { path: '/curriculum', icon: BookOpen, label: 'Curriculum Drift', badge: '3', badgeColor: 'warning' },
  { path: '/emerging-skills', icon: Sparkles, label: 'Emerging Skills', badge: null },
  { path: '/ai-analyst', icon: Bot, label: 'AI Analyst', badge: null },
  { path: '/outcomes', icon: Target, label: 'Outcome Tracker', badge: null },
]

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} flex flex-col bg-surface-800/80 backdrop-blur-xl border-r border-white/5 transition-all duration-300 relative flex-shrink-0`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-glow-primary">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <div className="font-bold text-white text-sm leading-tight">SkillSight</div>
            <div className="text-xs text-primary-400 font-medium">AI Labour Intelligence</div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold px-2 py-2 mb-1">
            Intelligence
          </div>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium group relative
              ${isActive
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:text-white hover:bg-surface-600/50'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    item.badgeColor === 'danger' ? 'bg-danger-500/20 text-danger-400' :
                    item.badgeColor === 'warning' ? 'bg-warning-500/20 text-warning-400' :
                    'bg-primary-500/20 text-primary-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {/* Tooltip for collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-surface-700 border border-white/10 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-white/5">
          <div className="glass-card p-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Data Updated</span>
              <span className="text-success-500 font-medium">● Live</span>
            </div>
            <div className="text-xs text-gray-500">724 districts • 28 states</div>
            <div className="text-xs text-gray-600">v2.0.0 · SIH 2026</div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-surface-700 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-600 transition-all z-10 shadow-lg"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  )
}
