import React, { useState } from 'react'
import { Layers, AlertTriangle, ChevronDown, ChevronUp, FileText, ArrowRight } from 'lucide-react'
import { Card, Badge } from '../../components/ui'
import { COMPLAINT_CLUSTERS, WARD_COMPLAINTS } from '../../data/mockData'

const urgencyColor = u => u >= 8 ? 'var(--red)' : u >= 6 ? 'var(--amber)' : 'var(--blue)'
const urgencyBg    = u => u >= 8 ? 'var(--red-pale)' : u >= 6 ? 'var(--amber-pale)' : 'var(--blue-pale)'

export default function ClustersPage() {
  const [expanded, setExpanded] = useState('cl1')

  return (
    <div className="animate-fade-up" style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Explainer */}
      <Card style={{ background: 'linear-gradient(135deg, #1A0A3D, #2D1B69)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 'var(--r-lg)', background: 'rgba(107,72,204,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Layers size={24} color="#A78BFA" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', marginBottom: 4 }}>AI Grouped Problems</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>The AI automatically groups similar complaints from the same area into clusters. Instead of treating them individually, address them with a single coordinated action — faster resolution, lower SLA breach risk.</div>
          </div>
        </div>
      </Card>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Active Clusters',   value: COMPLAINT_CLUSTERS.length,                                    color: 'var(--purple)' },
          { label: 'Complaints Grouped', value: COMPLAINT_CLUSTERS.reduce((s, c) => s + c.count, 0),          color: 'var(--blue)'   },
          { label: 'Potential SLA Saves', value: '~' + COMPLAINT_CLUSTERS.reduce((s, c) => s + c.count, 0) + ' complaints', color: 'var(--green)' },
        ].map(({ label, value, color }) => (
          <Card key={label} style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontFamily: 'var(--font-display)', color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Cluster cards */}
      {COMPLAINT_CLUSTERS.map(cl => {
        const isExp = expanded === cl.id
        const related = WARD_COMPLAINTS.filter(c => cl.wards.includes(c.ward) && cl.category === c.category)

        return (
          <Card key={cl.id} style={{ borderLeft: `4px solid ${urgencyColor(cl.urgency)}`, cursor: 'pointer' }} onClick={() => setExpanded(isExp ? null : cl.id)}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: urgencyColor(cl.urgency), background: urgencyBg(cl.urgency), padding: '2px 8px', borderRadius: 99 }}>{cl.count} complaints</span>
                  <Badge variant={cl.status}>{cl.status}</Badge>
                  <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>{cl.category}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 6 }}>{cl.summary}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>Wards: {cl.wards.join(', ')}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: urgencyColor(cl.urgency), lineHeight: 1 }}>{cl.urgency}</div>
                  <div style={{ fontSize: 9, color: 'var(--ink-light)', textTransform: 'uppercase' }}>urgency</div>
                </div>
                {isExp ? <ChevronUp size={16} color="var(--ink-light)" /> : <ChevronDown size={16} color="var(--ink-light)" />}
              </div>
            </div>

            {isExp && (
              <div style={{ marginTop: 16, animation: 'fadeIn 0.2s ease' }}>
                {/* AI suggested action */}
                <div style={{ background: 'var(--purple-pale)', borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: 14, borderLeft: '3px solid var(--purple)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>AI Recommended Action</div>
                  <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, marginBottom: 4 }}>{cl.suggestedAction}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>Addressing as a cluster saves {cl.count - 1} individual complaint cycles.</div>
                </div>

                {/* Related complaints */}
                {related.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Related Complaints in this Cluster</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {related.slice(0, 3).map(c => (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'var(--canvas)', borderRadius: 'var(--r-md)', border: 'var(--border)' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{c.title}</div>
                            <div style={{ fontSize: 10, color: 'var(--ink-light)' }}>{c.id} · {c.citizen} · {c.date}</div>
                          </div>
                          <Badge variant={c.status}>{c.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, padding: '10px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, justifyContent: 'center' }}>
                    <FileText size={14} /> Draft Group Order
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, padding: '10px', background: 'var(--red-pale)', color: 'var(--red)', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, justifyContent: 'center' }}>
                    <AlertTriangle size={14} /> Escalate Cluster
                  </button>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}