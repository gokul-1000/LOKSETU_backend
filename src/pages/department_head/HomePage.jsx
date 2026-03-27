import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Users, Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, ScoreRing, Badge } from '../../components/ui'
import { MY_DEPT, DEPT_COMPLAINTS, DEPT_EMPLOYEES, DEPT_ROOT_CAUSE, DEPT_WEEKLY_TREND } from '../../data/mockData'

export default function DeptHome() {
  const navigate = useNavigate()
  const d = MY_DEPT
  const resRate  = Math.round((d.resolved / d.totalComplaints) * 100)
  const unassigned = DEPT_COMPLAINTS.filter(c => !c.assignedTo)
  const breached   = DEPT_COMPLAINTS.filter(c => c.slaBreached)

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1200 }}>

      {/* Header card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
        <Card style={{ background: 'linear-gradient(135deg, #0A1F0A, #163316)', border: 'none' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Department Overview</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', marginBottom: 4 }}>{d.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 18 }}>Head: {d.headName} · Code: {d.code}</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <ScoreRing score={d.score} size={64} strokeWidth={5} />
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>Performance Score</div>
                <div style={{ fontSize: 13, color: '#34D399', fontWeight: 600 }}>On Track</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>SLA Breach: {d.slaBreachRate}%</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[['Resolved', `${resRate}%`, '#34D399'], ['Avg Days', `${d.avgDays}d`, '#FBBF24'], ['Pending', d.pending, '#F87171'], ['Escalated', d.escalated, '#F87171']].map(([l, v, c]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: c, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Budget card */}
        <Card style={{ minWidth: 220 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Budget Utilisation</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--ink)', lineHeight: 1, marginBottom: 4 }}>{d.budget.utilisation}%</div>
          <div style={{ fontSize: 11, color: 'var(--ink-light)', marginBottom: 12 }}>₹{(d.budget.spent / 100000).toFixed(1)}L of ₹{(d.budget.allocated / 100000).toFixed(1)}L</div>
          <div style={{ height: 8, background: 'var(--canvas-warm)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', width: `${d.budget.utilisation}%`, background: d.budget.utilisation > 90 ? 'var(--red)' : 'var(--green)', borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>Remaining: ₹{((d.budget.allocated - d.budget.spent) / 100000).toFixed(1)}L</div>
        </Card>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Assigned',  value: d.totalComplaints, icon: FileText,     color: 'var(--green)',   action: () => navigate('/department/complaints') },
          { label: 'Resolved',        value: d.resolved,        icon: CheckCircle,  color: 'var(--green)',   action: null },
          { label: 'SLA Breached',    value: breached.length,   icon: Clock,        color: 'var(--red)',     action: () => navigate('/department/complaints') },
          { label: 'Unassigned',      value: unassigned.length, icon: AlertTriangle,color: 'var(--amber)',   action: () => navigate('/department/complaints') },
          { label: 'Root Causes',     value: DEPT_ROOT_CAUSE.length, icon: Brain,   color: 'var(--purple)',  action: () => navigate('/department/rootcause') },
        ].map(({ label, value, icon: Icon, color, action }) => (
          <Card key={label} hover={!!action} onClick={action || undefined} style={{ padding: '14px 16px', position: 'relative', overflow: 'hidden', cursor: action ? 'pointer' : 'default' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 48, height: 48, background: color, opacity: 0.08, borderRadius: '0 var(--r-lg) 0 80%' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 'var(--r-sm)', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={11} color="white" />
              </div>
              <span style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 500 }}>{label}</span>
            </div>
            <div style={{ fontSize: 26, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
            {action && <div style={{ fontSize: 10, color, marginTop: 3, fontWeight: 600 }}>View →</div>}
          </Card>
        ))}
      </div>

      {/* Trend + top employees */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>Weekly Complaint Trend</div>
          <div style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 16 }}>Filed vs resolved vs SLA breached</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={DEPT_WEEKLY_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,27,42,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, fontFamily: 'var(--font-body)', borderRadius: 8, border: 'var(--border)' }} />
              <Line type="monotone" dataKey="filed"    name="Filed"    stroke="var(--blue)"   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="resolved" name="Resolved" stroke="var(--green)"  strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="breached" name="Breached" stroke="var(--red)"    strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 2 }}>Team Leaderboard</div>
              <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Resolution rate · this month</div>
            </div>
            <button onClick={() => navigate('/department/employees')} style={{ fontSize: 12, color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Full team →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...DEPT_EMPLOYEES].sort((a, b) => b.score - a.score).map((e, i) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: i === 0 ? 'var(--green-pale)' : 'var(--canvas)', borderRadius: 'var(--r-md)', border: `1px solid ${i === 0 ? 'rgba(42,122,75,0.2)' : 'rgba(13,27,42,0.08)'}` }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? 'var(--green)' : 'var(--ink-light)', width: 20, textAlign: 'center' }}>{i + 1}</span>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? 'var(--green)' : 'var(--canvas-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i === 0 ? 'white' : 'var(--ink-light)', flexShrink: 0 }}>
                  {e.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{e.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-light)' }}>{e.role} · {e.resolved}/{e.assigned} resolved · {e.avgDays}d avg</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: e.score >= 80 ? 'var(--green)' : e.score >= 60 ? 'var(--amber)' : 'var(--red)', lineHeight: 1 }}>{e.score}</div>
                  {e.breaches > 0 && <div style={{ fontSize: 9, color: 'var(--red)', fontWeight: 600 }}>{e.breaches} breach{e.breaches > 1 ? 'es' : ''}</div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Root cause preview */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 2 }}>AI Root Cause Summary</div>
            <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Systemic issues driving complaint volume in your domain</div>
          </div>
          <button onClick={() => navigate('/department/rootcause')} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Full analysis <ArrowRight size={13} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {DEPT_ROOT_CAUSE.map(rc => (
            <div key={rc.category} style={{ background: 'var(--canvas)', borderRadius: 'var(--r-md)', padding: '14px', border: 'var(--border)', borderLeft: `3px solid ${rc.severity === 'high' ? 'var(--red)' : 'var(--amber)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{rc.category}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: rc.trend.startsWith('+') ? 'var(--red)' : 'var(--green)' }}>{rc.trend}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: 8 }}>{rc.rootCause}</div>
              <div style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 500 }}>→ {rc.recommendation.slice(0, 60)}…</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}