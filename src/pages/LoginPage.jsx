import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Shield, User, Building2, Crown, ArrowLeft, Eye, EyeOff, Mail } from 'lucide-react'
import { Button } from '../components/ui'
import { useApp } from '../context/AppContext'
import { authAPI } from '../api/client'

const ROLES = [
  { key: 'citizen',  label: 'Citizen',       icon: User,      color: 'var(--blue)',    desc: 'File complaints & track status',  demo: { email: '', phone: '+919876543210', password: 'demo123' } },
  { key: 'officer',  label: 'Ward Officer',   icon: Shield,    color: 'var(--saffron)', desc: 'Manage your ward\'s queue',        demo: { email: 'officer@demo.com',         password: 'demo123' } },
  { key: 'dept',     label: 'Dept Head',      icon: Building2, color: 'var(--green)',   desc: 'Department analytics & team',     demo: { email: 'dept@demo.com',            password: 'demo123' } },
  { key: 'leader',   label: 'Leader / DC',    icon: Crown,     color: 'var(--purple)',  desc: 'City-level intelligence',          demo: { email: 'admin@demo.com',           password: 'demo123' } },
]

const REDIRECT = { 
  citizen: '/citizen',
  officer: '/officer',
  dept:    '/department',
  leader:  '/leader'
}

