import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Clock, CheckCircle, AlertTriangle, ChevronRight, ArrowRight, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, Badge, SentimentDot } from '../../components/ui'
import { RTI_TOPICS } from '../../data/mockData'
import { complaintsAPI } from '../../api/client'
import { useApp } from '../../context/AppContext'

const statusColor = { progress: 'var(--blue-light)', escalated: 'var(--red)', resolved: 'var(--green)', open: 'var(--saffron)', pending: 'var(--amber)' }

const TimelineBar = ({ steps }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 10 }}>
    {steps.map((s, i) => (
      <React.Fragment key={i}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: s.done ? 'var(--green)' : 'var(--canvas-warm)', border: `2px solid ${s.done ? 'var(--green)' : 'rgba(13,27,42,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {s.done && <CheckCircle size={10} color="white" />}
          </div>
          <div style={{ fontSize: 9, color: s.done ? 'var(--green)' : 'var(--ink-light)', textAlign: 'center', maxWidth: 60, lineHeight: 1.3 }}>{s.label}</div>
        </div>
        {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: s.done ? 'var(--green-pale)' : 'var(--canvas-warm)', marginBottom: 18, minWidth: 12 }} />}
      </React.Fragment>
    ))}
  </div>
)

export default function CitizenHome() {
  const navigate = useNavigate()
  const { user } = useApp()
  const { t } = useTranslation()
  const [complaints, setComplaints] = useState([])
  const [adminUpdates, setAdminUpdates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComplaintsAndUpdates = async () => {
      try {
        setLoading(true)
        const response = await complaintsAPI.getAll()
        
        const mapped = (response.data?.data || []).map(c => ({
          id: c.complaintId || c.id,
          title: c.title,
          status: (c.status || 'OPEN').toLowerCase(),
          priority: (c.priority || 'MEDIUM').toLowerCase(),
          date: new Date(c.createdAt).toLocaleDateString('en-IN'),
          department: c.department,
          aiSummary: c.aiSummary || c.description?.substring(0, 100),
          urgency: c.urgency || 5,
          timeline: [
            { label: t('home.timeline.submitted'), done: true },
            { label: t('home.timeline.aiClassified'), done: c.aiClassified },
            { label: `${t('home.timeline.assignedTo')} ${c.department || 'Department'}`, done: !!c.updates?.[0] },
            { label: t('home.timeline.underReview'), done: c.status === 'in_progress' },
            { label: t('home.timeline.resolved'), done: c.status === 'resolved' },
          ]
        }))
        
        setComplaints(mapped)
        
        // Load updates for each complaint
        const allUpdates = []
        for (const complaint of mapped) {
          try {
            const updatesResponse = await complaintsAPI.getUpdates(complaint.id)
            const updates = (updatesResponse.data || []).filter(u => u.type === 'COMMENT' || u.message)
            if (updates.length > 0) {
              allUpdates.push(...updates.map(u => ({
                complaintId: complaint.id,
                complaintTitle: complaint.title,
                message: u.message,
                createdAt: u.createdAt,
              })))
            }
          } catch (err) {
            console.log('Could not load updates for complaint:', complaint.id)
          }
        }
        
        // Sort by most recent first
        setAdminUpdates(allUpdates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5))
      } catch (err) {
        console.error('Error fetching complaints:', err)
        setComplaints([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchComplaintsAndUpdates()
    } else {
      setLoading(false)
    }
  }, [user, t])

  const active = complaints.filter(c => c.status !== 'resolved')
  const resolved = complaints.filter(c => c.status === 'resolved')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }} className="animate-fade-up">

      {/* Welcome + quick action */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontFamily: 'var(--font-display)', marginBottom: 4 }}>{t('home.welcomed')}, Ramesh 👋</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-light)' }}>{t('home.youHave')} <strong>{active.length}</strong> {t('home.activeComplaints')} <strong>{resolved.length}</strong> {t('home.resolved')}.</p>
        </div>
        <button onClick={() => navigate('/citizen/file')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--r-lg)', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 600, boxShadow: '0 4px 16px rgba(26,75,140,0.3)' }}>
          <FileText size={16} /> {t('home.fileNewComplaint')}
        </button>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: t('home.totalFiled'),   value: complaints.length, icon: FileText,       color: 'var(--blue)'    },
          { label: t('home.inProgress'),   value: active.filter(c => c.status === 'progress').length, icon: Clock, color: 'var(--amber)' },
          { label: t('home.escalated'),     value: active.filter(c => c.status === 'escalated').length, icon: AlertTriangle, color: 'var(--red)' },
          { label: t('home.resolved'),      value: resolved.length, icon: CheckCircle,         color: 'var(--green)'   },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} style={{ padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 56, height: 56, background: color, opacity: 0.07, borderRadius: '0 var(--r-lg) 0 80%' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 'var(--r-sm)', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={13} color="white" />
              </div>
              <span style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 500 }}>{label}</span>
            </div>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
          </Card>
        ))}
      </div>

      {/* Active complaints with timelines */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 2 }}>{t('home.activeComplaintsTitle')}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{t('home.viewFullDetails')}</div>
          </div>
          <button onClick={() => navigate('/citizen/complaints')} style={{ fontSize: 12, color: 'var(--blue-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>{t('home.viewAll')} →</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {active.map(c => (
            <div key={c.id} onClick={() => navigate('/citizen/complaints')} style={{ background: 'var(--canvas)', borderRadius: 'var(--r-lg)', padding: '16px 18px', cursor: 'pointer', border: 'var(--border)', transition: 'all var(--t-base)', borderLeft: `4px solid ${statusColor[c.status] || 'var(--ink-light)'}` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-light)', display: 'flex', gap: 10 }}>
                    <span>{c.id}</span><span>·</span><span>{c.department}</span><span>·</span><span>{t('home.filed')} {c.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <Badge variant={c.priority}>{c.priority}</Badge>
                  <Badge variant={c.status}>{c.status}</Badge>
                </div>
              </div>

              {/* AI summary */}
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', background: 'var(--blue-pale)', borderRadius: 'var(--r-sm)', padding: '8px 10px', marginBottom: 6, lineHeight: 1.5 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 6 }}>{t('home.aiUpdate')}</span>
                {c.aiSummary}
              </div>

              {/* Timeline */}
              <TimelineBar steps={c.timeline} />

              {c.canAddInfo && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--amber-pale)', borderRadius: 'var(--r-sm)', border: '1px solid var(--amber)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={12} color="var(--amber)" />
                  <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600 }}>{t('home.officerRequestedInfo')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Admin Updates Section */}
      {adminUpdates.length > 0 && (
        <Card style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFAED 100%)', border: '1px solid rgba(34, 197, 94, 0.2)', borderLeft: '4px solid var(--green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={16} color="var(--green)" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Admin Updates</div>
              <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>Latest messages from your department</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {adminUpdates.map((update, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--r-md)', padding: '12px 14px', border: '1px solid rgba(34, 197, 94, 0.1)', borderLeft: '3px solid var(--green)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{update.complaintTitle}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-light)', flexShrink: 0 }}>{new Date(update.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5 }}>{update.message}</div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/citizen/complaints')} style={{ marginTop: 12, fontSize: 12, color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            View all updates <ChevronRight size={14} />
          </button>
        </Card>
      )}

      {/* Quick RTI tip */}
      <Card style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2F45 100%)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{t('home.didYouKnow')}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', marginBottom: 6 }}>{t('home.waterSupplySLA')}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 480 }}>{t('home.waterSupplyDesc')}</div>
          </div>
          <button onClick={() => navigate('/citizen/rti')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, flexShrink: 0 }}>
            {t('home.knowYourRights')} <ArrowRight size={14} />
          </button>
        </div>
      </Card>

      {/* RTI AI Assistant Question */}
      <Card style={{ background: 'var(--blue-pale)', border: '1px solid rgba(26,75,140,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue)', marginBottom: 4 }}>Have an RTI question?</div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>Ask our AI assistant — it knows Delhi's civic laws, SLAs, and can help you draft an RTI application in minutes.</div>
          </div>
          <button onClick={() => navigate('/citizen/rti')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, flexShrink: 0 }}>
            Ask AI <ChevronRight size={14} />
          </button>
        </div>
      </Card>
    </div>
  )
}