import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, User, Send, Camera, MapPin, Mic, CheckCircle, ChevronRight, AlertCircle, Edit3, Upload, AlertTriangle, X } from 'lucide-react'
import { Card, Button, Badge } from '../../components/ui'
import { complaintsAPI, llmAPI, imagesAPI } from '../../api/client'
import { useApp } from '../../context/AppContext'

const INITIAL_MSG = { role: 'ai', text: 'Namaste! I\'m your AI complaint assistant. Tell me what civic issue you\'re facing — describe it in your own words, in Hindi or English. I\'ll help you draft the perfect complaint.' }

export default function FileComplaintPage() {
  const navigate = useNavigate()
  const { user } = useApp()
  const [tab, setTab] = useState('ai')
  const [messages, setMessages] = useState([INITIAL_MSG])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [language, setLanguage] = useState('English')
  const [step, setStep] = useState('chat')
  const [draft, setDraft] = useState({ title: '', description: '', category: '', location: '', date: '' })
  const [selectedDept, setSelectedDept] = useState(0)
  const [deptSuggestions, setDeptSuggestions] = useState([])
  const [manualForm, setManualForm] = useState({ title: '', description: '', category: 'Roads', location: '' })
  const [submitting, setSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [imageVerification, setImageVerification] = useState({})
  const fileInputRef = useRef(null)
  const messagesRef = useRef(null)

  useEffect(() => { if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setIsTyping(true)

    try {
      // Send to LLM backend for conversation
      const response = await llmAPI.chat(
        messages.map(m => ({ role: m.role, content: m.text })).concat([{ role: 'user', content: userMsg }]),
        language
      )

      setIsTyping(false)
      
      // Axios wraps in response object, actual data is in response.data
      const data = response.data || response
      console.log('💬 Chat response:', data)
      
      // Extract text from response
      const aiResponse = data.response || data.data?.response || ''

      if (!aiResponse) {
        console.warn('⚠️ No response text found:', data)
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse || 'Unable to process response' }])
    } catch (error) {
      setIsTyping(false)
      // Fallback to demo response if API fails
      const fallbackResponse = `I've noted the details. Let me ask a follow-up question to better understand the issue...`
      setMessages(prev => [...prev, { role: 'ai', text: fallbackResponse }])
    }
  }

  const extractComplaint = async () => {
    if (messages.length < 3) {
      alert('Please have a conversation with the AI first (at least 1 message exchange)')
      return
    }

    setIsTyping(true)
    try {
      // Filter out the initial AI greeting message - only use user messages and AI responses after that
      const relevantMessages = messages.slice(1).filter(m => m.text !== INITIAL_MSG.text)
      
      if (relevantMessages.length === 0) {
        throw new Error('No user input found')
      }

      // Extract only user messages for the description
      const userMessages = relevantMessages.filter(m => m.role === 'user').map(m => m.text)
      const complaintDescription = userMessages.join('\n').trim()
      
      if (!complaintDescription) {
        throw new Error('Please describe your issue first')
      }

      // Use first user message as title
      const title = userMessages[0] || 'Civic Complaint'

      console.log('📝 Extracting complaint:', { title, complaintDescription })

      const response = await llmAPI.orchestrate(title, complaintDescription, language)
      
      setIsTyping(false)

      const analysis = response.analysis || response
      console.log('🔍 AI Analysis:', analysis)

      setDraft({
        title: analysis.extractedTitle || title,
        description: complaintDescription,
        category: analysis.category || 'Infrastructure',
        location: analysis.location || 'Delhi',
        date: new Date().toISOString().split('T')[0],
        department: analysis.department,
      })

      setStep('verify')
    } catch (error) {
      setIsTyping(false)
      console.error('❌ Error extracting complaint:', error)
      alert('Could not extract complaint: ' + error.message)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const complaint = await complaintsAPI.createWithAI(
        draft.title,
        draft.description,
        language
      )
      
      setSubmitting(false)
      setTimeout(() => navigate('/citizen/complaints'), 500)
    } catch (error) {
      setSubmitting(false)
      alert('Failed to submit complaint: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleManualSubmit = async () => {
    setSubmitting(true)
    try {
      const complaint = await complaintsAPI.createManual(manualForm)
      setSubmitting(false)
      setTimeout(() => navigate('/citizen/complaints'), 500)
    } catch (error) {
      setSubmitting(false)
      alert('Failed to submit complaint: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      for (const file of files) {
        const response = await imagesAPI.verify(file, draft.category || 'Other')
        
        setUploadedImages(prev => [...prev, {
          file,
          filename: response.data.file.filename,
          path: response.data.file.path,
          verification: response.data.verification
        }])
        
        setImageVerification(prev => ({
          ...prev,
          [response.data.file.filename]: response.data.verification
        }))
      }
    } catch (error) {
      alert('Image upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (filename) => {
    setUploadedImages(prev => prev.filter(img => img.filename !== filename))
    setImageVerification(prev => {
      const newVer = { ...prev }
      delete newVer[filename]
      return newVer
    })
  }

  const CATEGORIES = ['Roads', 'Water & Sanitation', 'Electricity', 'Sanitation', 'Infrastructure', 'Encroachment', 'Environment', 'Parks', 'Noise Pollution', 'Other']

  if (!user) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Please log in to file a complaint</div>
  }

  return (
    <div className="animate-fade-up" style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {['ai', 'manual'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 18px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: tab === t ? 600 : 400, background: tab === t ? 'var(--blue)' : 'var(--surface)', color: tab === t ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all var(--t-fast)' }}>
            {t === 'ai' ? '🤖 AI Assistant' : '📝 Manual Form'}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>Language:</span>
          {['English', 'हिंदी', 'ਪੰਜਾਬੀ'].map(l => (
            <button key={l} onClick={() => setLanguage(l)} style={{ padding: '4px 10px', borderRadius: 'var(--r-full)', fontSize: 11, background: language === l ? 'var(--ink)' : 'var(--canvas)', color: language === l ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{l}</button>
          ))}
        </div>
      </div>

      {tab === 'ai' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
          {/* Chat panel */}
          <Card style={{ display: 'flex', flexDirection: 'column', height: '70vh' }} padding="0">
            <div style={{ padding: '14px 18px', borderBottom: 'var(--border)', background: 'var(--ink)', borderRadius: 'var(--r-lg) var(--r-lg) 0 0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>LokSetu AI Assistant</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Powered by Gemini · {language}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399' }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Online</span>
              </div>
            </div>

            <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.role === 'user' ? 'var(--blue)' : 'var(--canvas-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: 'var(--border)' }}>
                    {m.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color="var(--ink-light)" />}
                  </div>
                  <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: m.role === 'user' ? 'var(--blue)' : 'var(--surface)', color: m.role === 'user' ? 'white' : 'var(--ink)', fontSize: 13, lineHeight: 1.6, border: m.role === 'ai' ? 'var(--border)' : 'none', boxShadow: 'var(--shadow-xs)' }}>
                    {m.text}
                    {m.action === 'show_review' && (
                      <button onClick={() => setStep('verify')} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '7px 14px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                        Review & Submit <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--canvas-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--border)' }}>
                    <Bot size={14} color="var(--ink-light)" />
                  </div>
                  <div style={{ padding: '12px 16px', background: 'var(--surface)', border: 'var(--border)', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 150, 300].map(delay => (
                      <div key={delay} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blue)', animation: `bounce 1s ${delay}ms infinite` }} />
                    ))}
                    <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '12px 14px', borderTop: 'var(--border)', display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => fileInputRef.current?.click()} title="Upload photo" style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', border: 'var(--border)', background: 'var(--canvas)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-light)', flexShrink: 0, transition: 'all var(--t-fast)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-pale)'; e.currentTarget.style.color = 'var(--blue)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--canvas)'; e.currentTarget.style.color = 'var(--ink-light)' }}>
                <Camera size={15} />
              </button>
              <button type="button" title="Location" style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', border: 'var(--border)', background: 'var(--canvas)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-light)', flexShrink: 0 }}><MapPin size={15} /></button>
              <button type="button" title="Voice input" style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', border: 'var(--border)', background: 'var(--canvas)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-light)', flexShrink: 0 }}><Mic size={15} /></button>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder={`Describe your issue in ${language}…`} style={{ flex: 1, padding: '8px 14px', border: 'var(--border)', borderRadius: 'var(--r-md)', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--canvas)' }}
                onFocus={e => e.target.style.borderColor = 'var(--blue-light)'}
                onBlur={e => e.target.style.borderColor = 'rgba(13,27,42,0.08)'} />
              <button type="button" onClick={sendMessage} disabled={isTyping} style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: 'var(--blue)', border: 'none', cursor: isTyping ? 'not-allowed' : 'pointer', opacity: isTyping ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Send size={15} color="white" />
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>
          </Card>

          {/* Right panel: verify step or dept suggestion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {step === 'chat' && (
              <>
                <Card style={{ background: 'var(--ink)', border: 'none' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>How the AI helps</div>
                  {[
                    { icon: '🔍', text: 'Extracts title, category, location & date from your description' },
                    { icon: '🏢', text: 'Maps to the right Delhi department from 90+ options' },
                    { icon: '⚡', text: 'Scores urgency 1–10 based on safety, SLA history & sentiment' },
                    { icon: '🌐', text: 'Works in Hindi, Punjabi, English — you choose' },
                    { icon: '📷', text: 'Attach photos and AI describes the issue from the image' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                      <span style={{ flexShrink: 0 }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </Card>
                
                {messages.length > 1 && (
                  <Card>
                    <button onClick={extractComplaint} disabled={isTyping} style={{ width: '100%', padding: '11px', background: isTyping ? '#ccc' : 'var(--saffron)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: isTyping ? 'not-allowed' : 'pointer', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {isTyping ? 'Extracting...' : (<><Edit3 size={15} /> Extract & Review</>)}
                    </button>
                  </Card>
                )}
              </>
            )}

            {step === 'verify' && (
              <>
                <Card>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Draft Review</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[['Title', draft.title || 'Civic infrastructure complaint'], ['Category', draft.category || 'Infrastructure'], ['Location', draft.location || 'Delhi'], ['Date', draft.date]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 10, color: 'var(--ink-light)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{l}</div>
                        <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Image Upload Section */}
                <Card>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Camera size={16} /> Add Proof Images
                  </div>
                  
                  {uploadedImages.length === 0 ? (
                    <label style={{ display: 'block', border: '2px dashed var(--blue)', borderRadius: 'var(--r-lg)', padding: 24, textAlign: 'center', cursor: 'pointer', transition: 'all var(--t-fast)', background: 'var(--blue-pale)' }}>
                      <Upload size={32} color="var(--blue)" style={{ margin: '0 auto 12px' }} />
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', marginBottom: 4 }}>Click to upload proof images</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>JPEG, PNG or WebP (max 10MB)<br />Shows original location & condition</div>
                      <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, padding: '12px', background: 'var(--canvas)', borderRadius: 8, alignItems: 'start' }}>
                          <img src={URL.createObjectURL(img.file)} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <div style={{ fontWeight: 600, fontSize: 12 }}>{img.file.name}</div>
                              <button onClick={() => removeImage(img.filename)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', marginLeft: 'auto' }}>
                                <X size={16} />
                              </button>
                            </div>

                            {/* Verification Results */}
                            {img.verification && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {img.verification.aiGeneration?.isAIGenerated ? (
                                    <>
                                      <AlertTriangle size={14} color="var(--red)" />
                                      <span style={{ color: 'var(--red)' }}>⚠️ May be AI-generated ({((1 - img.verification.aiGeneration.confidence) * 100).toFixed(0)}% real)</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle size={14} color="var(--green)" />
                                      <span style={{ color: 'var(--green)' }}>✓ Authentic image</span>
                                    </>
                                  )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {img.verification.relevance?.isRelevant ? (
                                    <>
                                      <CheckCircle size={14} color="var(--green)" />
                                      <span style={{ color: 'var(--green)' }}>✓ Relevant to complaint</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle size={14} color="var(--amber)" />
                                      <span style={{ color: 'var(--amber)' }}>⚠️ May not match category</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <button onClick={() => fileInputRef.current?.click()} style={{ padding: '8px 12px', border: 'var(--border)', borderRadius: 'var(--r-md)', background: 'var(--surface)', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--blue)' }}>
                        + Add more images
                      </button>
                    </div>
                  )}
                </Card>

                <Card>
                  <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', padding: '11px', background: submitting ? '#ccc' : 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {submitting ? 'Submitting...' : (<><CheckCircle size={15} /> Confirm & Submit</>)}
                  </button>
                </Card>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'manual' && (
        <Card style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 20 }}>Manual Complaint Form</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Complaint Title', key: 'title', type: 'input', placeholder: 'Brief title describing the issue' },
              { label: 'Location (Street / Landmark / Ward)', key: 'location', type: 'input', placeholder: 'e.g. MG Road near Karol Bagh Metro, Ward 12' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-light)', marginBottom: 6 }}>{label}</div>
                <input value={manualForm[key]} onChange={e => setManualForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} style={{ width: '100%', padding: '9px 14px', border: 'var(--border)', borderRadius: 'var(--r-md)', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--ink)', background: 'var(--canvas)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue-light)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(13,27,42,0.08)'} />
              </div>
            ))}

            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-light)', marginBottom: 6 }}>Category</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setManualForm(f => ({ ...f, category: cat }))} style={{ padding: '5px 12px', borderRadius: 'var(--r-full)', fontSize: 12, background: manualForm.category === cat ? 'var(--blue)' : 'var(--canvas)', color: manualForm.category === cat ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all var(--t-fast)' }}>{cat}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-light)', marginBottom: 6 }}>Description</div>
              <textarea value={manualForm.description} onChange={e => setManualForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the issue in detail — when it started, how severe, who is affected…" rows={4} style={{ width: '100%', padding: '9px 14px', border: 'var(--border)', borderRadius: 'var(--r-md)', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--ink)', background: 'var(--canvas)', resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = 'var(--blue-light)'}
                onBlur={e => e.target.style.borderColor = 'rgba(13,27,42,0.08)'} />
            </div>

            <button onClick={handleManualSubmit} disabled={submitting} style={{ padding: '11px', background: submitting ? '#ccc' : 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {submitting ? 'Submitting...' : (<><Send size={15} /> Submit Complaint</>)}
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}