import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Clock, Users, Layers, TrendingUp, ArrowRight, Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, Badge, ScoreRing, SentimentDot } from '../../components/ui'
import { MY_WARD, WARD_COMPLAINTS, COMPLAINT_CLUSTERS, EMPLOYEES } from '../../data/mockData'

const SLA_DATA = [
  { dept: 'PWD',   onTime: 7, breached: 3 },
  { dept: 'MCD',   onTime: 9, breached: 1 },
  { dept: 'Water', onTime: 2, breached: 4 },
  { dept: 'DJB',   onTime: 5, breached: 2 },
]

const SLATimer = ({ c }) => {
  const remaining = c.slaHours - c.hoursElapsed
  const pct       = Math.min((c.hoursElapsed / c.slaHours) * 100, 100)
  const breached  = remaining <= 0
  const urgent    = remaining > 0 && remaining < 8
  const color     = breached ? 'var(--red)' : urgent ? 'var(--amber)' : 'var(--green)'

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', padding: '12px 14px', border: `1px solid ${breached ? 'rgba(192,57,43,0.25)' : 'rgba(13,27,42,0.08)'}`, borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', flex: 1, lineHeight: 1.3 }}>{c.title}</div>
        <span style={{ fontSize: 10, fontWeight: 700, color, background: breached ? 'var(--red-pale)' : urgent ? 'var(--amber-pale)' : 'var(--green-pale)', padding: '2px 7px', borderRadius: 'var(--r-full)', flexShrink: 0 }}>
          {breached ? `+${Math.abs(remaining)}h BREACHED` : urgent ? `${remaining}h left` : `${remaining}h left`}
        </span>
      </div>
      <div style={{ height: 5, background: 'var(--canvas-warm)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--ink-light)', display: 'flex', gap: 10 }}>
        <span>{c.ward}</span><span>·</span><span>{c.department}</span>
        {!c.assignedTo && <span style={{ color: 'var(--red)', fontWeight: 600 }}>⚠ Unassigned</span>}
        {c.assignedTo && <span>→ {c.assignedTo}</span>}
      </div>
    </div>
  )
}

export default function WardOfficerHome() {
  const navigate    = useNavigate()
  const w           = MY_WARD
  const slaBreached = WARD_COMPLAINTS.filter(c => c.hoursElapsed > c.slaHours)
  const unassigned  = WARD_COMPLAINTS.filter(c => !c.assignedTo)

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1200 }}>

      {/* Top: health + KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
        {/* Ward health card */}
        <Card style={{ background: 'linear-gradient(135deg, #0D1B2A, #1A2F45)', border: 'none' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>My Ward</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', marginBottom: 4 }}>{w.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{w.zone} · Pop. {w.population.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ScoreRing score={w.healthScore} size={72} strokeWidth={6} />
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Health Score</div>
              <div style={{ fontSize: 12, color: w.healthScore >= 75 ? '#34D399' : w.healthScore >= 55 ? '#FBBF24' : '#F87171', fontWeight: 600 }}>
                {w.healthScore >= 75 ? 'Healthy' : w.healthScore >= 55 ? 'Moderate' : 'Stressed'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Avg {w.avgResolutionDays}d resolution</div>
            </div>
          </div>
        </Card>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Open Complaints',    value: w.openComplaints,     icon: AlertTriangle, color: 'var(--saffron)', action: () => navigate('/officer/complaints') },
            { label: 'Resolved This Week', value: w.resolvedThisWeek,   icon: CheckCircle,   color: 'var(--green)',   action: null },
            { label: 'SLA Breached',       value: slaBreached.length,   icon: Clock,         color: 'var(--red)',     action: () => navigate('/officer/escalations') },
            { label: 'Escalated',          value: w.escalated,          icon: Zap,           color: 'var(--red)',     action: () => navigate('/officer/escalations') },
            { label: 'Unassigned',         value: unassigned.length,    icon: Users,         color: 'var(--amber)',   action: () => navigate('/officer/complaints') },
            { label: 'AI Clusters',        value: COMPLAINT_CLUSTERS.length, icon: Layers,  color: 'var(--purple)',  action: () => navigate('/officer/clusters') },
          ].map(({ label, value, icon: Icon, color, action }) => (
            <Card key={label} hover={!!action} onClick={action || undefined} style={{ padding: '14px 16px', position: 'relative', overflow: 'hidden', cursor: action ? 'pointer' : 'default' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 52, height: 52, background: color, opacity: 0.07, borderRadius: '0 var(--r-lg) 0 80%' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 'var(--r-sm)', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={12} color="white" />
                </div>
                <span style={{ fontSize: 11, color: 'var(--ink-light)', fontWeight: 500 }}>{label}</span>
              </div>
              <div style={{ fontSize: 26, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
              {action && <div style={{ fontSize: 10, color, marginTop: 4, fontWeight: 600 }}>View →</div>}
            </Card>
          ))}
        </div>
      </div>

      {/* SLA timers + cluster alert */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* SLA timers */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 2 }}>SLA Countdown</div>
              <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Complaints with tightest deadlines</div>
            </div>
            <button onClick={() => navigate('/officer/complaints')} style={{ fontSize: 12, color: 'var(--blue-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>All →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...WARD_COMPLAINTS].sort((a, b) => (a.slaHours - a.hoursElapsed) - (b.slaHours - b.hoursElapsed)).slice(0, 4).map(c => <SLATimer key={c.id} c={c} />)}
          </div>
        </Card>

        {/* AI clusters */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 2 }}>AI Grouped Problems</div>
              <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Similar complaints auto-clustered for joint action</div>
            </div>
            <button onClick={() => navigate('/officer/clusters')} style={{ fontSize: 12, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>All clusters →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {COMPLAINT_CLUSTERS.map(cl => (
              <div key={cl.id} style={{ background: 'var(--canvas)', borderRadius: 'var(--r-md)', padding: '12px 14px', border: 'var(--border)', borderLeft: `3px solid ${cl.urgency >= 8 ? 'var(--red)' : cl.urgency >= 6 ? 'var(--amber)' : 'var(--blue)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', flex: 1, lineHeight: 1.4 }}>{cl.summary}</span>
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0, marginLeft: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)', background: 'var(--blue-pale)', padding: '2px 8px', borderRadius: 'var(--r-full)' }}>{cl.count} complaints</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 500, marginBottom: 6 }}>→ {cl.suggestedAction}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge variant={cl.status}>{cl.status}</Badge>
                  <span style={{ fontSize: 10, color: 'var(--ink-light)' }}>Wards: {cl.wards.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* SLA chart + field staff */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>Dept SLA Performance</div>
          <div style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 16 }}>On-time vs breached this week</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={SLA_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,27,42,0.05)" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 8 }} />
              <Bar dataKey="onTime"   name="On Time"  fill="var(--green)" radius={[3,3,0,0]} stackId="a" />
              <Bar dataKey="breached" name="Breached" fill="var(--red)"   radius={[3,3,0,0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 2 }}>Field Staff Today</div>
              <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Availability & load</div>
            </div>
            <button onClick={() => navigate('/officer/employees')} style={{ fontSize: 12, color: 'var(--blue-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Manage →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {EMPLOYEES.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--canvas)', borderRadius: 'var(--r-md)', border: 'var(--border)' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: e.available ? 'var(--green-pale)' : 'var(--red-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: e.available ? 'var(--green)' : 'var(--red)' }}>
                  {e.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{e.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-light)' }}>{e.dept} · {e.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{e.assigned - e.resolved} open</div>
                  <div style={{ fontSize: 10, color: e.available ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{e.available ? '● Available' : '● Busy'}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}