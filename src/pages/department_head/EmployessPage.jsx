import React, { useState } from 'react'
import { Users, Phone, TrendingUp, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, ScoreRing } from '../../components/ui'
import { DEPT_EMPLOYEES } from '../../data/mockData'

const scoreColor = s => s >= 80 ? 'var(--green)' : s >= 60 ? 'var(--amber)' : 'var(--red)'

export default function EmployeesPage() {
  const [selected, setSelected] = useState(null)
  const [sort, setSort]         = useState('score')

  const sorted = [...DEPT_EMPLOYEES].sort((a, b) =>
    sort === 'score' ? b.score - a.score : sort === 'breaches' ? b.breaches - a.breaches : a.avgDays - b.avgDays
  )

  const chartData = DEPT_EMPLOYEES.map(e => ({
    name: e.name.split(' ')[0],
    resolved: e.resolved,
    pending: e.assigned - e.resolved,
    score: e.score,
  }))

  const emp = selected ? DEPT_EMPLOYEES.find(e => e.id === selected) : null

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1100 }}>

      {/* Chart */}
      <Card>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>Team Performance Overview</div>
        <div style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 16 }}>Complaints resolved vs pending per field officer</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,27,42,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 8, border: 'var(--border)' }} />
            <Bar dataKey="resolved" name="Resolved" fill="var(--green)" radius={[3,3,0,0]} stackId="a" />
            <Bar dataKey="pending"  name="Pending"  fill="var(--amber)" radius={[3,3,0,0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        {/* Table */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Sort controls */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-light)', alignSelf: 'center', marginRight: 4 }}>Sort by:</span>
            {[['score', 'Performance'], ['breaches', 'SLA Breaches'], ['avgDays', 'Avg Days']].map(([key, label]) => (
              <button key={key} onClick={() => setSort(key)} style={{ padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: sort === key ? 600 : 400, background: sort === key ? 'var(--green)' : 'var(--surface)', color: sort === key ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{label}</button>
            ))}
          </div>

          <Card padding="0">
            <div style={{ padding: '10px 16px', background: 'var(--canvas)', borderBottom: 'var(--border)', display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px 60px', gap: 12, fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              <span>Officer</span><span style={{ textAlign: 'center' }}>Score</span><span style={{ textAlign: 'center' }}>Resolved</span><span style={{ textAlign: 'center' }}>Avg Days</span><span style={{ textAlign: 'center' }}>Breaches</span>
            </div>
            {sorted.map(e => (
              <div key={e.id} onClick={() => setSelected(selected === e.id ? null : e.id)}
                style={{ padding: '12px 16px', borderBottom: 'var(--border)', display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px 60px', gap: 12, alignItems: 'center', background: selected === e.id ? 'var(--green-pale)' : 'transparent', cursor: 'pointer', transition: 'background var(--t-fast)' }}
                onMouseEnter={e2 => { if (selected !== e.id) e2.currentTarget.style.background = 'var(--canvas)' }}
                onMouseLeave={e2 => { if (selected !== e.id) e2.currentTarget.style.background = 'transparent' }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{e.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-light)' }}>{e.role} · {e.zone}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: scoreColor(e.score) }}>{e.score}</div>
                </div>
                <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>{e.resolved}</div>
                <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: e.avgDays > 6 ? 'var(--red)' : e.avgDays > 4 ? 'var(--amber)' : 'var(--green)' }}>{e.avgDays}d</div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: e.breaches > 0 ? 'var(--red)' : 'var(--green)' }}>{e.breaches}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Detail panel */}
        {emp && (
          <div style={{ width: 300, flexShrink: 0, background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', animation: 'slideInRight 0.25s ease' }}>
            <div style={{ padding: '14px 16px', borderBottom: 'var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>{emp.name}</div>
              <button onClick={() => setSelected(null)} style={{ all: 'unset', cursor: 'pointer', color: 'var(--ink-light)' }}><X size={14} /></button>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <ScoreRing score={emp.score} size={60} strokeWidth={5} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 2 }}>{emp.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 2 }}>{emp.zone}</div>
                  <div style={{ fontSize: 12, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={11} /> {emp.phone}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  ['Assigned',  emp.assigned,             'var(--ink)'   ],
                  ['Resolved',  emp.resolved,              'var(--green)' ],
                  ['Pending',   emp.assigned - emp.resolved,'var(--amber)'],
                  ['Avg Days',  `${emp.avgDays}d`,         emp.avgDays > 6 ? 'var(--red)' : 'var(--green)'],
                  ['Breaches',  emp.breaches,               emp.breaches > 0 ? 'var(--red)' : 'var(--green)'],
                  ['Score',     emp.score,                  scoreColor(emp.score)],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ background: 'var(--canvas)', borderRadius: 'var(--r-sm)', padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: 'var(--ink-light)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                    <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: c }}>{v}</div>
                  </div>
                ))}
              </div>
              {emp.breaches > 1 && (
                <div style={{ background: 'var(--red-pale)', borderRadius: 'var(--r-md)', padding: '10px 12px', borderLeft: '3px solid var(--red)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--red)', marginBottom: 4 }}>Performance Notice Required</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.5 }}>{emp.breaches} SLA breaches this month. Consider issuing a show-cause notice.</div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 7 }}>
                <button style={{ flex: 1, padding: '8px', background: 'var(--green-pale)', color: 'var(--green)', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Assign Task</button>
                {emp.breaches > 1 && <button style={{ flex: 1, padding: '8px', background: 'var(--red-pale)', color: 'var(--red)', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Issue Notice</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}