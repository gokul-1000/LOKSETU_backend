import React, { useState, useEffect } from 'react'
import { ChevronRight, AlertCircle, CheckCircle, AlertTriangle, Upload, ZoomIn, Shield, AlertCircle as AlertIcon } from 'lucide-react'
import { Card, Badge, Button } from '../../components/ui'
import { complaintsAPI, imagesAPI } from '../../api/client'

const ImageVerificationPanel = ({ complaint }) => {
  if (!complaint.images || complaint.images.length === 0) {
    return (
      <Card style={{ padding: '16px', background: 'var(--amber-pale)', border: '1px solid var(--amber)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <AlertIcon size={20} color="var(--amber)" />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--amber)', marginBottom: 4 }}>No proof images attached</div>
            <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Request citizen to upload evidence photos</div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {complaint.images.map((img, idx) => (
        <Card key={idx} style={{ overflow: 'hidden' }}>
          {/* Image Verification Results */}
          <div style={{ padding: '16px', borderBottom: 'var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <img src={img.path} alt="Complaint proof" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Uploaded {new Date(img.uploadedAt).toLocaleDateString()}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>Size: {(img.size / 1024).toFixed(1)}KB</div>
              </div>
            </div>

            {/* AI Generation Check */}
            <div style={{ marginBottom: 12, padding: '10px 12px', background: 'var(--canvas)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {img.verification?.aiGeneration?.isAIGenerated ? (
                  <AlertTriangle size={16} color="var(--red)" />
                ) : (
                  <CheckCircle size={16} color="var(--green)" />
                )}
                <span style={{ fontWeight: 600, fontSize: 12 }}>AI Detection</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-light)' }}>
                  {((1 - img.verification?.aiGeneration?.confidence) * 100).toFixed(0)}% authentic
                </span>
              </div>
              {img.verification?.aiGeneration?.confidence > 0.5 && (
                <div style={{ fontSize: 11, color: 'var(--red)', padding: '6px 0' }}>
                  ⚠️ Image may be AI-generated. Verify manually before accepting.
                </div>
              )}
            </div>

            {/* Relevance Check */}
            <div style={{ padding: '10px 12px', background: 'var(--canvas)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {img.verification?.relevance?.isRelevant ? (
                  <CheckCircle size={16} color="var(--green)" />
                ) : (
                  <AlertIcon size={16} color="var(--amber)" />
                )}
                <span style={{ fontWeight: 600, fontSize: 12 }}>Relevance Check</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-light)' }}>
                  {(img.verification?.relevance?.relevanceScore * 100).toFixed(0)}% match
                </span>
              </div>
              {!img.verification?.relevance?.isRelevant && (
                <div style={{ fontSize: 11, color: 'var(--amber)', padding: '6px 0' }}>
                  ⚠️ Image may not match the complaint category. Review carefully.
                </div>
              )}
            </div>
          </div>

          {/* Overall Verdict */}
          <div style={{ padding: '12px 16px', background: img.verification?.verdict?.isValid ? 'var(--green-pale)' : 'var(--amber-pale)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {img.verification?.verdict?.isValid ? (
                <CheckCircle size={16} color="var(--green)" />
              ) : (
                <AlertTriangle size={16} color="var(--amber)" />
              )}
              <span style={{ fontWeight: 600, fontSize: 12, color: img.verification?.verdict?.isValid ? 'var(--green)' : 'var(--amber)' }}>
                {img.verification?.verdict?.isValid ? 'Image Verified ✓' : 'Manual Review Needed'}
              </span>
            </div>
            {img.verification?.verdict?.warnings?.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-light)' }}>
                {img.verification.verdict.warnings.map((w, i) => (
                  <div key={i}>• {w}</div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function AdminComplaintProcessor() {
  const [complaints, setComplaints] = useState([])
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [filter, setFilter] = useState('pending') // pending, assigned, resolved
  const [loading, setLoading] = useState(true)
  const [responseText, setResponseText] = useState('')
  const [responseStatus, setResponseStatus] = useState('ACKNOWLEDGED')

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        const filterMap = {
          pending: 'OPEN',
          assigned: 'IN_PROGRESS',
          resolved: 'RESOLVED'
        }
        const response = await complaintsAPI.getAll({ status: filterMap[filter] })
        setComplaints(response.data?.data || [])
      } catch (err) {
        console.error('Error fetching complaints:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [filter])

  const handleAddResponse = async () => {
    if (!selectedComplaint || !responseText.trim()) return

    try {
      await complaintsAPI.addUpdate(selectedComplaint.complaintId, responseText)
      
      if (responseStatus !== selectedComplaint.status) {
        await complaintsAPI.updateStatus(selectedComplaint.complaintId, responseStatus)
      }

      // Refresh complaints
      const response = await complaintsAPI.getAll({ status: selectedComplaint.status })
      setComplaints(response.data?.data || [])
      
      setResponseText('')
      setSelectedComplaint(null)
    } catch (err) {
      console.error('Error adding response:', err)
    }
  }

  return (
    <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 1400 }}>
      {/* Complaints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Complaints Queue</h2>
          <div style={{ display: 'flex', gap: 6 }}>
            {['pending', 'assigned', 'resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: filter === f ? 600 : 400, background: filter === f ? 'var(--ink)' : 'var(--canvas)', color: filter === f ? 'white' : 'var(--ink-light)', border: 'var(--border)', cursor: 'pointer', textTransform: 'capitalize' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-light)' }}>Loading...</div>
          ) : complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-light)' }}>No complaints in this category</div>
          ) : (
            complaints.map(c => (
              <Card key={c.id} style={{ cursor: 'pointer', padding: '14px 16px', border: selectedComplaint?.id === c.id ? '2px solid var(--blue)' : 'var(--border)', background: selectedComplaint?.id === c.id ? 'var(--blue-pale)' : 'white', transition: 'all var(--t-fast)' }}
                onClick={() => setSelectedComplaint(c)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>ID: {c.complaintId}</div>
                  </div>
                  <Badge variant={c.priority}>{c.priority}</Badge>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-light)', display: 'flex', gap: 10 }}>
                  <span>{c.category}</span>
                  <span>·</span>
                  <span>{c.ward}</span>
                  <span>·</span>
                  <span>{c.urgency}/10 urgency</span>
                </div>
                {c.images?.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                    {c.images.slice(0, 3).map((img, i) => (
                      <img key={i} src={img.path} alt="proof" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                    ))}
                    {c.images.length > 3 && <div style={{ fontSize: 10, color: 'var(--ink-light)', padding: '4px 8px' }}>+{c.images.length - 3}</div>}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Detail & Processing Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {selectedComplaint ? (
          <>
            {/* Complaint Details */}
            <Card>
              <div style={{ padding: 16, borderBottom: 'var(--border)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{selectedComplaint.title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  <div><span style={{ color: 'var(--ink-light)' }}>ID:</span> {selectedComplaint.complaintId}</div>
                  <div><span style={{ color: 'var(--ink-light)' }}>Category:</span> {selectedComplaint.category}</div>
                  <div><span style={{ color: 'var(--ink-light)' }}>Ward:</span> {selectedComplaint.ward}</div>
                  <div><span style={{ color: 'var(--ink-light)' }}>Priority:</span> <Badge variant={selectedComplaint.priority}>{selectedComplaint.priority}</Badge></div>
                </div>
              </div>

              <div style={{ padding: 16, borderBottom: 'var(--border)', background: 'var(--blue-pale)', borderLeft: '3px solid var(--blue)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>AI Summary</div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{selectedComplaint.aiSummary || selectedComplaint.description.substring(0, 200)}</div>
              </div>

              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Full Description</div>
                <div style={{ fontSize: 12, color: 'var(--ink-light)', lineHeight: 1.8 }}>{selectedComplaint.description}</div>
              </div>
            </Card>

            {/* AI Recommendations */}
            {selectedComplaint.department && (
              <Card style={{ padding: 16, background: 'var(--green-pale)', borderLeft: '4px solid var(--green)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Shield size={20} color="var(--green)" style={{ marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--green)', marginBottom: 4 }}>AI Recommendation</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                      Route to <strong>{selectedComplaint.department}</strong><br />
                      Confidence: {(selectedComplaint.confidence || 80).toFixed(0)}%<br />
                      SLA: {selectedComplaint.sla || '48 hours'}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Image Verification */}
            <ImageVerificationPanel complaint={selectedComplaint} />

            {/* Response Form */}
            <Card>
              <div style={{ padding: 16, borderBottom: 'var(--border)' }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>Send Update</div>
                <textarea value={responseText} onChange={e => setResponseText(e.target.value)} placeholder="Enter your response or action taken..."
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12, outline: 'none', resize: 'vertical', minHeight: 100 }} />
              </div>
              <div style={{ padding: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={responseStatus} onChange={e => setResponseStatus(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12, outline: 'none' }}>
                  <option value="ACKNOWLEDGED">Acknowledged</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="RESOLVED">Mark Resolved</option>
                </select>
                <Button onClick={handleAddResponse} style={{ marginLeft: 'auto' }}>Send Update</Button>
              </div>
            </Card>
          </>
        ) : (
          <Card style={{ padding: 40, textAlign: 'center', color: 'var(--ink-light)' }}>
            <ChevronRight size={48} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
            <div>Select a complaint to process</div>
          </Card>
        )}
      </div>
    </div>
  )
}
