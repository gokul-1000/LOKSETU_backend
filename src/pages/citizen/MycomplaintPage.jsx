import React, { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertTriangle, MessageSquare, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, Badge, SentimentDot, Button } from '../../components/ui'
import { complaintsAPI } from '../../api/client'
import { useApp } from '../../context/AppContext'

const STATUS_COLOR = { progress: 'var(--blue-light)', escalated: 'var(--red)', resolved: 'var(--green)', open: 'var(--saffron)', pending: 'var(--amber)' }

const DEBATE_PREVIEW = [
  { agent: 'Policy Enforcer',   color: '#60A5FA', msg: 'Bylaw §42.3 mandates PWD response within 48hrs. Classification confirmed.' },
  { agent: 'Evidence Reviewer', color: '#34D399', msg: '3 similar complaints in same ward this quarter. SLA breach pattern flagged.' },
  { agent: 'Citizen Advocate',  color: '#F59E0B', msg: 'Citizen entitled to escalation after SLA breach. Rights preserved.' },
  { agent: 'Chief Coordinator', color: '#A78BFA', msg: '{"status":"ESCALATED","dept":"PWD","urgency":7,"sla":"48h","confidence":0.94}' },
]

const ComplaintCard = ({ complaint: c }) => {
  const [expanded, setExpanded] = useState(false)
  const [addInfo, setAddInfo]   = useState('')
  const [showDebate, setShowDebate] = useState(false)

  const urgencyColor = c.urgency >= 8 ? 'var(--red)' : c.urgency >= 5 ? 'var(--amber)' : 'var(--green)'

  return (
    <Card style={{ borderLeft: `4px solid ${STATUS_COLOR[c.status] || 'var(--ink-light)'}` }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{c.title}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-light)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span>{c.id}</span><span>·</span><span>{c.category}</span><span>·</span>
            <span>{c.department}</span><span>·</span><span>Filed {c.date}</span>
            <span>·</span><span>Last update {c.lastUpdate}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <Badge variant={c.priority}>{c.priority}</Badge>
          <Badge variant={c.status}>{c.status}</Badge>
        </div>
      </div>

      {/* AI summary */}
      <div style={{ background: 'var(--blue-pale)', borderRadius: 'var(--r-md)', padding: '10px 12px', marginBottom: 14, borderLeft: '3px solid var(--blue)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>AI Status Update</div>
        <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{c.aiSummary}</div>
      </div>

      {/* Urgency + sentiment row */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Urgency Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: 'var(--canvas-warm)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${c.urgency * 10}%`, background: urgencyColor, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: urgencyColor, fontFamily: 'var(--font-mono)' }}>{c.urgency}/10</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Sentiment</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <SentimentDot sentiment={c.sentiment} />
            <span style={{ fontSize: 12, textTransform: 'capitalize', color: 'var(--ink)' }}>{c.sentiment}</span>
          </div>
        </div>
      </div>

      {/* Resolution timeline */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 14 }}>
        {c.timeline.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: i < c.timeline.length - 1 ? 'none' : 1 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: s.done ? 'var(--green)' : 'var(--canvas-warm)', border: `2px solid ${s.done ? 'var(--green)' : 'rgba(13,27,42,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.done && <CheckCircle size={11} color="white" />}
              </div>
              <div style={{ fontSize: 9, color: s.done ? 'var(--green)' : 'var(--ink-light)', textAlign: 'center', maxWidth: 72, lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ fontSize: 8, color: 'var(--ink-light)', textAlign: 'center' }}>{s.date}</div>
            </div>
            {i < c.timeline.length - 1 && (
              <div style={{ flex: 1, height: 2, background: s.done ? 'var(--green-pale)' : 'var(--canvas-warm)', marginTop: 9, minWidth: 8 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Add info banner */}
      {c.canAddInfo && (
        <div style={{ background: 'var(--amber-pale)', border: '1px solid var(--amber)', borderRadius: 'var(--r-md)', padding: '10px 12px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={13} color="var(--amber)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)' }}>Officer requested more information</span>
          </div>
          <textarea value={addInfo} onChange={e => setAddInfo(e.target.value)} placeholder="Add any additional details, photos or clarifications…" rows={2} style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--amber)', borderRadius: 'var(--r-sm)', fontSize: 12, fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical', background: 'white' }} />
          <button onClick={() => setAddInfo('')} style={{ marginTop: 6, padding: '6px 14px', background: 'var(--amber)', color: 'white', border: 'none', borderRadius: 'var(--r-sm)', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>Send Response</button>
        </div>
      )}

      {/* Expand / collapse */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setShowDebate(!showDebate)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: 'var(--border)', borderRadius: 'var(--r-md)', background: 'var(--canvas)', cursor: 'pointer', fontSize: 11, color: 'var(--ink-light)', fontFamily: 'var(--font-body)' }}>
          <MessageSquare size={12} /> AI Debate Log {showDebate ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
      </div>

      {/* Debate log */}
      {showDebate && (
        <div style={{ marginTop: 10, background: 'var(--ink)', borderRadius: 'var(--r-md)', padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.75, animation: 'fadeIn 0.25s ease' }}>
          {DEBATE_PREVIEW.map((d, i) => (
            <div key={i} style={{ marginBottom: i < DEBATE_PREVIEW.length - 1 ? 6 : 0 }}>
              <span style={{ color: d.color, fontWeight: 500 }}>[{d.agent}]</span>{' '}
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>{d.msg}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function MyComplaintsPage() {
  const { user } = useApp()
  const [filter, setFilter] = useState('all')
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch complaints from API - auto-filtered by citizen ID if user is CITIZEN
        const response = await complaintsAPI.getAll()
        
        // Map API response to UI format
        const mappedComplaints = (response.data?.data || []).map(complaint => ({
          id: complaint.complaintId,
          title: complaint.title,
          category: complaint.category,
          status: complaint.status.toLowerCase(), // Convert to lowercase for styling
          priority: complaint.priority.toLowerCase(),
          date: new Date(complaint.createdAt).toLocaleDateString('en-IN'),
          lastUpdate: complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleDateString('en-IN') : 'Just now',
          department: complaint.department,
          urgency: complaint.urgency || 5,
          sentiment: (complaint.sentiment || 'COMPLAINT').toLowerCase(),
          aiSummary: complaint.aiSummary || complaint.description?.substring(0, 200),
          timeline: [
            { label: 'Submitted', date: new Date(complaint.createdAt).toLocaleDateString(), done: true },
            { label: 'AI Classified', date: new Date(complaint.createdAt).toLocaleDateString(), done: complaint.aiClassified },
            { label: `Assigned to ${complaint.department || 'Department'}`, date: complaint.updates?.[0]?.createdAt ? new Date(complaint.updates[0].createdAt).toLocaleDateString() : '—', done: !!complaint.updates?.[0] },
            { label: 'Under Review', date: '—', done: complaint.status === 'IN_PROGRESS' },
            { label: 'Resolved', date: complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleDateString() : '—', done: complaint.status === 'RESOLVED' },
          ],
          canAddInfo: complaint.status === 'PENDING_INFO',
        }))
        
        setComplaints(mappedComplaints)
      } catch (err) {
        console.error('Error fetching complaints:', err)
        setError(err.response?.data?.error || 'Failed to fetch complaints')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchComplaints()
    } else {
      setLoading(false)
      setError('Please log in to view your complaints')
    }
  }, [user])

  const filtered = complaints.filter(c => filter === 'all' || c.status === filter)

  return (
    <div className="animate-fade-up" style={{ maxWidth: 780, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'open', 'in_progress', 'escalated', 'pending', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '5px 14px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: filter === s ? 600 : 400, background: filter === s ? 'var(--ink)' : 'var(--surface)', color: filter === s ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)', textTransform: 'capitalize' }}>{s}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-light)' }}>{loading ? 'Loading...' : `${filtered.length} complaint${filtered.length !== 1 ? 's' : ''}`}</span>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--ink-light)' }}>Loading your complaints...</div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <Card style={{ background: 'var(--red-pale)', border: '1px solid var(--red)', padding: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AlertTriangle size={20} color="var(--red)" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)', marginBottom: 4 }}>Error Loading Complaints</div>
              <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{error}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <MessageSquare size={48} color="var(--ink-light)" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>No complaints yet</div>
          <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>
            {filter === 'all' ? 'Start by filing your first complaint' : `No complaints with status "${filter}"`}
          </div>
        </Card>
      )}

      {/* Complaints list */}
      {!loading && !error && filtered.map(c => <ComplaintCard key={c.id} complaint={c} />)}
    </div>
  )
}