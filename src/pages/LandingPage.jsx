import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight, FileText, Shield, Search, Brain,
  Zap, CheckCircle, User, Building2, Crown, ChevronRight,
  MapPin, BarChart3, MessageSquare, Zap as Lightning, Droplets, Heart, Trash2,
} from 'lucide-react'
import { Button, StatPill } from '../components/ui'
import LanguageSwitcher from '../components/LanguageSwitcher'

/* ── Animated counter ───────────────────────────── */
const useCount = (target, duration = 1800) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const step = target / (duration / 16)
    let cur = 0
    const id = setInterval(() => {
      cur = Math.min(cur + step, target)
      setCount(Math.floor(cur))
      if (cur >= target) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [target])
  return count
}

/* ── Debate terminal ─────────────────────────────── */
const DEBATE_LINES = [
  { agent: 'Policy Enforcer',   color: '#60A5FA', msg: 'Bylaw §42.3 mandates PWD response within 48hrs for Category-A road damage.' },
  { agent: 'Evidence Reviewer', color: '#34D399', msg: 'Historical DB: 12 similar cases in Sector 22 — SLA breach pattern detected.' },
  { agent: 'Citizen Advocate',  color: '#F59E0B', msg: 'Citizen entitled to compensation under RTI §19 if unresolved >30 days.' },
  { agent: "Devil's Advocate",  color: '#F87171', msg: 'Jurisdiction overlap with MCD — secondary confirmation before routing.' },
  { agent: 'Chief Coordinator', color: '#A78BFA', msg: '{"status":"ESCALATED","dept":"PWD Engineering","urgency":8,"sla":"48h"}' },
  { agent: 'Policy Enforcer',   color: '#60A5FA', msg: 'Water Act §31 requires Water Board response within 24hrs for supply issues.' },
  { agent: 'Evidence Reviewer', color: '#34D399', msg: 'Pipeline rupture probability 87% based on complaint cluster in Ward 7.' },
  { agent: 'Chief Coordinator', color: '#A78BFA', msg: '{"status":"ESCALATED","dept":"Water Board","urgency":9,"priority":"CRITICAL"}' },
]

