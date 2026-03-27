import React, { useState } from 'react'
import { Brain, TrendingUp, TrendingDown, AlertTriangle, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '../../components/ui'
import { DEPT_ROOT_CAUSE } from '../../data/mockData'

const CONFIDENCE_DATA = [
  { category: 'Roads',          confidence: 91, dataPoints: 847 },
  { category: 'Infrastructure', confidence: 84, dataPoints: 412 },
  { category: 'Footpath',       confidence: 78, dataPoints: 201 },
]

export default function RootCausePage() {
  const [expanded, setExpanded] = useState('Roads')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated]   = useState({})

  const handleGenerate = (cat) => {
    setGenerating(true)
    setTimeout(() => {
      setGenerated(prev => ({ ...prev, [cat]: true }))
      setGenerating(false)
    }, 2000)
  }

  return (
    <div className="animate-fade-up" style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Header */}
      <Card style={{ background: 'linear-gradient(135deg, #160A2D, #2D1B69)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--r-lg)', background: 'rgba(107,72,204,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Brain size={28} color="#A78BFA" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', marginBottom: 5 }}>AI Root Cause Analysis</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 560 }}>
              Deep analysis of complaint patterns across all Delhi wards for your department. The AI cross-references complaint data, resolution history, contractor records, and seasonal patterns to identify systemic root causes — not just symptoms.
            </div>
          </div>
        </div>
      </Card>

      {/* Confidence scores */}
      <Card>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>Analysis Confidence</div>
        <div style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 16 }}>Based on complaint volume and historical data quality</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONFIDENCE_DATA.map(cd => (
            <div key={cd.category} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)', width: 120, flexShrink: 0 }}>{cd.category}</span>
              <div style={{ flex: 1, height: 8, background: 'var(--canvas-warm)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${cd.confidence}%`, background: cd.confidence >= 85 ? 'var(--green)' : cd.confidence >= 70 ? 'var(--amber)' : 'var(--red)', borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', width: 44, textAlign: 'right' }}>{cd.confidence}%</span>
              <span style={{ fontSize: 10, color: 'var(--ink-light)', width: 80 }}>{cd.dataPoints} data pts</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Root cause cards */}
      {DEPT_ROOT_CAUSE.map(rc => {
        const isExp  = expanded === rc.category
        const isGen  = generated[rc.category]
        const isGening = generating && expanded === rc.category

        return (
          <Card key={rc.category} style={{ borderLeft: `4px solid ${rc.severity === 'high' ? 'var(--red)' : 'var(--amber)'}`, cursor: 'pointer' }} onClick={() => setExpanded(isExp ? null : rc.category)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{rc.category}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: rc.trend.startsWith('+') ? 'var(--red)' : 'var(--green)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    {rc.trend.startsWith('+') ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {rc.trend}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: rc.severity === 'high' ? 'var(--red)' : 'var(--amber)', background: rc.severity === 'high' ? 'var(--red-pale)' : 'var(--amber-pale)', padding: '2px 8px', borderRadius: 99 }}>{rc.severity.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{rc.rootCause}</div>
              </div>
              {isExp ? <ChevronUp size={16} color="var(--ink-light)" /> : <ChevronDown size={16} color="var(--ink-light)" />}
            </div>

            {isExp && (
              <div style={{ marginTop: 18, animation: 'fadeIn 0.2s ease' }}>
                {/* Recommendation */}
                <div style={{ background: 'var(--blue-pale)', borderRadius: 'var(--r-md)', padding: '14px 16px', borderLeft: '3px solid var(--blue)', marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>AI Recommendation</div>
                  <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.6 }}>{rc.recommendation}</div>
                </div>

                {/* AI deep dive */}
                {isGen && (
                  <div style={{ background: 'var(--purple-pale)', borderRadius: 'var(--r-md)', padding: '14px 16px', borderLeft: '3px solid var(--purple)', marginBottom: 14, animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Deep Dive Analysis</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.75 }}>
                      Cross-referencing 6-month complaint data with weather patterns, contractor performance logs, and MCD budget cycles reveals a clear seasonal spike in {rc.category} complaints between October and February. This aligns with post-monsoon road surface damage compounded by contractor delays.
                      <br /><br />
                      Top 3 contributing factors identified:
                      <br />1. Contractor ABC Ltd. has a 68% SLA breach rate — significantly above department average of 18%
                      <br />2. Budget allocation concentrated in Q1 leaves Q3-Q4 under-resourced
                      <br />3. Preventive maintenance schedules are not being followed in Central and North zones
                      <br /><br />
                      Recommended intervention: Terminate contractor ABC Ltd. contract (Clause 14.2), redistribute budget allocation, implement mandatory bi-monthly preventive inspection schedule.
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {!isGen && (
                    <button onClick={(e) => { e.stopPropagation(); handleGenerate(rc.category) }} disabled={isGening} style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, padding: '10px', background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: isGening ? 'wait' : 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, justifyContent: 'center' }}>
                      <Brain size={14} /> {isGening ? 'Analysing…' : 'Run Deep Analysis'}
                    </button>
                  )}
                  <button onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, padding: '10px', background: 'var(--green-pale)', color: 'var(--green)', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, justifyContent: 'center' }}>
                    <FileText size={14} /> Draft Action Order
                  </button>
                  {rc.severity === 'high' && (
                    <button onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, padding: '10px', background: 'var(--red-pale)', color: 'var(--red)', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, justifyContent: 'center' }}>
                      <AlertTriangle size={14} /> Flag to DC
                    </button>
                  )}
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}