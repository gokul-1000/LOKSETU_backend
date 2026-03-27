import React from 'react'
import { LayoutDashboard, FileText, Users, Layers, AlertTriangle, ClipboardList } from 'lucide-react'
import DashboardLayout from './DashboardLayout'

const NAV = [
  { path: '/officer',              label: 'Ward Overview',    icon: LayoutDashboard },
  { path: '/officer/complaints',   label: 'Complaint Queue',  icon: FileText,  badge: '34', badgeColor: 'var(--saffron)' },
  { path: '/officer/clusters',     label: 'Grouped Problems', icon: Layers,    badge: '3',  badgeColor: 'var(--red)'     },
  { path: '/officer/employees',    label: 'Field Staff',      icon: Users      },
  { path: '/officer/escalations',  label: 'Escalations',      icon: AlertTriangle, badge: '4', badgeColor: 'var(--red)' },
  { path: '/officer/orders',       label: 'Draft Orders',     icon: ClipboardList, badge: '2', badgeColor: 'var(--purple)' },
]

const PAGE_META = {
  '/officer':              { title: 'Ward Overview',     sub: 'Ward 12 — Karol Bagh · Central Zone' },
  '/officer/complaints':   { title: 'Complaint Queue',   sub: 'All open grievances in your ward' },
  '/officer/clusters':     { title: 'Grouped Problems',  sub: 'AI-detected clusters needing joint action' },
  '/officer/employees':    { title: 'Field Staff',       sub: 'Assign, monitor and evaluate your team' },
  '/officer/escalations':  { title: 'Escalations',       sub: 'Complaints requiring senior intervention' },
  '/officer/orders':       { title: 'Draft Orders',      sub: 'AI-prepared orders & requisitions' },
}

export default function WardOfficerLayout() {
  return (
    <DashboardLayout
      navItems={NAV}
      pageMeta={PAGE_META}
      accentColor="var(--saffron)"
      user={{ name: 'Rajiv Sharma', avatar: 'RS', roleLabel: 'Ward Officer · Ward 12' }}
    />
  )
}