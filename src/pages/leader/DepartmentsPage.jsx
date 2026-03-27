import React, { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { Card, SectionHeader, ScoreRing, Badge, Divider } from '../../components/ui'
import { DEPARTMENTS, DEPT_RADAR_DATA } from '../../data/mockData'

const STATUS_LABEL  = { 'on-track': 'On Track', moderate: 'Moderate', 'needs-attention': 'Needs Attention' }
const STATUS_VARIANT= { 'on-track': 'resolved', moderate: 'pending', 'needs-attention': 'escalated' }
const STATUS_COLOR  = { 'on-track': 'var(--green)', moderate: 'var(--amber)', 'needs-attention': 'var(--red)' }

const DeptCard = ({ dept: d, selected, onClick }) => {
  const color   = STATUS_COLOR[d.status]
  const resRate = Math.round((d.resolved / d.assigned) * 100)

  return (
    <div
      onClick={() => onClick(d)}
      style={{
        background: selected ? 'var(--blue-pale)' : 'var(--surface)',
        border: selected ? '2px solid var(--blue)' : 'var(--border)',
        borderRadius: 'var(--r-lg)', padding: 20, cursor: 'pointer',
        transition: 'all var(--t-base)', boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.transform = 'none' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <ScoreRing score={d.score} size={52} strokeWidth={4} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{d.name}</div>
          <Badge variant={STATUS_VARIANT[d.status]}>{STATUS_LABEL[d.status]}</Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        {[['Assigned', d.assigned], ['Resolved', d.resolved], ['Avg Days', `${d.avgDays}d`]].map(([l, v]) => (
          <div key={l} style={{ textAlign: 'center', background: 'var(--canvas)', borderRadius: 'var(--r-sm)', padding: '8px 4px' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-light)', marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 5, background: 'var(--canvas-warm)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${resRate}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 10, color: 'var(--ink-light)' }}>Resolution rate</span>
        <span style={{ fontSize: 11, fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>{resRate}%</span>
      </div>
    </div>
  )
}

export default function DepartmentsPage() {
  const [selected, setSelected] = useState(null)

  const barData = DEPARTMENTS.map(d => ({
    name: d.shortName,
    rate: Math.round((d.resolved / d.assigned) * 100),
    fill: d.color,
  }))

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>

      {/* Dept cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {DEPARTMENTS.map(d => (
          <DeptCard key={d.id} dept={d} selected={selected?.id === d.id} onClick={d => setSelected(prev => prev?.id === d.id ? null : d)} />
        ))}
      </div>

      {/* Selected dept detail */}
      {selected && (
        <Card style={{ animation: 'fadeIn 0.3s ease' }}>
          <SectionHeader title={`${selected.name} — Detailed View`} subtitle="Performance breakdown and recent activity" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {[
              { label: 'Total Assigned',    value: selected.assigned,                          color: 'var(--blue)'    },
              { label: 'Resolved',          value: selected.resolved,                          color: 'var(--green)'   },
              { label: 'Pending',           value: selected.assigned - selected.resolved,       color: 'var(--amber)'   },
              { label: 'Avg Days',          value: `${selected.avgDays}d`,                    color: 'var(--saffron)' },
              { label: 'Resolution Rate',   value: `${Math.round(selected.resolved/selected.assigned*100)}%`, color: 'var(--green)' },
              { label: 'SLA Status',        value: STATUS_LABEL[selected.status],              color: STATUS_COLOR[selected.status] },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', background: 'var(--canvas)', borderRadius: 'var(--r-md)', padding: '16px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--ink-light)', marginBottom: 6, letterSpacing: '0.04em' }}>{label}</div>
                <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', color }}>{value}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Resolution rate bar */}
        <Card>
          <SectionHeader title="Resolution Rate Comparison" subtitle="% of assigned complaints resolved" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,27,42,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 8 }} formatter={v => [`${v}%`, 'Resolution Rate']} />
              <Bar dataKey="rate" radius={[4,4,0,0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance radar */}
        <Card>
          <SectionHeader title="Performance Radar" subtitle="Score comparison across departments" />
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={DEPT_RADAR_DATA} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="rgba(13,27,42,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} />
              <Radar name="Score" dataKey="A" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.12} strokeWidth={2} />
              <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
