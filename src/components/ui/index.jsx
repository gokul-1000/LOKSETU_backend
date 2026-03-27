import React from 'react'

/* ─────────────────────────────────────────────
   BADGE
───────────────────────────────────────────── */
const BADGE_STYLES = {
  default:   { background: 'var(--canvas-warm)',  color: 'var(--ink-light)'  },
  open:      { background: 'var(--saffron-pale)', color: 'var(--saffron)'    },
  progress:  { background: 'var(--blue-pale)',    color: 'var(--blue-light)' },
  resolved:  { background: 'var(--green-pale)',   color: 'var(--green)'      },
  escalated: { background: 'var(--red-pale)',     color: 'var(--red)'        },
  pending:   { background: 'var(--amber-pale)',   color: 'var(--amber)'      },
  closed:    { background: 'var(--canvas-warm)',  color: 'var(--ink-light)'  },
  rejected:  { background: 'var(--red-pale)',     color: 'var(--red)'        },
  critical:  { background: 'var(--red-pale)',     color: 'var(--red)'        },
  high:      { background: 'var(--saffron-pale)', color: 'var(--saffron)'    },
  medium:    { background: 'var(--amber-pale)',   color: 'var(--amber)'      },
  low:       { background: 'var(--green-pale)',   color: 'var(--green)'      },
  purple:    { background: 'var(--purple-pale)',  color: 'var(--purple)'     },
  blue:      { background: 'var(--blue-pale)',    color: 'var(--blue)'       },
  teal:      { background: 'var(--teal-pale)',    color: 'var(--teal)'       },
}

export const Badge = ({ children, variant = 'default', size = 'sm' }) => (
  <span style={{
    ...(BADGE_STYLES[variant] || BADGE_STYLES.default),
    fontFamily:     'var(--font-body)',
    fontSize:       size === 'sm' ? 11 : 12,
    fontWeight:     600,
    padding:        size === 'sm' ? '2px 8px' : '4px 11px',
    borderRadius:   'var(--r-full)',
    textTransform:  'uppercase',
    letterSpacing:  '0.05em',
    whiteSpace:     'nowrap',
    display:        'inline-flex',
    alignItems:     'center',
    gap:            4,
    flexShrink:     0,
  }}>
    {children}
  </span>
)

/* ─────────────────────────────────────────────
   BUTTON
───────────────────────────────────────────── */
const BTN_VARIANT = {
  primary:       { background: 'var(--blue)',       color: 'white',            border: 'none'              },
  saffron:       { background: 'var(--saffron)',    color: 'white',            border: 'none'              },
  secondary:     { background: 'var(--canvas-warm)',color: 'var(--ink)',       border: 'var(--border)'     },
  ghost:         { background: 'transparent',       color: 'var(--ink-light)', border: 'var(--border)'     },
  danger:        { background: 'var(--red-pale)',   color: 'var(--red)',       border: 'none'              },
  dark:          { background: 'rgba(255,255,255,0.09)', color: 'white',       border: 'var(--border-dark)'},
  'outline-light':{ background: 'transparent',     color: 'white',            border: '1px solid rgba(255,255,255,0.30)'},
}
const BTN_SIZE = {
  sm: { fontSize: 12, padding: '6px 14px',  gap: 5  },
  md: { fontSize: 13, padding: '9px 18px',  gap: 6  },
  lg: { fontSize: 15, padding: '12px 26px', gap: 8  },
}

