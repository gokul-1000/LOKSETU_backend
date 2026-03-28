import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Filter, Plus, X, User, Calendar, Tag, ChevronRight, MessageSquare, AlertCircle, Send, Bot, Zap, Clock } from 'lucide-react'
import { Badge, Card, Button, SentimentDot, Divider, EmptyState } from '../../components/ui'
import { complaintsAPI, llmAPI } from '../../api/client'
import { useApp } from '../../context/AppContext'

const STATUS_OPTS = ['all', 'open', 'progress', 'pending', 'escalated', 'resolved']
const PRIORITY_OPTS = ['all', 'critical', 'high', 'medium', 'low']

const SLABadge = ({ urgency }) => {
  if (urgency >= 8) return <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--red)', padding: '2px 8px', borderRadius: 99, background: 'var(--red-pale)' }}>URGENT</span>
  if (urgency >= 5) return <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--amber)', padding: '2px 8px', borderRadius: 99, background: 'var(--amber-pale)' }}>SOON ⚠</span>
  return <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', padding: '2px 8px', borderRadius: 99, background: 'var(--canvas-warm)' }}>NORMAL</span>
}

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
        <span>{c.citizen}</span><span>·</span><span>{c.id}</span><span>·</span><span>{c.category}</span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <SLABadge urgency={c.urgency} />
      <Badge variant={c.status}>{c.status}</Badge>
      <ChevronRight size={14} color="var(--ink-light)" />
    </div>
  </div>
)

// Placeholder for now - using Leader's version would be ideal
export default function ComplaintPage() {
  const { searchQuery } = useApp()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('all')

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        const response = await complaintsAPI.getAll()
        const data = Array.isArray(response.data) ? response.data : response.data?.data || []
        const mapped = data.map(c => ({
          id: c.complaintId || c.id,
          title: c.title || 'Untitled',
          citizen: c.citizen?.name || 'Anonymous',
          category: c.category || 'General',
          sentiment: (c.sentiment || 'neutral').toLowerCase(),
          status: (c.status || 'OPEN').toLowerCase(),
          urgency: c.urgency || 5,
          description: c.description || '',
          location: c.location || '',
          createdAt: c.createdAt,
        }))
        setComplaints(mapped)
      } catch (err) {
        setError('Failed to load complaints')
      } finally {
        setLoading(false)
      }
    }
    fetchComplaints()
  }, [])

  return (
    <div style={{ padding: 20, minHeight: '100vh' }}>
      <h1>Ward Officer - Field Complaints</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
      {complaints.map(c => (
        <div key={c.id} onClick={() => setSelected(c)} style={{ padding: 15, margin: 10, background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{c.title}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 8 }}>{c.description}</div>
        </div>
      ))}
    </div>
  )
}
