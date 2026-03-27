import React, { useState } from 'react'
import { BookOpen, Shield, Clock, ChevronRight, FileText, AlertCircle } from 'lucide-react'
import { Card, Badge } from '../../components/ui'
import { RTI_TOPICS } from '../../data/mockData'

const QUICK_GUIDES = [
  { title: 'What is RTI?', body: 'The Right to Information Act 2005 gives every citizen the right to request information from any government department within 30 days. If your complaint is unresolved, file an RTI to know why.', icon: '📋' },
  { title: 'How to file RTI online', body: 'Go to rtionline.gov.in → Select Public Authority → State your information request → Pay ₹10 fee (BPL citizens exempt) → Track your application.', icon: '💻' },
  { title: 'First Appellate Authority', body: 'If your RTI is rejected or ignored, appeal to the First Appellate Authority within 30 days. If still unresolved, approach the State Information Commission.', icon: '⚖️' },
]

export default function RTIPage() {
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')

  const filtered = RTI_TOPICS.filter(t =>
    !query || t.title.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="animate-fade-up" style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2F45 100%)', borderRadius: 'var(--r-xl)', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Know Your Rights</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'white', marginBottom: 8, lineHeight: 1.2 }}>RTI & Civic Entitlements</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 420 }}>Every Delhi citizen has guaranteed service levels. If the government fails to meet them, you have legal remedies — RTI, appeals, and compensation claims.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          {[['₹10', 'RTI filing fee'], ['30 days', 'Response time'], ['Free', 'for BPL citizens']].map(([v, l]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--saffron)', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick guides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {QUICK_GUIDES.map(g => (
          <Card key={g.title} hover style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{g.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>{g.title}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-light)', lineHeight: 1.65 }}>{g.body}</div>
          </Card>
        ))}
      </div>

      {/* Your rights list */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 2 }}>Your Service Level Guarantees</div>
            <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Legal entitlements for every Delhi citizen — click any to learn more</div>
          </div>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search rights…" style={{ padding: '7px 14px', border: 'var(--border)', borderRadius: 'var(--r-full)', fontSize: 12, fontFamily: 'var(--font-body)', outline: 'none', width: 180 }}
            onFocus={e => e.target.style.borderColor = 'var(--blue-light)'}
            onBlur={e  => e.target.style.borderColor = 'rgba(13,27,42,0.08)'} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(t => (
            <div key={t.id} onClick={() => setSelected(selected === t.id ? null : t.id)}
              style={{ background: 'var(--surface)', border: `1px solid ${selected === t.id ? 'var(--blue)' : 'rgba(13,27,42,0.08)'}`, borderRadius: 'var(--r-lg)', padding: '16px 18px', cursor: 'pointer', transition: 'all var(--t-base)', boxShadow: selected === t.id ? 'var(--shadow-md)' : 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <Shield size={14} color="var(--blue)" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{t.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--ink-light)' }}>
                      <Clock size={11} /> SLA: <strong style={{ color: 'var(--ink)' }}>{t.sla}</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>Act: <strong style={{ color: 'var(--blue)' }}>{t.act}</strong></div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--ink-light)" style={{ transition: 'transform var(--t-fast)', transform: selected === t.id ? 'rotate(90deg)' : 'none' }} />
              </div>

              {selected === t.id && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: 'var(--border)', animation: 'fadeIn 0.2s ease' }}>
                  <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: 14 }}>{t.desc}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                      <FileText size={12} /> File RTI
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'var(--canvas)', color: 'var(--ink)', border: 'var(--border)', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)' }}>
                      <AlertCircle size={12} /> Escalate My Complaint
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RTI chatbot teaser */}
      <Card style={{ background: 'var(--blue-pale)', border: '1px solid rgba(26,75,140,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue)', marginBottom: 4 }}>Have an RTI question?</div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>Ask our AI assistant — it knows Delhi's civic laws, SLAs, and can help you draft an RTI application in minutes.</div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, flexShrink: 0 }}>
            Ask AI <ChevronRight size={14} />
          </button>
        </div>
      </Card>
    </div>
  )
}