export const Button = ({
  children, variant = 'primary', size = 'md',
  onClick, icon: Icon, style = {}, href, type = 'button',
  disabled = false,
}) => {
  const base = {
    ...BTN_VARIANT[variant],
    ...BTN_SIZE[size],
    borderRadius:   'var(--r-md)',
    fontFamily:     'var(--font-body)',
    fontWeight:     500,
    cursor:         disabled ? 'not-allowed' : 'pointer',
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    transition:     'all var(--t-fast)',
    opacity:        disabled ? 0.55 : 1,
    ...style,
  }
  if (href) return <a href={href} style={base}>{Icon && <Icon size={size === 'sm' ? 13 : size === 'lg' ? 17 : 15} />}{children}</a>
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={base}>
      {Icon && <Icon size={size === 'sm' ? 13 : size === 'lg' ? 17 : 15} />}
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────
   CARD
───────────────────────────────────────────── */
export const Card = ({ children, style = {}, padding = 'var(--sp-6)', hover = false, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background:   'var(--surface)',
      border:       'var(--border)',
      borderRadius: 'var(--r-lg)',
      padding,
      boxShadow:    'var(--shadow-xs)',
      transition:   'all var(--t-base)',
      cursor:       onClick ? 'pointer' : 'default',
      ...style,
    }}
    onMouseEnter={hover ? e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
    onMouseLeave={hover ? e => { e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
  >
    {children}
  </div>
)

/* ─────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────── */
export const KPICard = ({ label, value, sub, icon: Icon, color = 'var(--blue)', trend, trendPositive }) => (
  <Card hover style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 72, height: 72, background: color, opacity: 0.07, borderRadius: '0 var(--r-lg) 0 100%' }} />
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
      <span style={{ fontSize: 12, color: 'var(--ink-light)', fontWeight: 500 }}>{label}</span>
      {Icon && (
        <span style={{ width: 30, height: 30, background: color, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color="white" />
        </span>
      )}
    </div>
    <div style={{ fontSize: 30, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1, marginBottom: 'var(--sp-2)' }}>
      {value}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {sub && <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>{sub}</span>}
      {trend && (
        <span style={{ fontSize: 11, fontWeight: 600, color: trendPositive ? 'var(--green)' : 'var(--red)' }}>
          {trendPositive ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
  </Card>
)

/* ─────────────────────────────────────────────
   SCORE RING
───────────────────────────────────────────── */
export const ScoreRing = ({ score, size = 56, strokeWidth = 5 }) => {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--canvas-warm)" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: color, fontSize: size * 0.22, fontWeight: 700, fontFamily: 'var(--font-body)' }}>
        {score}
      </text>
    </svg>
  )
}

/* ─────────────────────────────────────────────
   SENTIMENT DOT
───────────────────────────────────────────── */
const SENTIMENT_COLORS = {
  angry:        'var(--red)',
  frustrated:   'var(--saffron)',
  dissatisfied: 'var(--amber)',
  neutral:      'var(--ink-light)',
  satisfied:    'var(--green)',
}
export const SentimentDot = ({ sentiment }) => (
  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 'var(--r-full)', background: SENTIMENT_COLORS[sentiment] || 'var(--ink-light)', flexShrink: 0 }} />
)

/* ─────────────────────────────────────────────
   AVATAR
───────────────────────────────────────────── */
export const Avatar = ({ initials, size = 36, color = 'var(--blue)' }) => (
  <div style={{ width: size, height: size, borderRadius: 'var(--r-full)', background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.33, fontWeight: 600, flexShrink: 0, fontFamily: 'var(--font-body)' }}>
    {initials}
  </div>
)

/* ─────────────────────────────────────────────
   DIVIDER
───────────────────────────────────────────── */
export const Divider = ({ style = {} }) => (
  <div style={{ height: 1, background: 'rgba(13,27,42,0.07)', ...style }} />
)

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
export const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--sp-5)' }}>
    <div>
      <h2 style={{ fontSize: 20, marginBottom: 2 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--ink-light)' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
)

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
export const EmptyState = ({ icon: Icon, title, body }) => (
  <div style={{ textAlign: 'center', padding: 'var(--sp-12) var(--sp-6)', color: 'var(--ink-light)' }}>
    {Icon && <Icon size={40} style={{ opacity: 0.25, marginBottom: 'var(--sp-4)' }} />}
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>{title}</div>
    <div style={{ fontSize: 13 }}>{body}</div>
  </div>
)

/* ─────────────────────────────────────────────
   SPINNER
───────────────────────────────────────────── */
export const Spinner = ({ size = 20, color = 'var(--blue-light)' }) => (
  <div style={{ width: size, height: size, border: `2px solid rgba(0,0,0,0.08)`, borderTopColor: color, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
)

/* ─────────────────────────────────────────────
   STAT PILL  (for landing page)
───────────────────────────────────────────── */
export const StatPill = ({ value, label, live = false, light = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      {live && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', animation: 'pulse-glow 2s infinite', flexShrink: 0 }} />}
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: light ? 'white' : 'var(--ink)', lineHeight: 1 }}>{value}</span>
    </div>
    <span style={{ fontSize: 11, color: light ? 'rgba(255,255,255,0.45)' : 'var(--ink-light)', letterSpacing: '0.04em' }}>{label}</span>
  </div>
)
