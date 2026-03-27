import express from 'express'
import { prisma, getComplaintStats, calculateZoneHealth } from '../utils/db.js'

const router = express.Router()

// Get overall statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getComplaintStats()
    res.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// Get zone-wise analytics
router.get('/zones', async (req, res) => {
  try {
    const zones = await prisma.zone.findMany()
    
    const zonesData = await Promise.all(
      zones.map(async (zone) => {
        const complaints = await prisma.complaint.findMany({
          where: { zone: zone.name },
          select: { status: true, priority: true }
        })
        
        return {
          id: zone.id,
          name: zone.name,
          healthScore: await calculateZoneHealth(zone.name),
          totalComplaints: complaints.length,
          resolved: complaints.filter(c => c.status === 'RESOLVED').length,
          pending: complaints.filter(c => c.status === 'PENDING').length,
          escalated: complaints.filter(c => c.status === 'ESCALATED').length,
          critical: complaints.filter(c => c.priority === 'CRITICAL').length,
        }
      })
    )
    
    res.json(zonesData)
  } catch (error) {
    console.error('Error fetching zone analytics:', error)
    res.status(500).json({ error: 'Failed to fetch zone analytics' })
  }
})

// Get department-wise analytics
router.get('/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany()
    
    const deptData = await Promise.all(
      departments.map(async (dept) => {
        const complaints = await prisma.complaint.findMany({
          where: { department: dept.name },
          select: { status: true, priority: true }
        })
        
        return {
          id: dept.id,
          name: dept.name,
          totalComplaints: complaints.length,
          resolved: complaints.filter(c => c.status === 'RESOLVED').length,
          pending: complaints.filter(c => c.status === 'PENDING').length,
          escalated: complaints.filter(c => c.status === 'ESCALATED').length,
          avgResolutionTime: 4.6, // To be calculated properly
        }
      })
    )
    
    res.json(deptData)
  } catch (error) {
    console.error('Error fetching department analytics:', error)
    res.status(500).json({ error: 'Failed to fetch department analytics' })
  }
})

// Get category-wise breakdown
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.complaint.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })
    
    res.json(
      categories.map(cat => ({
        category: cat.category,
        count: cat._count.id
      }))
    )
  } catch (error) {
    console.error('Error fetching category analytics:', error)
    res.status(500).json({ error: 'Failed to fetch category analytics' })
  }
})

// Get time-series data for charts
router.get('/timeseries', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const complaints = await prisma.complaint.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: { createdAt: true, status: true }
    })
    
    // Group by date
    const byDate = {}
    complaints.forEach(c => {
      const date = c.createdAt.toISOString().split('T')[0]
      if (!byDate[date]) {
        byDate[date] = { created: 0, resolved: 0, escalated: 0 }
      }
      byDate[date].created++
      if (c.status === 'RESOLVED') byDate[date].resolved++
      if (c.status === 'ESCALATED') byDate[date].escalated++
    })
    
    const data = Object.entries(byDate).map(([date, counts]) => ({
      date,
      ...counts
    }))
    
    res.json(data)
  } catch (error) {
    console.error('Error fetching timeseries:', error)
    res.status(500).json({ error: 'Failed to fetch timeseries data' })
  }
})

export default router
