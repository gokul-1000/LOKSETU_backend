import React, { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { Card, SectionHeader, Badge, ScoreRing } from '../../components/ui'
import { analyticsAPI } from '../../api/client'
import { TREND_DATA, SENTIMENT_TREND, DEPT_RADAR_DATA } from '../../data/mockData'

const RANGES = ['1m', '3m', '6m', '1y']

const Tooltip_ = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-md)', padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--ink-light)' }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const ZoneRow = ({ zone, rank }) => {
  const statusColor = zone.score >= 70 ? 'var(--green)' : zone.score >= 55 ? 'var(--amber)' : 'var(--red)'
  const statusLabel = zone.score >= 70 ? 'Healthy' : zone.score >= 55 ? 'Moderate' : 'Stressed'
  const statusVariant = zone.score >= 70 ? 'resolved' : zone.score >= 55 ? 'pending' : 'escalated'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: 'var(--border)' }}>
      <span style={{ fontSize: 11, color: 'var(--ink-light)', fontFamily: 'var(--font-mono)', width: 20, flexShrink: 0 }}>#{rank}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>{zone.name}</div>
        <div style={{ height: 4, background: 'var(--canvas-warm)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${zone.score}%`, background: statusColor, borderRadius: 2, transition: 'width 0.6s ease' }} />
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: statusColor, lineHeight: 1 }}>{zone.score}</div>
        <Badge variant={statusVariant} size="sm">{statusLabel}</Badge>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [range, setRange] = useState('6m')
  const [loading, setLoading] = useState(true)
  const [zones, setZones] = useState([])
  const [stats, setStats] = useState(null)
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const [statsRes, zonesRes, deptsRes] = await Promise.all([
        analyticsAPI.getStats(),
        analyticsAPI.getZones(),
        analyticsAPI.getDepartments(),
      ])

      setStats(statsRes)
      setZones(zonesRes)
      setDepartments(deptsRes)
      console.log('📊 Analytics data loaded:', { statsRes, zonesRes, deptsRes })
    } catch (error) {
      console.error('❌ Error loading analytics:', error)
      // Fallback to empty state
      setZones([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const sorted = [...DELHI_ZONES].sort((a, b) => b.score - a.score)

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>

      {/* Range switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {RANGES.map(r => (
          <button key={r} onClick={() => setRange(r)} style={{
            padding: '5px 14px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: range === r ? 600 : 400,
            background: range === r ? 'var(--ink)' : 'transparent',
            color: range === r ? 'white' : 'var(--ink-light)',
            border: 'var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>{r}</button>
        ))}
      </div>

      {/* Complaint volume + resolution */}
      <Card>
        <SectionHeader title="Complaint Volume & Resolution" subtitle="Trend over selected period" />
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1A4B8C" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1A4B8C" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2A7A4B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2A7A4B" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,27,42,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tooltip_ />} />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-body)' }} />
            <Area type="monotone" dataKey="complaints" name="Filed"     stroke="#1A4B8C" strokeWidth={2} fill="url(#gC)" dot={false} />
            <Area type="monotone" dataKey="resolved"   name="Resolved"  stroke="#2A7A4B" strokeWidth={2} fill="url(#gR)" dot={false} />
            <Area type="monotone" dataKey="escalated"  name="Escalated" stroke="#C0392B" strokeWidth={1.5} fill="none"   dot={false} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Sentiment + Dept radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <SectionHeader title="Weekly Sentiment" subtitle="Citizen emotional distribution" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SENTIMENT_TREND} margin={{ top: 0, right: 4, bottom: 0, left: -20 }} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,27,42,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-body)' }} />
              <Bar dataKey="angry"      name="Angry"       stackId="a" fill="#C0392B" />
              <Bar dataKey="frustrated" name="Frustrated"  stackId="a" fill="#E8813A" />
              <Bar dataKey="neutral"    name="Neutral"     stackId="a" fill="#94A3B8" />
              <Bar dataKey="satisfied"  name="Satisfied"   stackId="a" fill="#2A7A4B" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionHeader title="Department Performance" subtitle="Score comparison" />
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={DEPT_RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="rgba(13,27,42,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} />
              <Radar name="Score" dataKey="A" stroke="#1A4B8C" fill="#1A4B8C" fillOpacity={0.12} strokeWidth={2} />
              <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Dept performance cards + zone rankings */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>

        {/* Dept cards */}
        <Card>
          <SectionHeader title="Department SLA Breakdown" subtitle="Resolution rate & avg days" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {DEPARTMENTS.map(d => {
              const statusColor = d.status === 'on-track' ? 'var(--green)' : d.status === 'moderate' ? 'var(--amber)' : 'var(--red)'
              const statusLabel = d.status === 'on-track' ? 'On Track' : d.status === 'moderate' ? 'Moderate' : 'Needs Attention'
              const resRate = Math.round((d.resolved / d.assigned) * 100)
              return (
                <div key={d.id} style={{ background: 'var(--canvas)', borderRadius: 'var(--r-md)', padding: 14, border: 'var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <ScoreRing score={d.score} size={44} strokeWidth={4} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: statusColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{statusLabel}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
                    {[['Assigned', d.assigned], ['Resolved', d.resolved], ['Avg Days', `${d.avgDays}d`]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 10, color: 'var(--ink-light)', marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 15, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 4, background: 'var(--canvas-warm)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${resRate}%`, background: statusColor, borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--ink-light)', marginTop: 4, textAlign: 'right' }}>{resRate}% resolved</div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Zone rankings */}
        <Card>
          <SectionHeader title="Zone Rankings" subtitle="Health score — 14 Delhi zones" />
          <div style={{ overflowY: 'auto', maxHeight: 480 }}>
            {sorted.map((z, i) => <ZoneRow key={z.id} zone={z} rank={i + 1} />)}
          </div>
        </Card>
      </div>
    </div>
  )
}
