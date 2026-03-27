import React, { useState, useMemo, useEffect } from 'react'
import { Filter, Plus, X, User, Calendar, Tag, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react'
import { Badge, Card, Button, SentimentDot, Divider, EmptyState } from '../../components/ui'
import { complaintsAPI } from '../../api/client'
import { useApp } from '../../context/AppContext'

const STATUS_OPTS   = ['all', 'open', 'progress', 'pending', 'escalated', 'resolved', 'closed']
const PRIORITY_OPTS = ['all', 'critical', 'high', 'medium', 'low']

const ComplaintRow = ({ complaint: c, selected, onClick }) => (
  <div
    onClick={() => onClick(c)}
    style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '13px 20px',
      borderBottom: 'var(--border)',
      background: selected ? 'var(--blue-pale)' : 'transparent',
      cursor: 'pointer', transition: 'background var(--t-fast)',
    }}
    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--canvas)' }}
    onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}
  >
    <SentimentDot sentiment={c.sentiment} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{c.title}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-light)', display: 'flex', gap: 8 }}>
        <span>{c.ward}</span><span>·</span><span>{c.id}</span><span>·</span><span style={{ textTransform: 'capitalize' }}>{c.channel}</span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <Badge variant={c.priority}>{c.priority}</Badge>
      <Badge variant={c.status}>{c.status}</Badge>
      <ChevronRight size={14} color="var(--ink-light)" />
    </div>
  </div>
)

const DEBATE = (c) => [
  { agent: 'Policy Enforcer',   color: '#60A5FA', msg: 'Reviewed applicable bylaws. Category-A classification confirmed.' },
  { agent: 'Evidence Reviewer', color: '#34D399', msg: 'SLA check complete. Similar cases: 3 in same ward this quarter.' },
  { agent: 'Citizen Advocate',  color: '#F59E0B', msg: 'Citizen rights verified. Escalation eligible if unresolved >48hrs.' },
  { agent: 'Chief Coordinator', color: '#A78BFA', msg: `{"status":"${c.status.toUpperCase()}","dept":"${c.department}","urgency":${c.urgency},"confidence":0.94}` },
]

const STEPS = (c) => [
  { label: 'Submitted',                      done: true  },
  { label: 'AI Classified & Routed',         done: true  },
  { label: `Assigned to ${c.department}`,    done: ['progress','resolved','escalated'].includes(c.status) },
  { label: 'Under Review',                   done: c.status === 'progress' || c.status === 'resolved' },
  { label: 'Resolved',                       done: c.status === 'resolved' },
]

