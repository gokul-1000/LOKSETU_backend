import React, { useState } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, changeLanguage } = useLanguage()

  const languages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'hi', label: 'हिंदी', nativeLabel: 'Hindi' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', nativeLabel: 'Punjabi' },
  ]

  const currentLang = languages.find(l => l.code === language) || languages[0]

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '8px 14px', 
          border: '1px solid rgba(255,255,255,0.2)', 
          borderRadius: '8px', 
          background: 'rgba(255,255,255,0.1)', 
          cursor: 'pointer', 
          fontSize: 13, 
          color: 'white', 
          fontFamily: 'inherit',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        <Globe size={14} />
        {currentLang.label}
      </button>

      {isOpen && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '100%', 
            right: 0, 
            marginTop: 8,
            background: 'rgba(13, 27, 42, 0.95)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '12px', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            padding: 6, 
            minWidth: 140, 
            zIndex: 200,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {languages.map(({ code, label, nativeLabel }) => (
            <button 
              key={code} 
              onClick={() => {
                changeLanguage(code)
                setIsOpen(false)
              }} 
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                border: 'none', 
                background: code === language ? 'rgba(255,255,255,0.1)' : 'none', 
                cursor: 'pointer', 
                fontSize: 12, 
                textAlign: 'left', 
                fontFamily: 'inherit',
                borderRadius: '8px',
                color: 'white',
                fontWeight: code === language ? 600 : 400,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                if (code !== language) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }
              }}
              onMouseLeave={e => {
                if (code !== language) {
                  e.currentTarget.style.background = 'none'
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
