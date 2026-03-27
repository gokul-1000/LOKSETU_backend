import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Map, BarChart3,
  Brain, Building2, Settings, ChevronLeft, ChevronRight,
  Bell, Search, Globe, X, Shield,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Avatar, Badge } from '../ui'
import { NOTIFICATIONS } from '../../data/mockData'

const NAV_ITEMS = [
  { key: 'dashboard',    label: 'Overview',       icon: LayoutDashboard, path: '/leader/dashboard'   },
  { key: 'complaints',   label: 'Grievances',     icon: FileText,        path: '/leader/complaints', badge: '31', badgeColor: 'var(--saffron)' },
  { key: 'ward-map',     label: 'Ward Map',       icon: Map,             path: '/leader/ward-map'    },
  { key: 'analytics',    label: 'Analytics',      icon: BarChart3,       path: '/leader/analytics'   },
  { key: 'ai-insights',  label: 'AI Insights',    icon: Brain,           path: '/leader/ai-insights', badge: '6', badgeColor: 'var(--purple)' },
  { key: 'departments',  label: 'Departments',    icon: Building2,       path: '/leader/departments' },
]

/* ── Sidebar ──────────────────────────────────────── */
const Sidebar = ({ open, setOpen }) => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useApp()

  const activePath = '/' + location.pathname.split('/').slice(1,3).join('/')

  return (
    <aside style={{
      width:      open ? 'var(--sidebar-w)' : 'var(--sidebar-w-closed)',
      minHeight:  '100vh',
      background: 'var(--ink)',
      display:    'flex',
      flexDirection: 'column',
      transition: 'width var(--t-base)',
      position:   'relative',
      flexShrink: 0,
      zIndex:     40,
    }}>
      {/* Logo */}
      <div style={{
        height:         'var(--header-h)',
        display:        'flex',
        alignItems:     'center',
        gap:            12,
        padding:        open ? '0 20px' : '0',
        justifyContent: open ? 'flex-start' : 'center',
        borderBottom:   'var(--border-dark)',
        flexShrink:     0,
        overflow:       'hidden',
      }}>
        <div style={{ width: 30, height: 30, background: 'var(--saffron)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Shield size={16} color="white" />
        </div>
        {open && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'white', lineHeight: 1.1, whiteSpace: 'nowrap' }}>LokSetu</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.10em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Governance Intelligence</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ key, label, icon: Icon, path, badge, badgeColor }) => {
          const isActive = location.pathname.startsWith(path)
          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              title={!open ? label : undefined}
              style={{
                width:          '100%',
                border:         'none',
                borderRadius:   'var(--r-md)',
                padding:        open ? '9px 12px' : '9px 0',
                display:        'flex',
                alignItems:     'center',
                gap:            10,
                justifyContent: open ? 'flex-start' : 'center',
                background:     isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                color:          isActive ? 'white' : 'rgba(255,255,255,0.45)',
                cursor:         'pointer',
                transition:     'all var(--t-fast)',
                position:       'relative',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              {isActive && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: 'var(--saffron)', borderRadius: '0 2px 2px 0' }} />}
              <Icon size={16} />
              {open && (
                <>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, flex: 1, textAlign: 'left' }}>{label}</span>
                  {badge && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 'var(--r-full)', background: badgeColor, color: 'white' }}>
                      {badge}
                    </span>
                  )}
                </>
              )}
              {!open && badge && (
                <span style={{ position: 'absolute', top: 4, right: 6, width: 7, height: 7, borderRadius: '50%', background: badgeColor }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: 12, borderTop: 'var(--border-dark)' }}>
        <button
          onClick={() => navigate('/leader/settings')}
          style={{ width: '100%', border: 'none', background: 'transparent', borderRadius: 'var(--r-md)', padding: open ? '7px 12px' : '7px 0', display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', justifyContent: open ? 'flex-start' : 'center' }}>
          <Settings size={15} />
          {open && <span style={{ fontSize: 13 }}>Settings</span>}
        </button>
        {open && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginTop: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--r-md)' }}>
            <Avatar initials={user.avatar} size={28} color="var(--saffron)" />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{user.role}</div>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'absolute', top: '50%', right: -12, transform: 'translateY(-50%)',
          width: 24, height: 24, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'var(--ink)', color: 'rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10, transition: 'var(--t-fast)',
        }}
      >
        {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  )
}

