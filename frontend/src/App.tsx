import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import Dashboard from './pages/Dashboard'
import DistrictIntelligence from './pages/DistrictIntelligence'
import SkillGapAnalysis from './pages/SkillGapAnalysis'
import ForecastEngine from './pages/ForecastEngine'
import PolicySimulator from './pages/PolicySimulator'
import TrainingOptimizer from './pages/TrainingOptimizer'
import EarlyWarning from './pages/EarlyWarning'
import AIAnalyst from './pages/AIAnalyst'
import CurriculumDrift from './pages/CurriculumDrift'
import EmergingSkills from './pages/EmergingSkills'
import OutcomeTracker from './pages/OutcomeTracker'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-surface-900">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/district" element={<DistrictIntelligence />} />
              <Route path="/skill-gaps" element={<SkillGapAnalysis />} />
              <Route path="/forecast" element={<ForecastEngine />} />
              <Route path="/simulator" element={<PolicySimulator />} />
              <Route path="/training" element={<TrainingOptimizer />} />
              <Route path="/early-warning" element={<EarlyWarning />} />
              <Route path="/ai-analyst" element={<AIAnalyst />} />
              <Route path="/curriculum" element={<CurriculumDrift />} />
              <Route path="/emerging-skills" element={<EmergingSkills />} />
              <Route path="/outcomes" element={<OutcomeTracker />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