/* ── Departments Carousel ────────────────────────── */
/* ── Departments Carousel ────────────────────────── */
const DepartmentsCarousel = ({ showFeatured }) => {
  const getRandomColor = (index) => DEPT_COLORS[index % DEPT_COLORS.length]
  
  if (showFeatured) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, width: '100%' }}>
        {FEATURED_DEPARTMENTS.map((dept, i) => {
          const Icon = dept.icon
          return (
            <div 
              key={i} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '28px 20px', 
                borderRadius: 16, 
                background: `linear-gradient(135deg, ${dept.bgColor}, ${dept.color}08)`,
                border: `2px solid ${dept.color}30`,
                animation: `fadeIn 0.5s ease ${i * 0.1}s both`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.borderColor = dept.color
                e.currentTarget.style.boxShadow = `0 12px 32px ${dept.color}20`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = `${dept.color}30`
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${dept.color}10`, opacity: 0.5 }} />
              <div style={{ width: 56, height: 56, borderRadius: 12, background: `${dept.color}15`, border: `2px solid ${dept.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 16, position: 'relative', zIndex: 1 }}>
                <Icon size={28} color={dept.color} />
              </div>
              <div style={{ fontWeight: 700, color: dept.color, fontSize: 16, marginBottom: 6, position: 'relative', zIndex: 1 }}>{dept.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', position: 'relative', zIndex: 1 }}>{dept.description}</div>
            </div>
          )
        })}
      </div>
    )
  }

  // Categorized all departments view
  const categories = {
    'Power & Utilities': ['BSES Rajdhani Power Ltd', 'BSES Yamuna Power Ltd', 'Delhi Transco Ltd', 'Indraprastha Gas Limited', 'Tata Power Delhi Distribution Ltd'],
    'Water & Sanitation': ['Delhi Jal Board', 'Delhi Commission for Safai Karamcharis'],
    'Public Services': ['Delhi Police', 'Delhi Fires Services', 'Delhi Transport Corporation', 'Delhi Metro Rail Corporation Ltd', 'Public Works Department'],
    'Women & Children': ['Delhi Commission for Women', 'Women and Child Development Department'],
    'Health & Education': ['Department of Health and Family Welfare', 'Education Department', 'Higher Education Department'],
    'Infrastructure': ['Delhi Development Authority', 'Department of Land and Building', 'Urban Development', 'Department of Environment'],
    'Legal & Admin': ['Law, Justice and Legislative Affairs', 'Delhi Legislative Assembly', 'Office of the Chief Secretary GNCT of Delhi'],
    'Other Departments': ALL_DEPARTMENTS.filter(d => !['BSES Rajdhani Power Ltd', 'BSES Yamuna Power Ltd', 'Delhi Transco Ltd', 'Indraprastha Gas Limited', 'Tata Power Delhi Distribution Ltd', 'Delhi Jal Board', 'Delhi Commission for Safai Karamcharis', 'Delhi Police', 'Delhi Fires Services', 'Delhi Transport Corporation', 'Delhi Metro Rail Corporation Ltd', 'Public Works Department', 'Delhi Commission for Women', 'Women and Child Development Department', 'Department of Health and Family Welfare', 'Education Department', 'Higher Education Department', 'Delhi Development Authority', 'Department of Land and Building', 'Urban Development', 'Department of Environment', 'Law, Justice and Legislative Affairs', 'Delhi Legislative Assembly', 'Office of the Chief Secretary GNCT of Delhi'].includes(d))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {Object.entries(categories).map(([category, depts], catIdx) => (
        <div key={category} style={{ animation: `fadeIn 0.6s ease ${catIdx * 0.08}s both`, opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--saffron)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--saffron)' }} />
            {category} ({depts.length})
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {depts.map((dept, idx) => (
              <div
                key={`${category}-${idx}`}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  background: `${getRandomColor(catIdx * 10 + idx)}12`,
                  border: `1.5px solid ${getRandomColor(catIdx * 10 + idx)}40`,
                  fontSize: 12,
                  color: getRandomColor(catIdx * 10 + idx),
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px',
                  animation: `pulse${(catIdx * 10 + idx) % 3} 2.5s ease-in-out infinite`,
                  animationDelay: `${(catIdx * 10 + idx) * 0.05}s`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${getRandomColor(catIdx * 10 + idx)}25`
                  e.currentTarget.style.borderColor = getRandomColor(catIdx * 10 + idx)
                  e.currentTarget.style.transform = 'scale(1.08)'
                  e.currentTarget.style.boxShadow = `0 6px 16px ${getRandomColor(catIdx * 10 + idx)}35`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${getRandomColor(catIdx * 10 + idx)}12`
                  e.currentTarget.style.borderColor = `${getRandomColor(catIdx * 10 + idx)}40`
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {dept}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const DepartmentsSection = () => {
  const [showFeatured, setShowFeatured] = useState(false)
  const [autoSwitch, setAutoSwitch] = useState(true)

  useEffect(() => {
    if (!autoSwitch) return
    
    const timer1 = setTimeout(() => setShowFeatured(true), 5000)
    const timer2 = setTimeout(() => setShowFeatured(false), 9000)
    const interval = setInterval(() => {
      setShowFeatured(prev => !prev)
    }, 14000)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearInterval(interval)
    }
  }, [autoSwitch])

  const handleToggle = (featured) => {
    setShowFeatured(featured)
    setAutoSwitch(false)
  }

  return (
    <section style={{ background: 'var(--ink)', padding: '100px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,129,58,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 16, display: 'inline-block', background: 'rgba(232,129,58,0.15)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(232,129,58,0.3)' }}>Department Coverage</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: 'white', marginBottom: 16, fontWeight: 700, lineHeight: 1.2 }}>Connect with <span style={{ color: 'var(--saffron)', fontStyle: 'italic' }}>90+ Government</span> Agencies</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 650, margin: '0 auto', lineHeight: 1.7 }}>Your complaint reaches the right Delhi department instantly. From utilities to social services, LokSetu routes to every civic authority.</p>
        </div>

        {/* Toggle Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
          <button
            onClick={() => handleToggle(false)}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: showFeatured ? '1px solid rgba(255,255,255,0.2)' : '2px solid var(--saffron)',
              background: showFeatured ? 'rgba(255,255,255,0.05)' : 'rgba(232,129,58,0.15)',
              color: showFeatured ? 'rgba(255,255,255,0.4)' : 'var(--saffron)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (showFeatured) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              }
            }}
            onMouseLeave={(e) => {
              if (showFeatured) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }
            }}
          >
            <span>🔍</span> All Departments
          </button>
          <button
            onClick={() => handleToggle(true)}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: !showFeatured ? '1px solid rgba(255,255,255,0.2)' : '2px solid var(--saffron)',
              background: !showFeatured ? 'rgba(255,255,255,0.05)' : 'rgba(232,129,58,0.15)',
              color: !showFeatured ? 'rgba(255,255,255,0.4)' : 'var(--saffron)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (!showFeatured) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              }
            }}
            onMouseLeave={(e) => {
              if (!showFeatured) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }
            }}
          >
            <span>⭐</span> Most-Used Services
          </button>
          <button
            onClick={() => setAutoSwitch(!autoSwitch)}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              background: autoSwitch ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
              color: autoSwitch ? 'white' : 'rgba(255,255,255,0.4)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = autoSwitch ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'
              e.currentTarget.style.color = autoSwitch ? 'white' : 'rgba(255,255,255,0.4)'
            }}
          >
            <span>{autoSwitch ? '▶️' : '⏸'}</span> {autoSwitch ? 'Auto-Switch On' : 'Auto-Switch Off'}
          </button>
        </div>

        {/* Main carousel container with smooth transition */}
        <div style={{ 
          minHeight: showFeatured ? 300 : 600,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          transition: 'min-height 0.6s ease',
        }}>
          <div style={{ 
            width: '100%',
            opacity: showFeatured ? 1 : 0,
            visibility: showFeatured ? 'visible' : 'hidden',
            transition: 'opacity 0.6s ease, visibility 0.6s ease',
            position: showFeatured ? 'relative' : 'absolute',
          }}>
            {showFeatured && <DepartmentsCarousel showFeatured={true} />}
          </div>
          <div style={{ 
            width: '100%',
            opacity: !showFeatured ? 1 : 0,
            visibility: !showFeatured ? 'visible' : 'hidden',
            transition: 'opacity 0.6s ease, visibility 0.6s ease',
            position: !showFeatured ? 'relative' : 'absolute',
          }}>
            {!showFeatured && <DepartmentsCarousel showFeatured={false} />}
          </div>
        </div>

        {/* Progress indicators */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 48, alignItems: 'center' }}>
          <button
            onClick={() => handleToggle(false)}
            style={{ 
              width: !showFeatured ? 24 : 8, 
              height: 8, 
              borderRadius: 999, 
              background: !showFeatured ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
            }}
          />
          <button
            onClick={() => handleToggle(true)}
            style={{ 
              width: showFeatured ? 24 : 8, 
              height: 8, 
              borderRadius: 999, 
              background: showFeatured ? 'var(--saffron)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
            }}
          />
        </div>

        {/* Mode label */}
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', transition: 'all 0.4s ease' }}>
          {autoSwitch ? (showFeatured ? '⭐ Most-used services' : '🔍 Browsing all departments') + ' — Auto-switching every 14 seconds' : '🎮 Manual mode - Choose what you want to see'}
        </div>

        {/* CTA Section */}
        <div style={{ marginTop: 56, textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            size="lg" 
            onClick={() => navigate('/login?role=citizen')} 
            style={{ background: 'var(--saffron)', fontSize: 15, padding: '13px 28px', gap: 10 }}
          >
            <ArrowRight size={17} /> File a Complaint Now
          </Button>
          <Button 
            variant="outline-light" 
            size="lg" 
            style={{ fontSize: 15, padding: '13px 24px', cursor: 'pointer' }}
          >
            View Full Department List
          </Button>
        </div>
      </div>
    </section>
  )
}

const DebateTerminal = () => {
  const [lines, setLines] = useState([])
  const [cursor, setCursor] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const id = setInterval(() => {
      setLines(prev => {
        const next = [...prev, DEBATE_LINES[cursor % DEBATE_LINES.length]]
        return next.length > 6 ? next.slice(1) : next
      })
      setCursor(c => c + 1)
    }, 1900)
    return () => clearInterval(id)
  }, [cursor])

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight }, [lines])

  return (
    <div ref={ref} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.75, height: 220, overflow: 'hidden', backdropFilter: 'blur(8px)' }}>
      <div style={{ color: 'rgba(255,255,255,0.25)', marginBottom: 12, fontSize: 10, letterSpacing: '0.1em' }}>◉ AI DEBATE ENGINE — LIVE</div>
      {lines.map((l, i) => (
        <div key={i} style={{ marginBottom: 5, animation: 'fadeIn 0.35s ease' }}>
          <span style={{ color: l.color, fontWeight: 500 }}>[{l.agent}]</span>{' '}
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>{l.msg}</span>
        </div>
      ))}
      <span style={{ color: 'rgba(255,255,255,0.35)', animation: 'blink 1s infinite' }}>█</span>
    </div>
  )
}

/* ── City pulse ticker ───────────────────────────── */
const TICKER = [
  { label: 'Filed today',      value: '47',     color: '#E8813A' },
  { label: 'Resolved today',   value: '38',     color: '#2A7A4B' },
  { label: 'Avg response',     value: '4.6d',   color: '#2563C4' },
  { label: 'AI classified',    value: '98.4%',  color: '#6B48CC' },
  { label: 'Critical open',    value: '12',     color: '#C0392B' },
  { label: 'Active wards',     value: '250',    color: '#2A7A4B' },
  { label: 'Departments',      value: '91',     color: '#2563C4' },
  { label: 'Most active ward', value: 'Ward 7', color: '#D97706' },
]

/* ── How it works steps ──────────────────────────── */
const STEPS = [
  { num: '01', icon: FileText,     title: 'You File',     color: 'var(--blue)',    body: 'Submit via text, voice, or photo. AI assists in your language — Hindi, Punjabi, English.', detail: 'The AI intake assistant extracts location, date, category, and severity automatically. Upload a photo and it uses computer vision to detect the civic issue.' },
  { num: '02', icon: Brain,        title: 'AI Debates',   color: 'var(--purple)',  body: '5 specialized agents review your complaint — bylaws, SLA timelines, citizen rights, jurisdiction.', detail: 'Policy Enforcer · Evidence Reviewer · Citizen Advocate · Devil\'s Advocate · Chief Coordinator. Each agent argues before the system decides the routing.' },
  { num: '03', icon: Zap,          title: 'Auto-Routed',  color: 'var(--saffron)', body: 'Chief Coordinator assigns to the right department with urgency score 1-10.', detail: 'Maps to one of Delhi\'s 91 departments. Urgency score weighted by sentiment, category severity, ward density, and historical SLA breach rates.' },
  { num: '04', icon: CheckCircle,  title: 'Tracked & Closed', color: 'var(--green)', body: 'Real-time updates via WhatsApp. AI auto-escalates if an officer misses SLA.', detail: 'SMS + WhatsApp alerts at every status change. If SLA is breached, auto-escalation triggers to the Ward Officer\'s supervisor with a breach report.' },
]

/* ── Portals ─────────────────────────────────────── */
const PORTALS = [
  { role: 'Citizen',       icon: User,      color: 'var(--blue)',    bg: 'var(--blue-pale)',   path: '/login?role=citizen',  tagline: 'File, track & get heard',    features: ['AI-assisted filing in 3 languages', 'Real-time status tracking', 'WhatsApp notifications', 'RTI guidance'] },
  { role: 'Ward Officer',  icon: Shield,    color: 'var(--saffron)', bg: 'var(--saffron-pale)',path: '/login?role=officer',  tagline: 'Manage your ward\'s queue',  features: ['Ward complaint queue', 'SLA countdown alerts', 'Employee assignment', 'AI weekly report'] },
  { role: 'Dept Head',     icon: Building2, color: 'var(--green)',   bg: 'var(--green-pale)',  path: '/login?role=dept',     tagline: 'Domain analytics & team',    features: ['Dept-wide complaint inbox', 'AI root cause analysis', 'Employee performance', 'Cross-ward patterns'] },
  { role: 'Leader / DC',   icon: Crown,     color: 'var(--purple)',  bg: 'var(--purple-pale)', path: '/leader/dashboard',    tagline: 'City-level intelligence',    features: ['250-ward health heatmap', 'AI pattern detection', 'Department performance', 'Accountability reports'] },
]

/* ── All Departments ─────────────────────────────── */
const ALL_DEPARTMENTS = [
  'Administrative Reforms Department',
  'Art Culture and Language Department',
  'BSES Rajdhani Power Ltd',
  'BSES Yamuna Power Ltd',
  'Chief Electoral Officer',
  'Delhi Agricultural Marketing Board',
  'Delhi Building and Other Construction Workers Welfare Board',
  'Delhi Commission for Protection of Child Rights',
  'Delhi Commission for Safai Karamcharis',
  'Delhi Commission for Women',
  'Delhi Consumer Cooperatives Wholesale Store Ltd',
  'Delhi Development Authority',
  'Delhi Electricity Regulatory Commission',
  'Delhi Fires Services',
  'Delhi Institute of Hotel Management and Catering Technology',
  'Delhi Jal Board',
  'Delhi Khadi and Village Industries Board',
  'Delhi Legislative Assembly',
  'Delhi Metro Rail Corporation Ltd',
  'Delhi Minorities Commission',
  'Delhi Police',
  'Delhi Pollution Control Committee',
  'Delhi Prison Department',
  'Delhi SC ST OBC Min Handicapped Finance Development Corp Ltd',
  'Delhi State Civil Supplies Corporation Ltd',
  'Delhi State Consumer Disputes Redressal Commission (DSCDRC)',
  'Delhi State Industrial and Infrastructure Development Corporation',
  'Delhi State Legal Services Authority',
  'Delhi Subordinate Services Selection Board',
  'Delhi Tourism and Transport Development Corporation Ltd',
  'Delhi Transco Ltd',
  'Delhi Transport Corporation',
  'Delhi Urban Shelter Improvement Board',
  'Delhi Waqf Board',
  'Department of Drugs Control',
  'Department of Environment',
  'Department of Excise Entertainment and Luxury Tax',
  'Department of Food Safety',
  'Department of Food Supplies and Consumer Affairs',
  'Department of Health and Family Welfare',
  'Department of Industries',
  'Department of Land and Building',
  'Department of Revenue',
  'Department of the Welfare SC ST OBC Minorities',
  'Department of Tourism',
  'Department of Trade and Taxes',
  'Department of Training and Technical Education GNCTD',
  'Development Department',
  'Directorate General of Home Guards',
  'Directorate of Economics Statistics',
  'Directorate of Employment',
  'Directorate of Gurudwara Elections',
  'Directorate of Information and Publicity',
  'Directorate of National Cadet Corps',
  'Directorate of Prosecution',
  'Directorate of Training Union Territories Civil Services',
  'Directorate of Vigilance',
  'Education Department',
  'Finance Department',
  'Forensic Science Laboratory',
  'Forest and Wildlife Department',
  'General Administration Department',
  'Higher Education Department',
  'Home Department',
  'Indraprastha Gas Limited',
  'Indraprastha Power Generation Co Ltd',
  'Information Technology Department',
  'Irrigation and Flood Control Department',
  'Labour Department',
  'Law, Justice and Legislative Affairs',
  'Municipal Corporation of Delhi',
  'New Delhi Municipal Council',
  'Office of State Commissioner for Persons with Disabilities',
  'Office of the Chief Secretary GNCT of Delhi',
  'Other Backward Classes Commission',
  'Planning Department',
  'Power Department',
  'Principal Accounts Office',
  'Public Grievance Commission',
  'Public Works Department',
  'Registrar Cooperative Society',
  'Services Department',
  'Social Welfare',
  'State Council of Educational Research Training',
  'State Election Commission, NCT of Delhi',
  'Tata Power Delhi Distribution Ltd',
  'Transport Department',
  'Urban Development',
  'Weights and Measures Department',
  'Women and Child Development Department',
]

/* ── Featured Departments ────────────────────────– */
const FEATURED_DEPARTMENTS = [
  { name: 'Electricity', icon: Lightning, color: '#FBBF24', bgColor: 'rgba(251, 191, 36, 0.1)', description: 'Power distribution' },
  { name: 'Water Supply', icon: Droplets, color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)', description: 'Water & sewerage' },
  { name: 'Women\'s Rights', icon: Heart, color: '#FB7185', bgColor: 'rgba(251, 113, 133, 0.1)', description: 'Women & child dev.' },
  { name: 'Sanitation', icon: Trash2, color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)', description: 'Waste management' },
  { name: 'Public Works', icon: Building2, color: '#06B6D4', bgColor: 'rgba(6, 182, 212, 0.1)', description: 'Infrastructure' },
]

// Color palette for departments
const DEPT_COLORS = [
  '#60A5FA', '#34D399', '#F59E0B', '#F87171', '#A78BFA',
  '#10B981', '#F97316', '#0EA5E9', '#EC4899', '#8B5CF6',
  '#14B8A6', '#D97706', '#7C3AED', '#D946EF', '#2563EB',
  '#059669', '#DC2626', '#6366F1', '#0891B2', '#CB2935',
  '#FBBF24', '#FB7185', '#5B21B6', '#1E40AF', '#15803D',
]

/* ── Tracker ─────────────────────────────────────── */
const TRACKER_DB = {
  'GRV-2024-001': { status: 'In Progress',  dept: 'PWD Engineering',  urgency: 7, filed: 'Mar 10, 2024', color: 'var(--blue-light)',  bg: 'var(--blue-pale)'   },
  'GRV-2024-002': { status: 'Escalated',    dept: 'Water Board',      urgency: 9, filed: 'Mar 11, 2024', color: 'var(--red)',         bg: 'var(--red-pale)'    },
  'GRV-2024-003': { status: 'Open',         dept: 'MCD',              urgency: 5, filed: 'Mar 12, 2024', color: 'var(--saffron)',     bg: 'var(--saffron-pale)'},
  'GRV-2024-004': { status: 'Resolved ✓',  dept: 'PWD',              urgency: 8, filed: 'Mar 08, 2024', color: 'var(--green)',       bg: 'var(--green-pale)'  },
}

/* ── Agent showcase ──────────────────────────────── */
const AGENTS = [
  { name: 'Policy Enforcer',   role: 'Checks bylaws & legal precedent',          color: '#60A5FA', sample: 'Bylaw §42.3 mandates PWD response within 48hrs. Precedent: 12 similar cases upheld in 2023.' },
  { name: 'Evidence Reviewer', role: 'Validates SLA timelines & context',         color: '#34D399', sample: 'Historical DB: 12 similar cases in Sector 22. SLA breach pattern. Avg resolution 6.2d vs mandated 48hrs.' },
  { name: 'Citizen Advocate',  role: 'Argues for citizen rights & schemes',       color: '#F59E0B', sample: 'Citizen entitled to compensation under RTI §19 if unresolved >30 days. PM Gram Sadak Yojana applies.' },
  { name: "Devil's Advocate",  role: 'Stress-tests jurisdiction claims',           color: '#F87171', sample: 'Jurisdiction overlap — MCD and PWD boundary is ambiguous here. Recommend secondary confirmation.' },
  { name: 'Chief Coordinator', role: 'Final routing & status decision',            color: '#A78BFA', sample: '{"status":"ESCALATED","dept":"PWD Engineering Wing","urgency":8,"sla":"48h","confidence":0.94}', isFinal: true },
]

/* ────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate    = useNavigate()
  const { t }       = useTranslation()
  const resolved    = useCount(18470, 2000)
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredPortal, setHoveredPortal] = useState(null)
  const [trackQuery, setTrackQuery] = useState('')
  const [trackResult, setTrackResult] = useState(null)
  const [trackNotFound, setTrackNotFound] = useState(false)

  const handleTrack = () => {
    const id = trackQuery.trim().toUpperCase()
    const r  = TRACKER_DB[id]
    if (r) { setTrackResult(r); setTrackNotFound(false) }
    else   { setTrackResult(null); setTrackNotFound(true) }
  }

  return (
    <div style={{ background: 'var(--canvas)' }}>

      {/* ── HERO ────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(26,75,140,0.20) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 15% 75%, rgba(232,129,58,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, background: 'var(--saffron)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={17} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', lineHeight: 1 }}>LokSetu</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Delhi Governance Intelligence</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <LanguageSwitcher />
            <Button variant="outline-light" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
            <Button size="sm" icon={FileText} onClick={() => navigate('/login?role=citizen')} style={{ background: 'var(--saffron)' }}>File Complaint</Button>
          </div>
        </nav>

        {/* Hero content */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', padding: '64px 40px', maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          <div>
            {/* Pill */}
            <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,129,58,0.12)', border: '1px solid rgba(232,129,58,0.22)', borderRadius: 999, padding: '5px 14px', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--saffron)', animation: 'pulse-glow 2s infinite' }} />
              <span style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 500, letterSpacing: '0.05em' }}>AI-Powered · Real-time · 250 Delhi Wards</span>
            </div>
            {/* Headline */}
            <div className="animate-fade-up d-100" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              <div style={{ color: 'white' }}>Your Voice.</div>
              <div style={{ color: 'var(--saffron)' }}>Your City.</div>
              <div style={{ color: 'white' }}>Your Rights.</div>
            </div>
            <p className="animate-fade-up d-200" style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
              {t('landing.subheading1')}
            </p>
            {/* CTAs */}
            <div className="animate-fade-up d-300" style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
              <Button size="lg" onClick={() => navigate('/login?role=citizen')} style={{ background: 'var(--saffron)', fontSize: 15, padding: '13px 28px', gap: 10 }}>
                <ArrowRight size={17} /> File a Complaint
              </Button>
              <Button variant="outline-light" size="lg" onClick={() => navigate('/login')} style={{ fontSize: 15, padding: '13px 24px' }}>
                Officer Login
              </Button>
            </div>
            {/* Stats */}
            <div className="animate-fade-up d-400" style={{ display: 'flex', gap: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <StatPill value={`${resolved.toLocaleString()}+`} label="Complaints Resolved" live light />
              <StatPill value="250" label="Wards Covered" light />
              <StatPill value="4.6d" label="Avg Resolution" light />
            </div>
          </div>

          {/* Terminal */}
          <div className="animate-fade-up d-300">
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>Live AI Debate Engine</div>
            <DebateTerminal />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
              {[{ label: 'Policy Enforcer', color: '#60A5FA' }, { label: 'Evidence Reviewer', color: '#34D399' }, { label: 'Citizen Advocate', color: '#F59E0B' }, { label: "Devil's Advocate", color: '#F87171' }, { label: 'Chief Coordinator', color: '#A78BFA' }].map(a => (
                <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 999, padding: '3px 10px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                  {a.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────── */}
      <div style={{ background: 'var(--ink)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, var(--ink), transparent)', zIndex: 2 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(-90deg, var(--ink), transparent)', zIndex: 2 }} />
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 26s linear infinite' }}>
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 28px', fontSize: 12, color: 'rgba(255,255,255,0.4)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.05em' }}>{item.label}</span>
              <span style={{ color: item.color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{item.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section style={{ padding: '80px 40px', background: 'var(--canvas)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--blue-light)', marginBottom: 16, display: 'inline-block', background: 'rgba(37,99,196,0.1)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(37,99,196,0.2)' }}>The Process</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 16, fontWeight: 700, lineHeight: 1.2 }}>Watch Your Complaint <span style={{ color: 'var(--blue)', fontStyle: 'italic' }}>Get Resolved</span></h2>
          <p style={{ fontSize: 16, color: 'var(--ink-light)', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>See the complete journey of your complaint—from filing to assignment to resolution in real-time, powered by AI.</p>
        </div>

        {/* Interactive Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const active = i === activeStep
              return (
                <button key={i} onClick={() => setActiveStep(i)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', borderRadius: 16, border: active ? `2px solid ${s.color}` : 'var(--border)', background: active ? 'var(--surface)' : 'transparent', boxShadow: active ? 'var(--shadow-md)' : 'none', transition: 'all var(--t-base)', textAlign: 'left' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: active ? s.color : 'var(--ink-light)', fontWeight: 600, width: 24, flexShrink: 0 }}>{s.num}</span>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: active ? s.color : 'var(--canvas-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all var(--t-base)' }}>
                    <Icon size={17} color={active ? 'white' : 'var(--ink-light)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: active ? 'var(--ink)' : 'var(--ink-muted)', marginBottom: 3, fontFamily: 'var(--font-body)' }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-light)', lineHeight: 1.5 }}>{s.body}</div>
                  </div>
                  <ChevronRight size={15} color={active ? s.color : 'var(--ink-light)'} style={{ flexShrink: 0 }} />
                </button>
              )
            })}
          </div>
          <div key={activeStep} style={{ background: 'var(--ink)', borderRadius: 24, padding: 36, position: 'sticky', top: 24, animation: 'fadeIn 0.3s ease' }}>
            {(() => { const s = STEPS[activeStep]; const Icon = s.icon; return (
              <>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Icon size={24} color="white" /></div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: s.color, letterSpacing: '0.10em', marginBottom: 10 }}>STEP {s.num}</div>
                <h3 style={{ fontSize: 26, color: 'white', marginBottom: 14 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 24 }}>{s.detail}</p>
                <div style={{ display: 'flex', gap: 7 }}>
                  {STEPS.map((_, j) => <button key={j} onClick={() => setActiveStep(j)} style={{ all: 'unset', cursor: 'pointer', width: j === activeStep ? 22 : 7, height: 7, borderRadius: 999, background: j === activeStep ? s.color : 'rgba(255,255,255,0.15)', transition: 'all var(--t-base)' }} />)}
                </div>
              </>
            )})()}
          </div>
        </div>
      </section>

      {/* ── PORTALS ─────────────────────────────────── */}
      <section style={{ background: 'var(--canvas-warm)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 12 }}>Platform Access</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 14 }}>Built for everyone in the system</h2>
            <p style={{ fontSize: 16, color: 'var(--ink-light)', maxWidth: 480, margin: '0 auto' }}>Each role gets its own tailored dashboard — exactly what they need, nothing they don&apos;t.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {PORTALS.map((p, i) => {
              const Icon = p.icon
              const hov  = hoveredPortal === i
              return (
                <a key={p.role} href={p.path} onMouseEnter={() => setHoveredPortal(i)} onMouseLeave={() => setHoveredPortal(null)}
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: hov ? `2px solid ${p.color}` : 'var(--border)', borderRadius: 20, padding: 22, boxShadow: hov ? 'var(--shadow-lg)' : 'var(--shadow-xs)', transform: hov ? 'translateY(-4px)' : 'none', transition: 'all var(--t-base)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: hov ? p.color : p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all var(--t-base)' }}>
                      <Icon size={20} color={hov ? 'white' : p.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>{p.role}</div>
                      <div style={{ fontSize: 11, color: p.color, fontWeight: 500 }}>{p.tagline}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18, flex: 1 }}>
                    {p.features.map(f => <div key={f} style={{ display: 'flex', gap: 7, fontSize: 12, color: 'var(--ink-muted)', alignItems: 'flex-start' }}><span style={{ color: p.color, marginTop: 2, flexShrink: 0 }}>→</span>{f}</div>)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: 'var(--border)' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: p.color }}>Access Portal</span>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: hov ? p.color : p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all var(--t-base)' }}>
                      <ArrowRight size={13} color={hov ? 'white' : p.color} />
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS SHOWCASE ────────────────────– */}
      <DepartmentsSection />

      {/* ── TRACKER ─────────────────────────────────── */}
      <section style={{ background: 'var(--ink)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 12 }}>Public Tracker</div>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', color: 'white', marginBottom: 14 }}>Track Your Complaint</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>Enter your complaint ID. No login required.</p>
          <div style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: 6 }}>
            <input value={trackQuery} onChange={e => { setTrackQuery(e.target.value); setTrackResult(null); setTrackNotFound(false) }} onKeyDown={e => e.key === 'Enter' && handleTrack()} placeholder="e.g. GRV-2024-001" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontFamily: 'var(--font-mono)', fontSize: 14, padding: '8px 12px', letterSpacing: '0.04em' }} />
            <Button onClick={handleTrack} icon={Search} style={{ background: 'var(--saffron)', borderRadius: 10, flexShrink: 0 }}>Track</Button>
          </div>
          {trackResult && (
            <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18, animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{trackQuery.toUpperCase()}</span>
                <span style={{ background: trackResult.bg, color: trackResult.color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.05em' }}>{trackResult.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 28 }}>
                {[['DEPARTMENT', trackResult.dept], ['URGENCY', `${trackResult.urgency}/10`], ['FILED', trackResult.filed]].map(([l, v]) => (
                  <div key={l}><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.07em', marginBottom: 3 }}>{l}</div><div style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{v}</div></div>
                ))}
              </div>
            </div>
          )}
          {trackNotFound && <div style={{ marginTop: 12, fontSize: 13, color: 'var(--red)', animation: 'fadeIn 0.3s ease' }}>No complaint found. Try GRV-2024-001 through GRV-2024-004.</div>}
          <p style={{ marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Try: GRV-2024-001 · GRV-2024-002 · GRV-2024-003 · GRV-2024-004</p>
        </div>
      </section>

      {/* ── AI SECTION ──────────────────────────────── */}
      <section style={{ padding: '80px 40px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start', marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: 12 }}>AI Intelligence</div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', marginBottom: 16 }}>Not just a complaint box. <span style={{ fontStyle: 'italic', color: 'var(--purple)' }}>A governance nervous system.</span></h2>
            <p style={{ fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.75 }}>Every complaint triggers a 5-agent AI debate using real Delhi municipal knowledge — bylaws, SOPs, historical patterns, and citizen rights — before routing to the right department.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[{ v: '98.4%', l: 'Auto-classified', c: '#A78BFA' }, { v: '4.6d', l: 'Avg resolution', c: '#34D399' }, { v: '5', l: 'AI agents', c: '#60A5FA' }, { v: '91', l: 'Departments', c: '#F59E0B' }].map(s => (
              <div key={s.l} style={{ background: 'var(--ink)', borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: s.c, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AGENTS.map(a => (
            <div key={a.name} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, padding: '14px 18px', borderRadius: 14, background: a.isFinal ? 'var(--ink)' : 'var(--surface)', border: a.isFinal ? `1px solid ${a.color}30` : 'var(--border)', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: a.isFinal ? 'white' : 'var(--ink)' }}>{a.name}</span>
                </div>
                <div style={{ fontSize: 11, color: a.isFinal ? 'rgba(255,255,255,0.35)' : 'var(--ink-light)', paddingLeft: 14 }}>{a.role}</div>
              </div>
              <div style={{ fontFamily: a.isFinal ? 'var(--font-mono)' : 'var(--font-body)', fontSize: a.isFinal ? 12 : 13, color: a.isFinal ? a.color : 'var(--ink-light)', background: a.isFinal ? 'rgba(167,139,250,0.08)' : 'var(--canvas)', padding: '10px 14px', borderRadius: 10, lineHeight: 1.6 }}>
                {a.sample}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer style={{ background: 'var(--ink)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 40px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 30, height: 30, background: 'var(--saffron)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={15} color="white" /></div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white' }}>LokSetu</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>AI-powered public grievance intelligence for Delhi. Connecting citizens with governance.</p>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {['LangGraph', 'Gemini 2.5', 'FastAPI'].map(t => <span key={t} style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 999, padding: '3px 9px' }}>{t}</span>)}
            </div>
          </div>
          {[['Portals', [['Citizen Portal', '/login?role=citizen'], ['Officer Login', '/login?role=officer'], ['Leader Dashboard', '/leader/dashboard'], ['Admin Panel', '/admin/dashboard']]], ['Resources', [['RTI Guidelines', '/rti'], ['File Complaint', '/login?role=citizen'], ['Track Status', '#tracker'], ['Help', '/help']]], ['System', [['Analytics', '/leader/analytics'], ['Ward Map', '/leader/ward-map'], ['Departments', '/leader/departments'], ['Sign In', '/login']]]].map(([col, links]) => (
            <div key={col}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>{col}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(([label, href]) => <a key={label} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color var(--t-fast)' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>{label}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
          <span>© 2026 LokSetu Public Services. AI-Powered Civic Governance.</span>
          <span>Built for the people of Delhi.</span>
        </div>
      </footer>
    </div>
  )
}
