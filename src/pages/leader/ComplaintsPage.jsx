import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Filter, Plus, X, User, Calendar, Tag, ChevronRight, MessageSquare, AlertCircle, Send, Bot, Zap, Copy, Check } from 'lucide-react'
import { Badge, Card, Button, SentimentDot, Divider, EmptyState } from '../../components/ui'
import { complaintsAPI, llmAPI } from '../../api/client'
import { useApp } from '../../context/AppContext'

const STATUS_OPTS = ['all', 'open', 'progress', 'pending', 'escalated', 'resolved', 'closed']
const PRIORITY_OPTS = ['all', 'critical', 'high', 'medium', 'low']

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
        <span>{c.ward}</span><span>·</span><span>{c.id}</span><span>·</span><span style={{ textTransform: 'capitalize' }}>{c.channel}</span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <Badge variant={c.priority}>{c.priority}</Badge>
      <Badge variant={c.status}>{c.status}</Badge>
      <ChevronRight size={14} color="var(--ink-light)" />
    </div>
  </div>
)

const ResolveModal = ({ complaint: c, onClose, onResolve }) => {
  const [resolution, setResolution] = useState('')
  const [status, setStatus] = useState(c.status)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  const generateAISuggestion = async () => {
    setLoadingAI(true)
    try {
      const response = await llmAPI.chat([
        {
          role: 'user',
          content: `Based on this complaint, suggest a resolution approach:\n\nTitle: ${c.title}\nDescription: ${c.description}\nCategory: ${c.category}\nDepartment: ${c.department}\nUrgency: ${c.urgency}/10\n\nProvide a brief, practical resolution approach.`
        }
      ], 'English')
      const suggestion = response.data?.response || response.data || ''
      setAiSuggestion(suggestion)
    } catch (error) {
      setAiSuggestion('Unable to generate AI suggestion. Please provide your own resolution.')
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSubmit = async () => {
    if (!resolution.trim()) return
    setIsSubmitting(true)
    try {
      // Update complaint status
      await complaintsAPI.updateStatus(c.id, status)
      
      // Add resolution message visible to citizen
      const message = `Resolution from ${status === 'resolved' ? 'Department' : 'Officer'}:\n\n${resolution}`
      await complaintsAPI.addUpdate(c.id, message)
      
      onResolve({ id: c.id, resolution, status })
      onClose()
    } catch (error) {
      console.error('Error resolving complaint:', error)
      alert('Error updating complaint. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1002 }} onClick={onClose}>
      <Card style={{ background: 'white', maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px', borderBottom: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Resolve Complaint</h2>
            <p style={{ fontSize: 12, color: 'var(--ink-light)' }}>ID: {c.id}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Complaint Info */}
          <div style={{ background: 'var(--blue-pale)', borderRadius: 'var(--r-md)', padding: '12px 16px', borderLeft: '4px solid var(--blue)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--blue)' }}>{c.title}</div>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 8 }}>{c.description}</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
              <div><strong>Category:</strong> {c.category}</div>
              <div><strong>Department:</strong> {c.department}</div>
              <div><strong>Urgency:</strong> {c.urgency}/10</div>
            </div>
          </div>

          {/* AI Suggestion */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>🤖 AI Suggestion</label>
              <button onClick={generateAISuggestion} disabled={loadingAI} style={{ fontSize: 11, padding: '4px 10px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: loadingAI ? 'not-allowed' : 'pointer', opacity: loadingAI ? 0.7 : 1 }}>
                {loadingAI ? 'Analyzing...' : 'Get Suggestion'}
              </button>
            </div>
            {aiSuggestion && (
              <div style={{ background: 'var(--canvas-warm)', borderRadius: 'var(--r-md)', padding: '12px', fontSize: 12, lineHeight: 1.6, color: 'var(--ink-muted)', border: 'var(--border)' }}>
                {aiSuggestion}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 8, display: 'block' }}>Resolution Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: 'var(--border)', borderRadius: 'var(--r-md)', fontSize: 12, fontFamily: 'var(--font-body)', outline: 'none' }}>
              <option value="progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalate</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Resolution Details */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 8, display: 'block' }}>Resolution Details</label>
            <textarea 
              value={resolution} 
              onChange={e => setResolution(e.target.value)} 
              placeholder="Describe what action was taken to resolve this complaint..." 
              style={{ width: '100%', minHeight: 120, padding: '12px', border: 'var(--border)', borderRadius: 'var(--r-md)', fontSize: 12, fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }}
            />
            <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 4 }}>{resolution.length} / 500 characters</div>
          </div>

          {/* Send to Citizen */}
          <div style={{ background: 'var(--green-pale)', borderRadius: 'var(--r-md)', padding: '12px 16px', border: '1px solid rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <MessageSquare size={16} color="var(--green)" />
            <div style={{ fontSize: 12, flex: 1 }}>
              <strong>Notify Citizen:</strong> This resolution will be sent to the citizen as a message.
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderTop: 'var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting || !resolution.trim()}>
            {isSubmitting ? 'Submitting...' : 'Resolve & Notify'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

const DetailPanel = ({ complaint: c, onClose, onResolve }) => {
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  if (!c) return (
    <div style={{ width: 340, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-lg)' }}>
      <div style={{ textAlign: 'center', padding: 32, color: 'var(--ink-light)' }}>
        <MessageSquare size={32} style={{ opacity: 0.2, marginBottom: 12 }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink)', marginBottom: 6 }}>Select a grievance</div>
        <div style={{ fontSize: 12 }}>Click any row to view details</div>
      </div>
    </div>
  )

  const urgencyColor = c.urgency >= 8 ? 'var(--red)' : c.urgency >= 5 ? 'var(--amber)' : 'var(--green)'

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMsg = { role: 'admin', text: chatInput }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setIsLoadingChat(true)

    try {
      const response = await llmAPI.chat(
        [{ role: 'user', content: `Complaint: ${c.title}\n\nDetails: ${c.description}\n\nAdmin asking: ${chatInput}` }],
        'English'
      )
      const aiResponse = response.data?.response || response.data || 'I need more information to assist with this complaint.'
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }])
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Unable to get AI analysis. Please try again.' }])
    } finally {
      setIsLoadingChat(false)
    }
  }

  return (
    <>
      <div style={{ width: 340, flexShrink: 0, background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideInRight 0.25s ease' }}>
        <div style={{ padding: '16px 20px', borderBottom: 'var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 6 }}>{c.title}</div>
            <div style={{ display: 'flex', gap: 6 }}><Badge variant={c.status}>{c.status}</Badge><Badge variant={c.priority}>{c.priority}</Badge></div>
          </div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', color: 'var(--ink-light)', flexShrink: 0, padding: 4 }}><X size={14} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Complaint Summary */}
          <div style={{ background: 'var(--blue-pale)', borderRadius: 'var(--r-md)', padding: '10px 12px', borderLeft: '3px solid var(--blue)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 5 }}>Complaint Summary</div>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{c.description || c.aiSummary}</p>
          </div>

          {/* Meta Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[[User, 'Citizen', c.citizen], [Calendar, 'Filed', c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'], [Tag, 'Department', c.department], [Tag, 'Category', c.category], [AlertCircle, 'Zone', c.zone]].map(([Icon, label, value]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={13} color="var(--ink-light)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--ink-light)', width: 72, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500, wordBreak: 'break-word' }}>{value}</span>
              </div>
            ))}
          </div>

          <Divider />

          {/* Urgency + Sentiment */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 7 }}>Urgency</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 5, background: 'var(--canvas-warm)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.urgency * 10}%`, background: urgencyColor, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: urgencyColor, fontFamily: 'var(--font-mono)' }}>{c.urgency}/10</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 7 }}>Sentiment</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SentimentDot sentiment={c.sentiment} />
                <span style={{ fontSize: 12, textTransform: 'capitalize' }}>{c.sentiment}</span>
                <span style={{ fontSize: 11, color: 'var(--ink-light)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{Math.round((c.sentimentScore || 0.5) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {c.tags && c.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {c.tags.map(t => <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--canvas-warm)', borderRadius: 'var(--r-full)', color: 'var(--ink-light)' }}>#{t}</span>)}
            </div>
          )}
        </div>

        <div style={{ padding: '12px 16px', borderTop: 'var(--border)', display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowResolveModal(true)}>
            <Zap size={14} /> Resolve
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowChat(true)}>
            <Bot size={14} /> Ask AI
          </Button>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showChat && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }} onClick={() => setShowChat(false)}>
          <Card style={{ background: 'white', maxWidth: 500, width: '100%', height: '70vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Bot size={18} color="var(--blue)" />
                <div style={{ fontSize: 13, fontWeight: 600 }}>AI Analysis Assistant</div>
              </div>
              <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)' }}>
                <X size={18} />
              </button>
            </div>

            <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--ink-light)', padding: '20px 0' }}>
                  <Bot size={32} style={{ opacity: 0.2, margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 12 }}>Ask me to analyze this complaint or suggest next steps</div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'admin' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.role === 'admin' ? 'var(--blue)' : 'var(--canvas-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {msg.role === 'admin' ? <User size={14} color="white" /> : <Bot size={14} color="var(--ink-light)" />}
                  </div>
                  <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'admin' ? '12px 4px 12px 12px' : '4px 12px 12px 12px', background: msg.role === 'admin' ? 'var(--blue)' : 'var(--surface)', color: msg.role === 'admin' ? 'white' : 'var(--ink)', fontSize: 12, lineHeight: 1.6 }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 14px', borderTop: 'var(--border)', display: 'flex', gap: 8 }}>
              <input 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()} 
                placeholder="Ask about this complaint..." 
                style={{ flex: 1, padding: '8px 12px', border: 'var(--border)', borderRadius: 'var(--r-md)', fontSize: 12, outline: 'none' }}
              />
              <button onClick={handleSendChatMessage} disabled={isLoadingChat} style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: 'var(--blue)', border: 'none', cursor: isLoadingChat ? 'not-allowed' : 'pointer', opacity: isLoadingChat ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={14} color="white" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && <ResolveModal complaint={c} onClose={() => setShowResolveModal(false)} onResolve={onResolve} />}
    </>
  )
}

export default function ComplaintsPage() {
  const { searchQuery } = useApp()
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [selected, setSelected] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        const response = await complaintsAPI.getAll()
        
        // Map API response to UI format
        const complaintsData = Array.isArray(response.data) ? response.data : response.data?.data || []
        const mapped = complaintsData.map(c => ({
          id: c.complaintId || c.id,
          title: c.title || 'Untitled Complaint',
          ward: c.ward || 'N/A',
          zone: c.zone || 'N/A',
          channel: c.channel || 'digital',
          sentiment: (c.sentiment || 'neutral').toLowerCase(),
          sentimentScore: c.sentimentScore || 0.5,
          priority: (c.priority || 'MEDIUM').toLowerCase(),
          status: (c.status || 'OPEN').toLowerCase(),
          department: c.department || 'Not Assigned',
          urgency: c.urgency || 5,
          aiSummary: c.aiSummary || c.description?.substring(0, 200) || 'No summary available',
          citizen: c.citizen?.name || 'Anonymous',
          citizenId: c.citizenId,
          description: c.description || '',
          location: c.location || '',
          category: c.category || 'General',
          tags: c.tags || [],
          createdAt: c.createdAt,
          images: c.images || [],
        }))
        
        setComplaints(mapped)
        setError(null)
      } catch (err) {
        console.error('Error fetching complaints:', err)
        setError(err.response?.data?.error || 'Failed to fetch complaints')
        setComplaints([])
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const filtered = useMemo(() => {
    let result = complaints
    
    if (status !== 'all') {
      result = result.filter(c => c.status === status)
    }
    
    if (priority !== 'all') {
      result = result.filter(c => c.priority === priority)
    }
    
    if (searchQuery) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.ward.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return result
  }, [status, priority, searchQuery, complaints])

  const handleResolve = (resolution) => {
    // Update the complaint
    setComplaints(prev => 
      prev.map(c => 
        c.id === resolution.id 
          ? { ...c, status: resolution.status } 
          : c
      )
    )
    setSelected(null)
  }

  return (
    <div className="animate-fade-up" style={{ display: 'flex', height: 'calc(100vh - var(--header-h) - 48px)', gap: 18 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Card padding="10px 16px" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-light)' }}>
            <Filter size={13} /><span style={{ fontSize: 12, fontWeight: 500 }}>Filter</span>
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {STATUS_OPTS.map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{ padding: '3px 11px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: status === s ? 600 : 400, background: status === s ? 'var(--blue)' : 'var(--canvas)', color: status === s ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-body)' }}>{s}</button>
            ))}
          </div>
          <div style={{ width: 1, height: 18, background: 'var(--canvas-warm)' }} />
          <div style={{ display: 'flex', gap: 5 }}>
            {PRIORITY_OPTS.map(p => (
              <button key={p} onClick={() => setPriority(p)} style={{ padding: '3px 11px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: priority === p ? 600 : 400, background: priority === p ? 'var(--ink)' : 'var(--canvas)', color: priority === p ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-body)' }}>{p}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto' }}><Button variant="primary" size="sm" icon={Plus}>New Grievance</Button></div>
        </Card>

        <Card padding="0" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 20px', borderBottom: 'var(--border)', background: 'var(--canvas)' }}>
            <span style={{ width: 8 }} />
            <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Grievance</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 160, textAlign: 'right' }}>Priority / Status</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ink-light)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div>Loading complaints...</div>
                </div>
              </div>
            )}
            
            {error && !loading && (
              <div style={{ display: 'flex', alignments: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center', color: 'var(--red)', padding: 20 }}>
                  <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <div>{error}</div>
                </div>
              </div>
            )}
            
            {!loading && !error && filtered.length === 0
              ? <EmptyState icon={Filter} title="No results" body="Try adjusting your filters or search query" />
              : !loading && filtered.map(c => <ComplaintRow key={c.id} complaint={c} selected={selected?.id === c.id} onClick={setSelected} />)
            }
          </div>
          <div style={{ padding: '8px 20px', borderTop: 'var(--border)', fontSize: 11, color: 'var(--ink-light)', background: 'var(--canvas)' }}>
            Showing {filtered.length} of {complaints.length} grievances
          </div>
        </Card>
      </div>
      <DetailPanel complaint={selected} onClose={() => setSelected(null)} onResolve={handleResolve} />
    </div>
  )
}
