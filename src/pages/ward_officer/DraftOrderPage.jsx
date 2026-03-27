import React, { useState } from 'react'
import { FileText, Send, Edit3, CheckCircle, Plus, Download } from 'lucide-react'
import { Card, Badge } from '../../components/ui'
import { DRAFT_ORDERS } from '../../data/mockData'

export default function DraftOrdersPage() {
  const [orders, setOrders]   = useState(DRAFT_ORDERS)
  const [editing, setEditing] = useState(null)
  const [editText, setEditText] = useState('')
  const [sent, setSent]       = useState([])

  const startEdit = (o) => { setEditing(o.id); setEditText(o.draft) }
  const saveEdit  = (id) => { setOrders(prev => prev.map(o => o.id === id ? { ...o, draft: editText } : o)); setEditing(null) }
  const sendOrder = (id) => { setSent(prev => [...prev, id]) }

  const NEW_TEMPLATES = [
    { type: 'Emergency Sanitation Order', target: 'MCD Zone Officer' },
    { type: 'PWD Repair Requisition',     target: 'PWD Executive Engineer' },
    { type: 'Water Board Notice',         target: 'Water Board Zone-B' },
    { type: 'Escalation to Zonal Officer',target: 'Zonal Commissioner' },
  ]

  return (
    <div className="animate-fade-up" style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <Card style={{ background: 'linear-gradient(135deg, #0D1B2A, #1A2F45)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white', marginBottom: 4 }}>AI-Drafted Orders & Requisitions</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 480 }}>The AI automatically prepares official orders for clustered complaints. Review, edit, and send directly to department officers. All orders are legally formatted under Delhi Municipal Act.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--saffron)', lineHeight: 1 }}>{orders.length}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Drafts ready</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--green)', lineHeight: 1 }}>{sent.length}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Sent today</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Draft cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {orders.map(o => {
          const isSent  = sent.includes(o.id)
          const isEdit  = editing === o.id
          return (
            <Card key={o.id} style={{ borderLeft: `4px solid ${isSent ? 'var(--green)' : 'var(--saffron)'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <FileText size={14} color={isSent ? 'var(--green)' : 'var(--saffron)'} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{o.type}</span>
                    {isSent && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', background: 'var(--green-pale)', padding: '2px 8px', borderRadius: 99 }}>✓ SENT</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>To: <strong style={{ color: 'var(--ink)' }}>{o.target}</strong> · Re: <strong style={{ color: 'var(--ink)' }}>{o.complaint}</strong></div>
                </div>
                {!isSent && (
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => startEdit(o)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: 'var(--border)', borderRadius: 'var(--r-md)', background: 'var(--canvas)', cursor: 'pointer', fontSize: 11, color: 'var(--ink-light)', fontFamily: 'var(--font-body)' }}>
                      <Edit3 size={11} /> Edit
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: 'var(--border)', borderRadius: 'var(--r-md)', background: 'var(--canvas)', cursor: 'pointer', fontSize: 11, color: 'var(--ink-light)', fontFamily: 'var(--font-body)' }}>
                      <Download size={11} /> PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Draft body */}
              <div style={{ background: 'var(--canvas)', borderRadius: 'var(--r-md)', padding: '14px 16px', marginBottom: isSent ? 0 : 14, border: 'var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8, color: isSent ? 'var(--ink-light)' : 'var(--ink)' }}>
                {isEdit ? (
                  <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={6} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8, color: 'var(--ink)', resize: 'vertical' }} />
                ) : (
                  o.draft
                )}
              </div>

              {!isSent && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {isEdit ? (
                    <>
                      <button onClick={() => saveEdit(o.id)} style={{ flex: 1, padding: '9px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                        <CheckCircle size={14} /> Save Changes
                      </button>
                      <button onClick={() => setEditing(null)} style={{ padding: '9px 16px', background: 'var(--canvas)', border: 'var(--border)', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--ink-light)' }}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => sendOrder(o.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, padding: '10px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, justifyContent: 'center' }}>
                      <Send size={14} /> Send to {o.target}
                    </button>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* New order templates */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-light)', marginBottom: 10 }}>Generate New Order</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {NEW_TEMPLATES.map(t => (
            <button key={t.type} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-lg)', cursor: 'pointer', textAlign: 'left', transition: 'all var(--t-fast)', fontFamily: 'var(--font-body)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(13,27,42,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', background: 'var(--saffron-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plus size={15} color="var(--saffron)" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{t.type}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-light)' }}>To: {t.target}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}