import React, { useState } from 'react'
import { Filter, UserPlus, AlertTriangle, CheckCircle, Clock, X, ChevronRight } from 'lucide-react'
import { Badge, Card, Button, SentimentDot, EmptyState } from '../../components/ui'
import { WARD_COMPLAINTS, EMPLOYEES } from '../../data/mockData'

const statusOpts   = ['all', 'open', 'pending', 'progress', 'escalated']
const priorityOpts = ['all', 'critical', 'high', 'medium', 'low']

const SLABadge = ({ slaHours, hoursElapsed }) => {
  const rem = slaHours - hoursElapsed
  if (rem <= 0)   return <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--red)',   background: 'var(--red-pale)',   padding: '2px 7px', borderRadius: 99 }}>BREACHED +{Math.abs(rem)}h</span>
  if (rem < 8)    return <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--amber)', background: 'var(--amber-pale)', padding: '2px 7px', borderRadius: 99 }}>{rem}h left ⚠</span>
  return              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', background: 'var(--canvas-warm)', padding: '2px 7px', borderRadius: 99 }}>{rem}h left</span>
}

const AssignModal = ({ complaint, onClose }) => {
  const [selected, setSelected] = useState(null)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: 24, width: 420, maxHeight: '80vh', overflow: 'auto', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Assign to Field Staff</div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', color: 'var(--ink-light)' }}><X size={16} /></button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-muted)', background: 'var(--canvas)', padding: '10px 12px', borderRadius: 'var(--r-md)', marginBottom: 16 }}>{complaint.title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {EMPLOYEES.filter(e => e.dept === complaint.department || true).map(e => (
            <div key={e.id} onClick={() => setSelected(e.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: `1.5px solid ${selected === e.id ? 'var(--saffron)' : 'rgba(13,27,42,0.08)'}`, borderRadius: 'var(--r-md)', cursor: 'pointer', background: selected === e.id ? 'var(--saffron-pale)' : 'var(--canvas)', transition: 'all var(--t-fast)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: e.available ? 'var(--green-pale)' : 'var(--canvas-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: e.available ? 'var(--green)' : 'var(--ink-light)', flexShrink: 0 }}>
                {e.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-light)' }}>{e.dept} · {e.role} · {e.assigned - e.resolved} open tasks</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: e.available ? 'var(--green)' : 'var(--red)' }}>{e.available ? '● Free' : '● Busy'}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} disabled={!selected} style={{ flex: 1, padding: '10px', background: selected ? 'var(--saffron)' : 'var(--canvas-warm)', color: selected ? 'white' : 'var(--ink-light)', border: 'none', borderRadius: 'var(--r-md)', cursor: selected ? 'pointer' : 'not-allowed', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            Assign & Notify
          </button>
          <button onClick={onClose} style={{ padding: '10px 18px', background: 'var(--canvas)', color: 'var(--ink-light)', border: 'var(--border)', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function WardComplaintsPage() {
  const [statusFilter, setStatusFilter]   = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selected, setSelected]           = useState(null)
  const [assignTarget, setAssignTarget]   = useState(null)

  const filtered = WARD_COMPLAINTS.filter(c => {
    const ms = statusFilter   === 'all' || c.status   === statusFilter
    const mp = priorityFilter === 'all' || c.priority === priorityFilter
    return ms && mp
  })

  const complaint = selected ? WARD_COMPLAINTS.find(c => c.id === selected) : null

  return (
    <>
      {assignTarget && <AssignModal complaint={assignTarget} onClose={() => setAssignTarget(null)} />}

      <div className="animate-fade-up" style={{ display: 'flex', gap: 18, height: 'calc(100vh - 64px - 48px)' }}>
        {/* List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Filters */}
          <Card padding="10px 14px" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Filter size={13} color="var(--ink-light)" />
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {statusOpts.map(s => <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: statusFilter === s ? 600 : 400, background: statusFilter === s ? 'var(--saffron)' : 'var(--canvas)', color: statusFilter === s ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-body)' }}>{s}</button>)}
            </div>
            <div style={{ width: 1, height: 18, background: 'var(--canvas-warm)' }} />
            <div style={{ display: 'flex', gap: 5 }}>
              {priorityOpts.map(p => <button key={p} onClick={() => setPriorityFilter(p)} style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: priorityFilter === p ? 600 : 400, background: priorityFilter === p ? 'var(--ink)' : 'var(--canvas)', color: priorityFilter === p ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-body)' }}>{p}</button>)}
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-light)' }}>{filtered.length} complaints</div>
          </Card>

          {/* Table */}
          <Card padding="0" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', background: 'var(--canvas)', borderBottom: 'var(--border)', fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', gap: 12 }}>
              <span style={{ flex: 1 }}>Complaint</span><span style={{ width: 80 }}>SLA Status</span><span style={{ width: 80 }}>Priority</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filtered.length === 0 ? <EmptyState icon={Filter} title="No complaints" body="Try adjusting your filters" /> : filtered.map(c => (
                <div key={c.id} onClick={() => setSelected(selected === c.id ? null : c.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: 'var(--border)', background: selected === c.id ? 'var(--saffron-pale)' : 'transparent', cursor: 'pointer', transition: 'background var(--t-fast)' }}
                  onMouseEnter={e => { if (selected !== c.id) e.currentTarget.style.background = 'var(--canvas)' }}
                  onMouseLeave={e => { if (selected !== c.id) e.currentTarget.style.background = 'transparent' }}>
                  <SentimentDot sentiment={c.sentiment || 'neutral'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-light)', display: 'flex', gap: 8 }}>
                      <span>{c.id}</span><span>·</span><span>{c.location}</span>
                      {!c.assignedTo && <span style={{ color: 'var(--red)', fontWeight: 600 }}>⚠ Unassigned</span>}
                    </div>
                  </div>
                  <SLABadge slaHours={c.slaHours} hoursElapsed={c.hoursElapsed} />
                  <Badge variant={c.priority}>{c.priority}</Badge>
                  <ChevronRight size={14} color="var(--ink-light)" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detail panel */}
        {complaint ? (
          <div style={{ width: 360, flexShrink: 0, background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideInRight 0.25s ease' }}>
            <div style={{ padding: '14px 16px', borderBottom: 'var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>{complaint.title}</div>
                <div style={{ display: 'flex', gap: 6 }}><Badge variant={complaint.status}>{complaint.status}</Badge><Badge variant={complaint.priority}>{complaint.priority}</Badge></div>
              </div>
              <button onClick={() => setSelected(null)} style={{ all: 'unset', cursor: 'pointer', color: 'var(--ink-light)' }}><X size={14} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* AI summary */}
              <div style={{ background: 'var(--saffron-pale)', borderRadius: 'var(--r-md)', padding: '10px 12px', borderLeft: '3px solid var(--saffron)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--saffron)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>AI Summary</div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{complaint.aiSummary}</div>
              </div>
              {/* Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['Citizen', complaint.citizen], ['Phone', complaint.phone], ['Location', complaint.location], ['Department', complaint.department], ['Assigned To', complaint.assignedTo || 'Unassigned — action needed'], ['Filed', complaint.date]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--ink-light)', width: 80, flexShrink: 0 }}>{l}</span>
                    <span style={{ fontSize: 12, color: !complaint.assignedTo && l === 'Assigned To' ? 'var(--red)' : 'var(--ink)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              {/* SLA visual */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 500 }}>SLA Progress</span>
                  <SLABadge slaHours={complaint.slaHours} hoursElapsed={complaint.hoursElapsed} />
                </div>
                <div style={{ height: 8, background: 'var(--canvas-warm)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((complaint.hoursElapsed / complaint.slaHours) * 100, 100)}%`, background: complaint.hoursElapsed > complaint.slaHours ? 'var(--red)' : complaint.slaHours - complaint.hoursElapsed < 8 ? 'var(--amber)' : 'var(--green)', borderRadius: 4 }} />
                </div>
              </div>
              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {complaint.tags.map(t => <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--canvas-warm)', borderRadius: 99, color: 'var(--ink-light)' }}>#{t}</span>)}
              </div>
            </div>
            {/* Actions */}
            <div style={{ padding: '12px 14px', borderTop: 'var(--border)', display: 'flex', flexDirection: 'column', gap: 7 }}>
              <button onClick={() => setAssignTarget(complaint)} style={{ width: '100%', padding: '9px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <UserPlus size={14} /> {complaint.assignedTo ? 'Reassign' : 'Assign to Staff'}
              </button>
              <div style={{ display: 'flex', gap: 7 }}>
                {complaint.canEscalate && <button style={{ flex: 1, padding: '8px', background: 'var(--red-pale)', color: 'var(--red)', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Escalate</button>}
                <button style={{ flex: 1, padding: '8px', background: 'var(--green-pale)', color: 'var(--green)', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Mark Resolved</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: 360, flexShrink: 0, background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--ink-light)' }}>
              <ChevronRight size={32} style={{ opacity: 0.2, marginBottom: 12 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink)', marginBottom: 6 }}>Select a complaint</div>
              <div style={{ fontSize: 12 }}>Click any row to take action</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}