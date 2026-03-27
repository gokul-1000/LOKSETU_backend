import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Bell, Search, Globe, X, Settings, ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import { Avatar } from '../ui'
import { NOTIFICATIONS } from '../../data/mockData'

const notifColor = { critical: 'var(--red)', warning: 'var(--amber)', info: 'var(--blue-light)' }

export default function DashboardLayout({ navItems, user, accentColor = 'var(--blue)', pageMeta = {} }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [langOpen,    setLangOpen]    = useState(false)
  const [search,      setSearch]      = useState('')
  const navigate  = useNavigate()
  const location  = useLocation()

  const meta   = pageMeta[location.pathname] || { title: 'Dashboard', sub: '' }
  const unread = NOTIFICATIONS.filter(n => !n.read).length

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: sidebarOpen ? 240 : 60, minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column', transition: 'width var(--t-base)', position: 'relative', flexShrink: 0, zIndex: 40 }}>
        {/* Logo */}
        <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: sidebarOpen ? '0 20px' : 0, justifyContent: sidebarOpen ? 'flex-start' : 'center', borderBottom: 'var(--border-dark)', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ width: 30, height: 30, background: accentColor, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={15} color="white" />
          </div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'white', lineHeight: 1.1, whiteSpace: 'nowrap' }}>LokSetu</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.10em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{user.roleLabel}</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {navItems.map(({ path, label, icon: Icon, badge, badgeColor }) => {
            const active = location.pathname === path || location.pathname.startsWith(path + '/')
            return (
              <button key={path} onClick={() => navigate(path)} title={!sidebarOpen ? label : undefined}
                style={{ width: '100%', border: 'none', borderRadius: 'var(--r-md)', padding: sidebarOpen ? '9px 12px' : '9px 0', display: 'flex', alignItems: 'center', gap: 10, justifyContent: sidebarOpen ? 'flex-start' : 'center', background: active ? 'rgba(255,255,255,0.10)' : 'transparent', color: active ? 'white' : 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'all var(--t-fast)', position: 'relative' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                {active && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: accentColor, borderRadius: '0 2px 2px 0' }} />}
                <Icon size={16} />
                {sidebarOpen && (
                  <>
                    <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, flex: 1, textAlign: 'left' }}>{label}</span>
                    {badge && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 'var(--r-full)', background: badgeColor || accentColor, color: 'white' }}>{badge}</span>}
                  </>
                )}
                {!sidebarOpen && badge && <span style={{ position: 'absolute', top: 4, right: 6, width: 7, height: 7, borderRadius: '50%', background: badgeColor || accentColor }} />}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: 12, borderTop: 'var(--border-dark)' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', border: 'none', background: 'transparent', borderRadius: 'var(--r-md)', padding: sidebarOpen ? '7px 12px' : '7px 0', display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
            <Settings size={15} />
            {sidebarOpen && <span style={{ fontSize: 13 }}>Settings</span>}
          </button>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginTop: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--r-md)' }}>
              <Avatar initials={user.avatar} size={28} color={accentColor} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{user.roleLabel}</div>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: 'absolute', top: '50%', right: -12, transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'var(--ink)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ height: 64, background: 'var(--surface)', borderBottom: 'var(--border)', display: 'flex', alignItems: 'center', padding: '0 var(--sp-6)', gap: 'var(--sp-4)', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, lineHeight: 1.1 }}>{meta.title}</div>
            {meta.sub && <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 1 }}>{meta.sub}</div>}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-light)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ width: '100%', height: 34, padding: '0 30px 0 32px', border: 'var(--border)', borderRadius: 'var(--r-full)', background: 'var(--canvas)', fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = accentColor}
              onBlur={e  => e.target.style.borderColor = 'rgba(13,27,42,0.08)'} />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', display: 'flex' }}><X size={12} /></button>}
          </div>

          {/* Lang */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setLangOpen(!langOpen)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', border: 'var(--border)', borderRadius: 'var(--r-full)', background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--ink-light)', fontFamily: 'var(--font-body)' }}>
              <Globe size={13} /> EN
            </button>
            {langOpen && (
              <div style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--surface)', border: 'var(--border)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-md)', padding: 6, minWidth: 130, zIndex: 200 }}>
                {['English', 'हिंदी', 'ਪੰਜਾਬੀ'].map(l => (
                  <button key={l} onClick={() => setLangOpen(false)} style={{ width: '100%', padding: '7px 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, textAlign: 'left', fontFamily: 'var(--font-body)', borderRadius: 'var(--r-sm)' }}
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
                <div style={{ padding: '12px 16px', borderBottom: 'var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Notifications</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>{unread} unread</span>
                </div>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} style={{ padding: '11px 16px', borderBottom: 'var(--border)', display: 'flex', gap: 10, alignItems: 'flex-start', background: n.read ? 'transparent' : 'rgba(26,75,140,0.03)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: notifColor[n.type], marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, lineHeight: 1.5 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Avatar initials={user.avatar} size={32} color={accentColor} />
        </header>

        <main style={{ flex: 1, padding: 'var(--sp-6)', overflowY: 'auto', background: 'var(--canvas)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}