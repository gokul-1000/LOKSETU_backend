import React from 'react'
import { LayoutDashboard, FileText, Users, Brain, TrendingUp, ClipboardList } from 'lucide-react'
import DashboardLayout from './DashboardLayout'

const NAV = [
  { path: '/department',              label: 'Overview',         icon: LayoutDashboard },
  { path: '/department/complaints',   label: 'Complaint Inbox',  icon: FileText, badge: '18', badgeColor: 'var(--saffron)' },
  { path: '/department/employees',    label: 'My Team',          icon: Users     },
  { path: '/department/rootcause',    label: 'Root Cause AI',    icon: Brain,    badge: '3',  badgeColor: 'var(--purple)'  },
  { path: '/department/performance',  label: 'Performance',      icon: TrendingUp },
  { path: '/department/orders',       label: 'Issue Orders',     icon: ClipboardList },
]

const PAGE_META = {
  '/department':             { title: 'Department Overview',  sub: 'Public Works Department (PWD)' },
  '/department/complaints':  { title: 'Complaint Inbox',      sub: 'All PWD complaints across Delhi' },
  '/department/employees':   { title: 'My Team',              sub: 'Field staff performance & assignments' },
  '/department/rootcause':   { title: 'Root Cause Analysis',  sub: 'AI-identified systemic issues in your domain' },
  '/department/performance': { title: 'Performance Tracker',  sub: 'SLA compliance, trends & benchmarks' },
  '/department/orders':      { title: 'Issue Orders',         sub: 'Draft & send departmental orders' },
}

export default function DepartmentHeadLayout() {
  return (
    <DashboardLayout
      navItems={NAV}
      pageMeta={PAGE_META}
      accentColor="var(--green)"
      user={{ name: 'Anita Rao', avatar: 'AR', roleLabel: 'Dept Head · PWD' }}
    />
  )
}