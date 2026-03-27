import express from 'express'
import { prisma } from '../utils/db.js'
import { calculateZoneHealth } from '../utils/db.js'

const router = express.Router()

// Get all zones
router.get('/', async (req, res) => {
  try {
    const zones = await prisma.zone.findMany({
      orderBy: { name: 'asc' }
    })
    
    // Add health scores
    const zonesWithScores = await Promise.all(
      zones.map(async (zone) => ({
        ...zone,
        healthScore: await calculateZoneHealth(zone.name),
      }))
    )
    
    res.json(zonesWithScores)
  } catch (error) {
    console.error('Error fetching zones:', error)
    res.status(500).json({ error: 'Failed to fetch zones' })
  }
})

// Get zone by ID
router.get('/:id', async (req, res) => {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: req.params.id }
    })
    
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' })
    }
    
    res.json(zone)
  } catch (error) {
    console.error('Error fetching zone:', error)
    res.status(500).json({ error: 'Failed to fetch zone' })
  }
})

// Get wards in a zone
router.get('/:zoneId/wards', async (req, res) => {
  try {
    const wards = await prisma.ward.findMany({
      where: { zone: req.params.zoneId },
      orderBy: { name: 'asc' }
    })
    res.json(wards)
  } catch (error) {
    console.error('Error fetching wards:', error)
    res.status(500).json({ error: 'Failed to fetch wards' })
  }
})

export default router
