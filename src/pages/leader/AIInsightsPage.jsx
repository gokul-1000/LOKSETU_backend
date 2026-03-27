import React, { useState } from 'react'
import { Brain, X } from 'lucide-react'
import { Card, SectionHeader, Badge, Button } from '../../components/ui'
import { AI_INSIGHTS, KPI_STATS } from '../../data/mockData'

const TYPE_TABS = ['All', 'Pattern', 'Prediction', 'Sentiment', 'Rootcause']
const TYPE_ICONS  = { pattern: '⬡', prediction: '◈', sentiment: '◉', rootcause: '◎' }
const SEV_COLOR   = { critical: 'var(--red)', warning: 'var(--amber)', info: 'var(--blue-light)' }
const SEV_VARIANT = { critical: 'escalated', warning: 'pending', info: 'blue' }

const InsightCard = ({ insight: ins, onDismiss }) => {
  const color = SEV_COLOR[ins.severity]
  return (
    <div style={{
      background: 'var(--surface)', border: 'var(--border)',
      borderLeft: `4px solid ${color}`,
      borderRadius: 'var(--r-lg)', padding: 20,
      boxShadow: 'var(--shadow-xs)', transition: 'box-shadow var(--t-base)',
      animation: 'fadeIn 0.35s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-xs)'}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color, flexShrink: 0 }}>
            {TYPE_ICONS[ins.type]}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
              <Badge variant={SEV_VARIANT[ins.severity]}>{ins.severity}</Badge>
              <Badge variant="default" size="sm">{ins.type}</Badge>
              {ins.actionable && <Badge variant="teal" size="sm">Actionable</Badge>}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{ins.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: 'var(--ink-light)', whiteSpace: 'nowrap' }}>
            {Math.round((Date.now() - new Date(ins.timestamp)) / 3600000)}h ago
          </span>
          <button onClick={() => onDismiss(ins.id)} style={{ all: 'unset', cursor: 'pointer', color: 'var(--ink-light)', display: 'flex', padding: 2 }}>
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <p style={{ fontSize: 13, color: 'var(--ink-light)', lineHeight: 1.65, marginBottom: 14 }}>{ins.body}</p>

      {/* Confidence bar + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ height: 4, width: 80, background: 'var(--canvas-warm)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${ins.confidence}%`, background: color, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>{ins.confidence}% confidence</span>
        </div>
        {ins.actionable && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" size="sm">Dismiss</Button>
            <Button variant="primary" size="sm" style={{ background: color }}>
              ✦ Take Action
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [dismissed, setDismissed] = useState([])

  const dismiss = (id) => setDismissed(prev => [...prev, id])

  const visible = AI_INSIGHTS
    .filter(i => !dismissed.includes(i.id))
    .filter(i => activeTab === 'All' || i.type === activeTab.toLowerCase())

  const critCount = AI_INSIGHTS.filter(i => i.severity === 'critical' && !dismissed.includes(i.id)).length
  const actionCount = AI_INSIGHTS.filter(i => i.actionable && !dismissed.includes(i.id)).length
  const avgConf = Math.round(AI_INSIGHTS.reduce((s, i) => s + i.confidence, 0) / AI_INSIGHTS.length)

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

      {/* Engine header card */}
      <Card style={{ background: 'var(--ink)', borderColor: 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-lg)', background: 'rgba(107,72,204,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={24} color="#A78BFA" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 3 }}>AI Intelligence Engine</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Continuously scanning for patterns, anomalies, and predictive signals across all grievance data</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[[visible.length, 'Insights Today'], [actionCount, 'Actionable'], [`${avgConf}%`, 'Avg Confidence']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', color: 'white', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 3, letterSpacing: '0.05em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tab filter */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {TYPE_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '5px 14px', borderRadius: 'var(--r-full)', fontSize: 12,
            fontWeight: activeTab === t ? 600 : 400,
            background: activeTab === t ? 'var(--ink)' : 'transparent',
            color: activeTab === t ? 'white' : 'var(--ink-light)',
            border: 'var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)',
            transition: 'all var(--t-fast)',
          }}>{t}{t === 'All' ? ` (${visible.length})` : ''}</button>
        ))}
        {dismissed.length > 0 && (
          <button onClick={() => setDismissed([])} style={{ marginLeft: 'auto', all: 'unset', cursor: 'pointer', fontSize: 12, color: 'var(--blue-light)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Restore {dismissed.length} dismissed
          </button>
        )}
      </div>

      {/* Insight feed */}
      {visible.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--ink-light)' }}>
            <Brain size={36} style={{ opacity: 0.2, marginBottom: 12 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', marginBottom: 6 }}>All caught up</div>
            <div style={{ fontSize: 13 }}>No insights in this category right now.</div>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.map(ins => <InsightCard key={ins.id} insight={ins} onDismiss={dismiss} />)}
        </div>
      )}
    </div>
  )
}
