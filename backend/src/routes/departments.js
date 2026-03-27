import express from 'express'
import jwt from 'jsonwebtoken'
import { complaintService } from '../services/complaintService.js'
import { prisma } from '../utils/db.js'

const router = express.Router()

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(departments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    res.status(500).json({ error: 'Failed to fetch departments' })
  }
})

// Get department by ID
router.get('/:id', async (req, res) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id: req.params.id }
    })
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' })
    }
    
    res.json(department)
  } catch (error) {
    console.error('Error fetching department:', error)
    res.status(500).json({ error: 'Failed to fetch department' })
  }
})

// Get complaints for a department
router.get('/:id/complaints', async (req, res) => {
  try {
    const result = await complaintService.getAll({
      department: req.params.id,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
    })
    res.json(result)
  } catch (error) {
    console.error('Error fetching department complaints:', error)
    res.status(500).json({ error: 'Failed to fetch complaints' })
  }
})

export default router