/* ── Header ───────────────────────────────────────── */
const PAGE_META = {
  '/leader/dashboard':   { title: 'Overview',              sub: 'District intelligence at a glance'                },
  '/leader/complaints':  { title: 'Grievance Management',  sub: 'All incoming complaints & resolutions'            },
  '/leader/ward-map':    { title: 'Ward Health Map',       sub: 'Geographic issue distribution & scores'           },
  '/leader/analytics':   { title: 'Analytics & Trends',    sub: 'Data-driven governance insights'                  },
  '/leader/ai-insights': { title: 'AI Intelligence',       sub: 'Machine-generated patterns, predictions & causes' },
  '/leader/departments': { title: 'Department Performance','sub': 'Response rates, SLAs & accountability'          },
}

const Header = ({ sidebarOpen }) => {
  const location              = useLocation()
  const { searchQuery, setSearchQuery, user } = useApp()
  const [notifOpen, setNotifOpen] = useState(false)
  const [langOpen,  setLangOpen]  = useState(false)

  const meta   = PAGE_META[location.pathname] || PAGE_META['/leader/dashboard']
  const unread = NOTIFICATIONS.filter(n => !n.read).length

  const notifColor = { critical: 'var(--red)', warning: 'var(--amber)', info: 'var(--blue-light)' }

  return (
    <header style={{
      height:       'var(--header-h)',
      background:   'var(--surface)',
      borderBottom: 'var(--border)',
      display:      'flex',
      alignItems:   'center',
      padding:      '0 var(--sp-6)',
      gap:          'var(--sp-4)',
      position:     'sticky',
      top:          0,
      zIndex:       30,
    }}>
      {/* Title */}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, lineHeight: 1.1 }}>{meta.title}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 1 }}>{meta.sub}</div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', width: 260 }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-light)' }} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search complaints, wards…"
          style={{ width: '100%', height: 34, padding: '0 32px 0 34px', border: 'var(--border)', borderRadius: 'var(--r-full)', background: 'var(--canvas)', fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--blue-light)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(13,27,42,0.08)'}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', display: 'flex' }}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Language */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setLangOpen(!langOpen)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', border: 'var(--border)', borderRadius: 'var(--r-full)', background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--ink-light)', fontFamily: 'var(--font-body)' }}>
          <Globe size={13} /> EN
        </button>
        {langOpen && (
          <div style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-md)', padding: 6, minWidth: 130, zIndex: 200 }}>
            {['English', 'हिंदी', 'ਪੰਜਾਬੀ'].map(l => (
              <button key={l} onClick={() => setLangOpen(false)} style={{ width: '100%', padding: '7px 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, textAlign: 'left', color: 'var(--ink)', fontFamily: 'var(--font-body)', borderRadius: 'var(--r-sm)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--canvas)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >{l}</button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setNotifOpen(!notifOpen)} style={{ position: 'relative', width: 34, height: 34, border: 'var(--border)', borderRadius: 'var(--r-full)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-light)' }}>
          <Bell size={15} />
          {unread > 0 && <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', border: '2px solid white' }} />}
        </button>
        {notifOpen && (
          <div style={{ position: 'absolute', top: '110%', right: 0, width: 340, background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 200, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: 'var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>Notifications</span>
              <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>{unread} unread</span>
            </div>
            {NOTIFICATIONS.map(n => (
              <div key={n.id} style={{ padding: '12px 16px', borderBottom: 'var(--border)', display: 'flex', gap: 10, alignItems: 'flex-start', background: n.read ? 'transparent' : 'rgba(26,75,140,0.03)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: notifColor[n.type], marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.5 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User */}
      <Avatar initials={user.avatar} size={32} color="var(--saffron)" />
    </header>
  )
}

/* ── Layout shell ─────────────────────────────────── */
export default function LeaderLayout() {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={open} setOpen={setOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header sidebarOpen={open} />
        <main style={{ flex: 1, padding: 'var(--sp-6)', overflowY: 'auto', background: 'var(--canvas)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