const DetailPanel = ({ complaint: c, onClose }) => {
  if (!c) return (
    <div style={{ width: 340, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-lg)' }}>
      <div style={{ textAlign: 'center', padding: 32, color: 'var(--ink-light)' }}>
        <MessageSquare size={32} style={{ opacity: 0.2, marginBottom: 12 }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink)', marginBottom: 6 }}>Select a grievance</div>
        <div style={{ fontSize: 12 }}>Click any row to view details</div>
      </div>
    </div>
  )

  const urgencyColor = c.urgency >= 8 ? 'var(--red)' : c.urgency >= 5 ? 'var(--amber)' : 'var(--green)'

  return (
    <div style={{ width: 340, flexShrink: 0, background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideInRight 0.25s ease' }}>
      <div style={{ padding: '16px 20px', borderBottom: 'var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 6 }}>{c.title}</div>
          <div style={{ display: 'flex', gap: 6 }}><Badge variant={c.status}>{c.status}</Badge><Badge variant={c.priority}>{c.priority}</Badge></div>
        </div>
        <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', color: 'var(--ink-light)', flexShrink: 0, padding: 4 }}><X size={14} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* AI summary */}
        <div style={{ background: 'var(--blue-pale)', borderRadius: 'var(--r-md)', padding: '10px 12px', borderLeft: '3px solid var(--blue)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 5 }}>AI Summary</div>
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{c.aiSummary}</p>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[[User, 'Citizen', c.citizen], [Calendar, 'Filed', c.date], [Tag, 'Department', c.department], [Tag, 'Category', c.category], [AlertCircle, 'Zone', c.zone]].map(([Icon, label, value]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={13} color="var(--ink-light)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--ink-light)', width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        <Divider />

        {/* Urgency + sentiment */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 7 }}>Urgency</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 5, background: 'var(--canvas-warm)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.urgency * 10}%`, background: urgencyColor, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: urgencyColor, fontFamily: 'var(--font-mono)' }}>{c.urgency}/10</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 7 }}>Sentiment</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <SentimentDot sentiment={c.sentiment} />
              <span style={{ fontSize: 12, textTransform: 'capitalize' }}>{c.sentiment}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-light)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{Math.round(c.sentimentScore * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {c.tags.map(t => <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--canvas-warm)', borderRadius: 'var(--r-full)', color: 'var(--ink-light)' }}>#{t}</span>)}
        </div>

        <Divider />

        {/* Timeline */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 12 }}>Timeline</div>
          {STEPS(c).map((s, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: i < arr.length - 1 ? 12 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: s.done ? 'var(--green)' : 'var(--canvas-warm)', border: `2px solid ${s.done ? 'var(--green)' : 'rgba(13,27,42,0.15)'}` }} />
                {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: s.done ? 'var(--green-pale)' : 'var(--canvas-warm)', marginTop: 2, minHeight: 10 }} />}
              </div>
              <div style={{ paddingBottom: 2 }}>
                <div style={{ fontSize: 12, color: s.done ? 'var(--ink)' : 'var(--ink-light)', fontWeight: s.done ? 500 : 400 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Debate log */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 10 }}>AI Debate Log</div>
          <div style={{ background: 'var(--ink)', borderRadius: 'var(--r-md)', padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.75 }}>
            {DEBATE(c).map((d, i) => (
              <div key={i} style={{ marginBottom: i < 3 ? 6 : 0 }}>
                <span style={{ color: d.color, fontWeight: 500 }}>[{d.agent}]</span>{' '}
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{d.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderTop: 'var(--border)', display: 'flex', gap: 8 }}>
        <Button variant="primary" size="sm" style={{ flex: 1, justifyContent: 'center' }}>Update Status</Button>
        <Button variant="ghost" size="sm">Escalate</Button>
        <Button variant="ghost" size="sm">Assign</Button>
      </div>
    </div>
  )
}

export default function ComplaintsPage() {
  const { searchQuery } = useApp()
  const [status,   setStatus]   = useState('all')
  const [priority, setPriority] = useState('all')
  const [selected, setSelected] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        const response = await complaintsAPI.getAll()
        
        // Map API response to UI format
        const mapped = (response.data?.data || []).map(c => ({
          id: c.complaintId || c.id,
          title: c.title,
          ward: c.ward || 'N/A',
          channel: 'digital',
          sentiment: (c.sentiment || 'COMPLAINT').toLowerCase(),
          priority: (c.priority || 'MEDIUM').toLowerCase(),
          status: (c.status || 'OPEN').toLowerCase(),
          department: c.department,
          urgency: c.urgency || 5,
          aiSummary: c.aiSummary || c.description?.substring(0, 200),
          citizenName: c.citizen?.name || 'Anonymous',
          description: c.description,
          location: c.location,
          category: c.category,
          createdAt: c.createdAt,
        }))
        
        setComplaints(mapped)
        setError(null)
      } catch (err) {
        console.error('Error fetching complaints:', err)
        setError(err.response?.data?.error || 'Failed to fetch complaints')
        setComplaints([])
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const filtered = useMemo(() => {
    let result = complaints
    
    if (status !== 'all') {
      result = result.filter(c => c.status === status)
    }
    
    if (priority !== 'all') {
      result = result.filter(c => c.priority === priority)
    }
    
    if (searchQuery) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.ward.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return result
  }, [status, priority, searchQuery, complaints])

  return (
    <div className="animate-fade-up" style={{ display: 'flex', height: 'calc(100vh - var(--header-h) - 48px)', gap: 18 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Card padding="10px 16px" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-light)' }}>
            <Filter size={13} /><span style={{ fontSize: 12, fontWeight: 500 }}>Filter</span>
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {STATUS_OPTS.map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{ padding: '3px 11px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: status === s ? 600 : 400, background: status === s ? 'var(--blue)' : 'var(--canvas)', color: status === s ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-body)' }}>{s}</button>
            ))}
          </div>
          <div style={{ width: 1, height: 18, background: 'var(--canvas-warm)' }} />
          <div style={{ display: 'flex', gap: 5 }}>
            {PRIORITY_OPTS.map(p => (
              <button key={p} onClick={() => setPriority(p)} style={{ padding: '3px 11px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: priority === p ? 600 : 400, background: priority === p ? 'var(--ink)' : 'var(--canvas)', color: priority === p ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-body)' }}>{p}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto' }}><Button variant="primary" size="sm" icon={Plus}>New Grievance</Button></div>
        </Card>

        <Card padding="0" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 20px', borderBottom: 'var(--border)', background: 'var(--canvas)' }}>
            <span style={{ width: 8 }} />
            <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Grievance</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 160, textAlign: 'right' }}>Priority / Status</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ink-light)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div>Loading complaints...</div>
                </div>
              </div>
            )}
            
            {error && !loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center', color: 'var(--red)' }}>
                  <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <div>{error}</div>
                </div>
              </div>
            )}
            
            {!loading && !error && filtered.length === 0
              ? <EmptyState icon={Filter} title="No results" body="Try adjusting your filters or search query" />
              : !loading && filtered.map(c => <ComplaintRow key={c.id} complaint={c} selected={selected?.id === c.id} onClick={setSelected} />)
            }
          </div>
          <div style={{ padding: '8px 20px', borderTop: 'var(--border)', fontSize: 11, color: 'var(--ink-light)', background: 'var(--canvas)' }}>
            Showing {filtered.length} of {complaints.length} grievances
          </div>
        </Card>
      </div>
      <DetailPanel complaint={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
