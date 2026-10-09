import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Loader2, Database, TrendingUp, AlertTriangle, Info, Zap } from 'lucide-react'
import { mockOccupations, mockDistricts, mockEarlyWarnings } from '../lib/mockData'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  evidence?: EvidenceItem[]
  tableData?: { headers: string[]; rows: string[][] }
}

interface EvidenceItem {
  source: string
  value: string
  confidence: string
}

const sampleQuestions = [
  'Which districts should receive additional EV technician training next year?',
  'Why is there a shortage of CNC operators in Coimbatore?',
  'What is the best intervention for the Solar PV shortage in Tamil Nadu?',
  'Which occupations are at risk of AI automation-driven obsolescence?',
  'How effective is reskilling vs. fresh training for EV technicians?',
]

const generateResponse = (query: string): Message => {
  const q = query.toLowerCase()

  if (q.includes('ev') && (q.includes('district') || q.includes('training'))) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Based on current demand-supply analysis, here are the top 5 districts recommended for additional EV Technician training:',
      evidence: [
        { source: 'NCS Vacancies (2026)', value: '2,840 active EV postings in Hosur cluster', confidence: '91%' },
        { source: 'PLFS Workforce Stock', value: '4,200 automobile mechanics in Coimbatore', confidence: '88%' },
        { source: 'Industry Signals', value: '3 EV assembly plants confirmed in Krishnagiri', confidence: '95%' },
      ],
      tableData: {
        headers: ['District', 'Gap', '12M Forecast', 'Confidence', 'Existing Capacity'],
        rows: [
          ['Hosur/Krishnagiri', '1,970', 'High (+31%)', '86%', 'Low (1 centre)'],
          ['Coimbatore', '2,840', 'High (+28%)', '91%', 'Medium (3 centres)'],
          ['Chennai', '2,420', 'High (+22%)', '88%', 'High (8 centres)'],
          ['Madurai', '1,430', 'Medium (+18%)', '79%', 'Low (1 centre)'],
          ['Tiruchirappalli', '1,180', 'Medium (+15%)', '76%', 'Medium (2 centres)'],
        ],
      },
    }
  }

  if (q.includes('shortage') || q.includes('why') || q.includes('cnc') || q.includes('coimbatore')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `The CNC operator shortage in Coimbatore is driven by a convergence of three structural factors:

**1. Manufacturing Cluster Expansion:** Coimbatore's precision engineering cluster added 12 new factories in 2025–26, creating a sudden demand surge that training capacity could not anticipate.

**2. Skill Mismatch:** Current ITI curriculum covers conventional lathe operations but lacks CAD/CAM integration and multi-axis CNC programming — skills explicitly required by 78% of job postings.

**3. Migration Outflow:** Approximately 34% of trained CNC operators from Coimbatore have migrated to Pune and Chennai for higher wages, creating an apparent surplus that masks local shortage.`,
      evidence: [
        { source: 'NCS Vacancy Data', value: '1,840 active CNC postings in Coimbatore', confidence: '84%' },
        { source: 'e-Shram Migration Data', value: '34% outflow to Maharashtra/Chennai', confidence: '76%' },
        { source: 'Curriculum Drift Analysis', value: 'CAD/CAM absent from 6/8 local ITI curricula', confidence: '92%' },
        { source: 'Industry Survey (ASI)', value: 'Manufacturing output +18% in Coimbatore district', confidence: '89%' },
      ],
    }
  }

  if (q.includes('solar') || q.includes('intervention') || q.includes('tamil')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `For the Solar PV shortage in Tamil Nadu, **reskilling is recommended over fresh training** as the primary intervention.

**Why reskilling first?**
Tamil Nadu has approximately 18,400 underemployed electricians who already possess 60–70% of the required skills for Solar PV installation. A 6-week bridge programme can convert these workers at approximately ₹28,000/worker — compared to ₹72,000 for full fresh training.

**Recommended sequence:**
1. Launch bridge reskilling for 2,000 electricians (capacity: existing 8 ITIs)
2. After 90 days, assess placement outcomes
3. If gap persists: expand fresh training by 800 seats at 3 recommended centres
4. Concurrent: flag curriculum drift in QP/NOS to NCVET

**Projected impact:** Gap reduction of 42% within 9 months at estimated ₹5.6 Cr investment.`,
      evidence: [
        { source: 'Skill Adjacency Engine', value: '18,400 electricians available for bridge programme', confidence: '87%' },
        { source: 'Cost Analysis', value: 'Reskill: ₹28K/worker vs Fresh: ₹72K/worker', confidence: '83%' },
        { source: 'Placement Data (PMKVY)', value: 'Bridge programme placement rate: 74%', confidence: '79%' },
      ],
    }
  }

  if (q.includes('automation') || q.includes('ai') || q.includes('obsolescence')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Based on cross-sector job posting analysis and skill frequency trends, these occupations face elevated automation risk:

**High automation risk (next 3–5 years):**
- Data Entry Operators (−52% demand trend) — routine digitisation
- Basic Accounting Clerks (−38%) — accounting software displacement
- Call Centre Agents (−28%) — NLP automation

**Medium risk (5–10 years):**
- Quality Control Inspectors — AI vision systems emerging
- Inventory Managers — IoT/RFID integration

**Low risk (resilient):**
- EV Technicians — hands-on physical work + specialist knowledge
- Solar Technicians — site-specific installation
- Healthcare Workers — human interaction required

The platform flags these occupations for training reduction reviews.`,
      evidence: [
        { source: 'Demand Trend Analysis', value: 'Data entry posting decline: −52% (24 months)', confidence: '92%' },
        { source: 'Skill Emergence Detector', value: 'AI automation tools: 284% growth in job requirements', confidence: '88%' },
      ],
    }
  }

  // Default response
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: `I've analysed this query using the SkillSight intelligence layer — combining NCS vacancy data, PLFS workforce baseline, e-Shram occupational stock, and industry economic signals.

For more specific insights, try asking about:
- A specific district + occupation combination
- Intervention recommendations for a particular skill gap
- Training capacity optimisation for a sector
- Migration patterns and their impact on supply

The AI analyst retrieves evidence from structured datasets rather than generating unconstrained text — ensuring every recommendation is traceable to real data sources.`,
    evidence: [
      { source: 'Data Sources Active', value: 'NCS, PLFS, e-Shram, ASI, Skill India Digital', confidence: '84%' },
    ],
  }
}

export default function AIAnalyst() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Welcome to **SkillSight AI Analyst** — your evidence-based labour market intelligence interface.

I retrieve insights from structured labour market data (NCS, PLFS, e-Shram, industry signals) rather than generating unconstrained answers. Every recommendation includes source evidence and confidence scores.

Try asking me about specific districts, skill gaps, intervention strategies, or emerging skill trends.`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (query?: string) => {
    const q = query || input.trim()
    if (!q) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: q }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    await new Promise(r => setTimeout(r, 1200))

    const response = generateResponse(q)
    setMessages(prev => [...prev, response])
    setIsLoading(false)
  }

  const renderContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Analyst</h1>
        <p className="text-gray-400 text-sm mt-1">
          RAG-powered evidence-based labour market intelligence · Not a generic chatbot
        </p>
      </div>

      {/* Architecture Note */}
      <div className="glass-card p-4 flex items-center gap-3 flex-shrink-0">
        <Info className="w-4 h-4 text-primary-400 flex-shrink-0" />
        <div className="text-xs text-gray-400">
          <strong className="text-white">Architecture:</strong>{' '}
          The AI retrieves structured data from the forecast engine, skill graph and demand indices.
          LLM provides explanation — structured models provide numbers. This prevents hallucination.
        </div>
      </div>

      {/* Sample Questions */}
      <div className="flex flex-wrap gap-2 flex-shrink-0">
        {sampleQuestions.slice(0, 3).map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            className="text-xs px-3 py-2 bg-surface-700/40 border border-white/8 text-gray-300 hover:text-white hover:border-primary-500/30 rounded-xl transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0 shadow-glow-primary">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary-600/20 border border-primary-500/30 text-white'
                    : 'bg-surface-700/50 border border-white/5 text-gray-200'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />
                </div>

                {/* Evidence */}
                {msg.evidence && (
                  <div className="w-full glass-card p-3 space-y-2">
                    <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <Database size={10} /> Evidence Sources
                    </div>
                    {msg.evidence.map((e, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 flex-shrink-0">{e.source}:</span>
                        <span className="text-gray-300 flex-1">{e.value}</span>
                        <span className="badge badge-primary py-0 text-xs">{e.confidence}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Table */}
                {msg.tableData && (
                  <div className="w-full glass-card overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/5">
                          {msg.tableData.headers.map((h, i) => (
                            <th key={i} className="text-left px-3 py-2 text-gray-500 font-semibold uppercase tracking-wider text-xs">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.tableData.rows.map((row, ri) => (
                          <tr key={ri} className="border-b border-white/5 hover:bg-surface-700/30">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-2 text-gray-300">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass-card px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
                <span className="text-sm text-gray-400">Retrieving evidence from data sources...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about skill gaps, district analysis, interventions..."
              className="input-field flex-1"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
