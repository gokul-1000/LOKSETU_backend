import React from 'react'
import { FileText, Clock, BookOpen, MessageSquare, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import DashboardLayout from './DashboardLayout'

const CitizenLayoutComponent = () => {
  const { t } = useTranslation()

  const NAV = [
    { path: '/citizen',              label: t('nav.home'),            icon: Home        },
    { path: '/citizen/file',         label: t('nav.fileComplaint'),   icon: FileText,   badge: '', badgeColor: 'var(--saffron)' },
    { path: '/citizen/complaints',   label: t('nav.myComplaints'),    icon: Clock,      badge: '2', badgeColor: 'var(--blue)' },
    { path: '/citizen/rti',          label: t('nav.rtiRights'),       icon: BookOpen    },
    { path: '/citizen/chat',         label: t('nav.aiAssistant'),     icon: MessageSquare },
  ]

  const PAGE_META = {
    '/citizen':              { title: t('pageMeta.citizenHome'),      sub: t('pageMeta.welcomeBack') + ', Ramesh' },
    '/citizen/file':         { title: t('pageMeta.fileComplaint'),    sub: t('pageMeta.filedLanguage') },
    '/citizen/complaints':   { title: t('pageMeta.myComplaints'),     sub: t('pageMeta.trackGrievances') },
    '/citizen/rti':          { title: t('pageMeta.rtiRights'),        sub: t('pageMeta.civicRights') },
    '/citizen/chat':         { title: t('pageMeta.aiAssistant'),      sub: t('pageMeta.askAbout') },
  }

  return (
    <DashboardLayout
      navItems={NAV}
      pageMeta={PAGE_META}
      accentColor="var(--blue)"
      user={{ name: 'Ramesh Kumar', avatar: 'RK', roleLabel: 'Citizen' }}
    />
  )
}

export default CitizenLayoutComponent