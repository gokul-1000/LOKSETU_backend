import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Generate unique complaint ID like GRV-2024-001
export const generateComplaintId = async () => {
  const today = new Date()
  const year = today.getFullYear()
  
  const lastComplaint = await prisma.complaint.findFirst({
    where: {
      createdAt: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 1,
  })
  
  let number = 1
  if (lastComplaint?.complaintId) {
    const match = lastComplaint.complaintId.match(/(\d+)$/)
    if (match) {
      number = parseInt(match[1]) + 1
    }
  }
  
  return `GRV-${year}-${String(number).padStart(3, '0')}`
}

export const getComplaintStats = async () => {
  const [
    totalComplaints,
    resolvedThisMonth,
    pendingEscalations,
    openComplaints,
    criticalComplaints
  ] = await Promise.all([
    prisma.complaint.count(),
    prisma.complaint.count({
      where: {
        status: 'RESOLVED',
        resolvedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.complaint.count({
      where: { status: 'ESCALATED' }
    }),
    prisma.complaint.count({
      where: { status: { in: ['OPEN', 'PROGRESS', 'PENDING'] } }
    }),
    prisma.complaint.count({
      where: { priority: 'CRITICAL' }
    })
  ])
  
  const avgResolutionDays = 4.6 // Will be calculated properly later
  
  return {
    totalComplaints,
    resolvedThisMonth,
    pendingEscalations,
    openComplaints,
    criticalComplaints,
    avgResolutionDays,
  }
}

export const calculateZoneHealth = async (zone) => {
  const complaints = await prisma.complaint.findMany({
    where: { zone }
  })
  
  if (complaints.length === 0) return 100
  
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length
  const escalated = complaints.filter(c => c.status === 'ESCALATED').length
  
  // Score: 100 - (escalated % * 20) - (pending % * 10)
  const escalatedPct = (escalated / complaints.length) * 100
  const pendingPct = (complaints.filter(c => c.status === 'PENDING').length / complaints.length) * 100
  
  const score = 100 - (escalatedPct * 0.2) - (pendingPct * 0.1)
  return Math.max(0, Math.min(100, score))
}
