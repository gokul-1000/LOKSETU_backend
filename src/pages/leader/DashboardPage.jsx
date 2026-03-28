import React, { useState, useEffect } from 'react'
import { FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, Brain } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import { KPICard, Card, SectionHeader, Badge, SentimentDot, ScoreRing } from '../../components/ui'
import { KPI_STATS, TREND_DATA, CATEGORY_DATA, AI_INSIGHTS, SENTIMENT_TREND } from '../../data/mockData'
import { complaintsAPI } from '../../api/client'
import { useApp } from '../../context/AppContext'

const ChartTooltip = ({ active, payload, label }) => {
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

const InsightCard = ({ insight }) => {
  const colors  = { critical: 'var(--red)', warning: 'var(--amber)', info: 'var(--blue-light)' }
  const icons   = { pattern: '⬡', prediction: '◈', sentiment: '◉', rootcause: '◎' }
  const color   = colors[insight.severity]
  return (
    <div style={{ padding: 'var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--canvas)', border: 'var(--border-strong)', borderLeft: `3px solid ${color}`, transition: 'var(--t-base)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--canvas)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15, color }}>{icons[insight.type]}</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{insight.title}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--ink-light)', whiteSpace: 'nowrap', marginLeft: 8 }}>{Math.round((Date.now() - new Date(insight.timestamp)) / 3600000)}h ago</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--ink-light)', lineHeight: 1.6, marginBottom: 8 }}>{insight.body}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ height: 3, width: 56, background: 'var(--canvas-warm)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${insight.confidence}%`, background: color, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>{insight.confidence}% confidence</span>
        </div>
        {insight.actionable && <button style={{ fontSize: 11, color: 'var(--blue-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Take Action →</button>}
      </div>
    </div>
  )
}

export default function LeaderDashboard() {
  const [recentComplaints, setRecentComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true)
        const response = await complaintsAPI.getAll({ limit: 5 })
        
        const mapped = (response.data?.data || []).map(c => ({
          id: c.complaintId || c.id,
          title: c.title,
          ward: c.ward || 'N/A',
          sentiment: (c.sentiment || 'COMPLAINT').toLowerCase(),
          status: (c.status || 'OPEN').toLowerCase(),
        }))
        
        setRecentComplaints(mapped)
      } catch (err) {
        console.error('Error fetching recent complaints:', err)
        setRecentComplaints([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecent()
  }, [])

  const recent = recentComplaints.length > 0 ? recentComplaints : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)', maxWidth: 1400 }} className="animate-fade-up">

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--sp-4)' }}>
        <KPICard label="Total Grievances"     value={KPI_STATS.totalComplaints.toLocaleString()} sub="All time"        icon={FileText}      color="var(--blue)"    trend="12%"  trendPositive={false} />
        <KPICard label="Resolved This Month"  value={KPI_STATS.resolvedThisMonth.toLocaleString()} sub="Mar 2024"     icon={CheckCircle}   color="var(--green)"   trend="8%"   trendPositive={true}  />
        <KPICard label="Avg Resolution"       value={`${KPI_STATS.avgResolutionDays}d`}           sub="Days/complaint" icon={Clock}         color="var(--amber)"   trend="0.3d" trendPositive={true}  />
        <KPICard label="Pending Escalations"  value={KPI_STATS.pendingEscalations}               sub="Require attention" icon={AlertTriangle} color="var(--red)"     trend="4"   trendPositive={false} />
        <KPICard label="Ward Health Avg"      value={`${KPI_STATS.wardHealthAvg}%`}               sub="Across 250 wards" icon={TrendingUp}    color="var(--blue)"    trend="3pts" trendPositive={true} />
        <KPICard label="AI Classified"        value={`${KPI_STATS.aiClassified}%`}                sub="Auto-routed"    icon={Brain}         color="var(--saffron)"               />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-5)' }}>

        {/* Trend chart */}
        <Card>
          <SectionHeader title="Complaint Trends" subtitle="6-month overview" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1A4B8C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A4B8C" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2A7A4B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2A7A4B" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,27,42,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="complaints" name="Filed"    stroke="#1A4B8C" strokeWidth={2} fill="url(#gComp)" dot={false} />
              <Area type="monotone" dataKey="resolved"   name="Resolved" stroke="#2A7A4B" strokeWidth={2} fill="url(#gRes)"  dot={false} />
              <Area type="monotone" dataKey="escalated"  name="Escalated" stroke="#C0392B" strokeWidth={1.5} fill="none"     dot={false} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category donut */}
        <Card>
          <SectionHeader title="By Category" />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginTop: 'var(--sp-3)' }}>
            {CATEGORY_DATA.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--ink-light)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                {d.name} <strong style={{ color: 'var(--ink)' }}>{d.value}%</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom grid: recent + AI + sentiment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)' }}>

        {/* Recent grievances */}
        <Card padding="0">
          <div style={{ padding: 'var(--sp-5) var(--sp-5) var(--sp-4)' }}>
            <SectionHeader title="Recent Grievances" subtitle="Latest submissions" action={
              <a href="/leader/complaints" style={{ fontSize: 12, color: 'var(--blue-light)', fontWeight: 500 }}>View all →</a>
            } />
          </div>
          {recent.map((c, i) => (
            <div key={c.id} style={{ padding: 'var(--sp-3) var(--sp-5)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', borderTop: i === 0 ? 'var(--border)' : 'none', borderBottom: 'var(--border)' }}>
              <SentimentDot sentiment={c.sentiment} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>{c.ward} · {c.id}</div>
              </div>
              <Badge variant={c.status}>{c.status}</Badge>
            </div>
          ))}
        </Card>

        {/* AI Insights preview */}
        <Card>
          <SectionHeader title="AI Insights" subtitle="Machine-detected patterns" action={
            <a href="/leader/ai-insights" style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 500 }}>All insights →</a>
          } />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {AI_INSIGHTS.slice(0, 3).map(ins => <InsightCard key={ins.id} insight={ins} />)}
          </div>
        </Card>
      </div>

      {/* Sentiment bar chart */}
      <Card>
        <SectionHeader title="Citizen Sentiment — This Week" subtitle="Emotional tone of submitted grievances" />
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={SENTIMENT_TREND} margin={{ top: 0, right: 4, bottom: 0, left: -20 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,27,42,0.05)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--ink-light)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 8 }} />
            <Bar dataKey="angry"       name="Angry"       stackId="a" fill="#C0392B" radius={[0,0,0,0]} />
            <Bar dataKey="frustrated"  name="Frustrated"  stackId="a" fill="#E8813A" />
            <Bar dataKey="neutral"     name="Neutral"     stackId="a" fill="#94A3B8" />
            <Bar dataKey="satisfied"   name="Satisfied"   stackId="a" fill="#2A7A4B" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