export default function LoginPage() {
  const navigate       = useNavigate()
  const { login }      = useApp()
  const [params]       = useSearchParams()
  const [role, setRole]= useState(params.get('role') || 'citizen')
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  
  // Login fields
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')
  const [password, setPassword] = useState('')
  
  // Signup fields
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  
  const [showPw, setShowPw]     = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')

  const selected = ROLES.find(r => r.key === role) || ROLES[0]
  const Icon     = selected.icon

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const loginEmail = role === 'citizen' ? phone : email
      const result = await login(loginEmail, password)
      if (result.success) {
        navigate(REDIRECT[role])
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Validation
    if (!signupName.trim()) {
      setError('Please enter your name')
      return
    }
    if (role === 'citizen' && !signupPhone.trim()) {
      setError('Please enter your phone number')
      return
    }
    if (!role === 'citizen' && !signupEmail.trim()) {
      setError('Please enter your email')
      return
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (signupPassword !== signupConfirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.register(
        role === 'citizen' ? signupPhone : signupEmail,
        signupPassword,
        signupName,
        role === 'citizen' ? 'CITIZEN' : role.toUpperCase()
      )

      if (response.data?.token) {
        setSuccess('Account created successfully! Logging you in...')
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        setTimeout(() => {
          navigate(REDIRECT[role])
        }, 1500)
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Signup failed'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail(selected.demo.email || '')
    setPhone(selected.demo.phone || '')
    setPassword(selected.demo.password)
    setError('')
    setSuccess('')
  }

  const switchRole = (newRole) => {
    setRole(newRole)
    setEmail('')
    setPhone('')
    setPassword('')
    setSignupName('')
    setSignupEmail('')
    setSignupPhone('')
    setSignupPassword('')
    setSignupConfirm('')
    setError('')
    setSuccess('')
    setMode('login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(26,75,140,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
        {/* Back */}
        <button onClick={() => navigate('/')} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28, transition: 'color var(--t-fast)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          <ArrowLeft size={14} /> Back to home
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 34, height: 34, background: 'var(--saffron)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={18} color="white" /></div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white' }}>LokSetu</span>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, backdropFilter: 'blur(12px)' }}>
          {/* Role picker */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Sign in as</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {ROLES.map(r => {
                const RIcon = r.icon
                const active = r.key === role
                return (
                  <button key={r.key} onClick={() => switchRole(r.key)}
                    style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, border: active ? `1.5px solid ${r.color}` : '1px solid rgba(255,255,255,0.08)', background: active ? 'rgba(255,255,255,0.07)' : 'transparent', transition: 'all var(--t-fast)' }}>
                    <RIcon size={14} color={active ? r.color : 'rgba(255,255,255,0.35)'} />
                    <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? 'white' : 'rgba(255,255,255,0.45)' }}>{r.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Role description */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: 20, border: `1px solid ${selected.color}20` }}>
            <Icon size={15} color={selected.color} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{selected.desc}</span>
          </div>

          {/* Login/Signup tabs (only for citizen) */}
          {role === 'citizen' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
              <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                style={{ all: 'unset', cursor: 'pointer', flex: 1, padding: '8px 12px', textAlign: 'center', fontSize: 13, fontWeight: mode === 'login' ? 600 : 400, color: mode === 'login' ? 'white' : 'rgba(255,255,255,0.45)', borderBottom: mode === 'login' ? `2px solid ${selected.color}` : 'transparent', transition: 'all var(--t-fast)' }}>
                Sign In
              </button>
              <button onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
                style={{ all: 'unset', cursor: 'pointer', flex: 1, padding: '8px 12px', textAlign: 'center', fontSize: 13, fontWeight: mode === 'signup' ? 600 : 400, color: mode === 'signup' ? 'white' : 'rgba(255,255,255,0.45)', borderBottom: mode === 'signup' ? `2px solid ${selected.color}` : 'transparent', transition: 'all var(--t-fast)' }}>
                Create Account
              </button>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              {role === 'citizen' ? (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 7 }}>PHONE NUMBER</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = selected.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
                </div>
              ) : (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 7 }}>EMAIL ADDRESS</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = selected.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 7 }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="••••••••" required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px 40px 10px 14px', color: 'white', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = selected.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', display: 'flex' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && <div style={{ fontSize: 12, color: 'var(--red)', background: 'var(--red-pale)', padding: '8px 12px', borderRadius: 8, marginBottom: 14 }}>{error}</div>}
              {success && <div style={{ fontSize: 12, color: 'var(--green)', background: 'var(--green-pale)', padding: '8px 12px', borderRadius: 8, marginBottom: 14 }}>{success}</div>}

              <Button type="submit" size="lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', background: selected.color, fontSize: 14 }}>
                {loading ? 'Signing in…' : `Sign in`}
              </Button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && role === 'citizen' && (
            <form onSubmit={handleSignupSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 7 }}>YOUR NAME</label>
                <input value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="Ramesh Kumar" type="text" required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = selected.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 7 }}>PHONE NUMBER</label>
                <input value={signupPhone} onChange={e => setSignupPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = selected.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 7 }}>EMAIL ADDRESS (Optional)</label>
                <input value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="you@example.com" type="email"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = selected.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 7 }}>PASSWORD (min 6 characters)</label>
                <div style={{ position: 'relative' }}>
                  <input value={signupPassword} onChange={e => setSignupPassword(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="••••••••" required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px 40px 10px 14px', color: 'white', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = selected.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', display: 'flex' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 7 }}>CONFIRM PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} type={showPwConfirm ? 'text' : 'password'} placeholder="••••••••" required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px 40px 10px 14px', color: 'white', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = selected.color} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
                  <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', display: 'flex' }}>
                    {showPwConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && <div style={{ fontSize: 12, color: 'var(--red)', background: 'var(--red-pale)', padding: '8px 12px', borderRadius: 8, marginBottom: 14 }}>{error}</div>}
              {success && <div style={{ fontSize: 12, color: 'var(--green)', background: 'var(--green-pale)', padding: '8px 12px', borderRadius: 8, marginBottom: 14 }}>{success}</div>}

              <Button type="submit" size="lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', background: selected.color, fontSize: 14 }}>
                {loading ? 'Creating account…' : `Create Account`}
              </Button>
            </form>
          )}

          {/* Demo credentials - show for login tab */}
          {mode === 'login' && (
            <div style={{ marginTop: 18, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', marginBottom: 7 }}>🎬 DEMO CREDENTIALS (Quick Test)</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
                {role === 'citizen' ? `Phone: +919876543210` : `Email: ${selected.demo.email}`}<br />
                Password: demo123
              </div>
              <button onClick={fillDemo} style={{ all: 'unset', cursor: 'pointer', fontSize: 11, color: selected.color, fontWeight: 600, marginTop: 7 }}>
                Fill demo credentials →
              </button>
            </div>
          )}

          {/* Signup hint - show for signup tab */}
          {mode === 'signup' && (
            <div style={{ marginTop: 18, padding: '12px 14px', background: 'rgba(102,187,106,0.1)', border: '1px solid rgba(102,187,106,0.2)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'rgba(102,187,106,0.8)', letterSpacing: '0.06em', marginBottom: 6 }}>✓ CREATE YOUR ACCOUNT</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Enter your details to create a new account. You'll be able to file complaints and track their status.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
