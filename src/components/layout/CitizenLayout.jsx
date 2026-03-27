import React from 'react'
import { FileText, Clock, BookOpen, MessageSquare, Home } from 'lucide-react'
import DashboardLayout from './DashboardLayout'

const NAV = [
  { path: '/citizen',              label: 'Home',            icon: Home        },
  { path: '/citizen/file',         label: 'File a Complaint',icon: FileText,   badge: '', badgeColor: 'var(--saffron)' },
  { path: '/citizen/complaints',   label: 'My Complaints',   icon: Clock,      badge: '2', badgeColor: 'var(--blue)' },
  { path: '/citizen/rti',          label: 'RTI & My Rights', icon: BookOpen    },
  { path: '/citizen/chat',         label: 'AI Assistant',    icon: MessageSquare },
]

const PAGE_META = {
  '/citizen':              { title: 'My Dashboard',      sub: 'Welcome back, Ramesh' },
  '/citizen/file':         { title: 'File a Complaint',  sub: 'AI-assisted filing in your language' },
  '/citizen/complaints':   { title: 'My Complaints',     sub: 'Track your filed grievances' },
  '/citizen/rti':          { title: 'RTI & My Rights',   sub: 'Know your civic entitlements' },
  '/citizen/chat':         { title: 'AI Assistant',      sub: 'Ask anything about your complaint' },
}

export default function CitizenLayout() {
  return (
    <DashboardLayout
      navItems={NAV}
      pageMeta={PAGE_META}
      accentColor="var(--blue)"
      user={{ name: 'Ramesh Kumar', avatar: 'RK', roleLabel: 'Citizen' }}
    />
  )
}