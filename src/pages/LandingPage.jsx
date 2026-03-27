import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight, FileText, Shield, Search, Brain,
  Zap, CheckCircle, User, Building2, Crown, ChevronRight,
  MapPin, BarChart3, MessageSquare,
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
  { label: 'Active wards',     value: '272',    color: '#2A7A4B' },
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
  { role: 'Leader / DC',   icon: Crown,     color: 'var(--purple)',  bg: 'var(--purple-pale)', path: '/leader/dashboard',    tagline: 'City-level intelligence',    features: ['272-ward health heatmap', 'AI pattern detection', 'Department performance', 'Accountability reports'] },
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
              <span style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 500, letterSpacing: '0.05em' }}>AI-Powered · Real-time · 272 Delhi Wards</span>
            </div>
            {/* Headline */}
            <h1 className="animate-fade-up d-100" style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: 'white', lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em' }}>
              {t('landing.heading1')}
            </h1>
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
              <StatPill value="272" label="Wards Covered" light />
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
      <section style={{ padding: '80px 40px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue-light)', marginBottom: 12 }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 16 }}>From complaint to resolution</h2>
          <p style={{ fontSize: 16, color: 'var(--ink-light)', maxWidth: 520, margin: '0 auto' }}>LokSetu&apos;s AI processes every complaint through a 5-agent debate before it reaches the right department.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
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
