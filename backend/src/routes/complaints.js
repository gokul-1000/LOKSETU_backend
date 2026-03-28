import express from 'express'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { complaintService } from '../services/complaintService.js'
import { authMiddleware } from '../middleware/auth.js'
import { prisma } from '../utils/db.js'

const router = express.Router()

// Create complaint with AI
router.post('/ai', authMiddleware, [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('language').optional(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { title, description, language = 'English' } = req.body
    
    const complaint = await complaintService.createWithAI(
      req.user.id,
      title,
      description,
      language
    )

    res.status(201).json(complaint)
  } catch (error) {
    console.error('Error creating AI complaint:', error)
    res.status(500).json({ error: 'Failed to create complaint' })
  }
})

// Create complaint manually
router.post('/manual', authMiddleware, [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('category').notEmpty(),
  body('location').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const complaint = await complaintService.createManual(req.user.id, req.body)
    res.status(201).json(complaint)
  } catch (error) {
    console.error('Error creating manual complaint:', error)
    res.status(500).json({ error: 'Failed to create complaint' })
  }
})

// Get all complaints
router.get('/', async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      department: req.query.department,
      zone: req.query.zone,
      ward: req.query.ward,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
    }

    // If logged in, filter by citizen if role is CITIZEN
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role === 'CITIZEN') {
          filters.citizenId = decoded.id
        }
      } catch (e) {
        // Token invalid, proceed without filtering
      }
    }

    const result = await complaintService.getAll(filters)
    res.json(result)
  } catch (error) {
    console.error('Error fetching complaints:', error)
    res.status(500).json({ error: 'Failed to fetch complaints' })
  }
})

// Get single complaint
router.get('/:id', async (req, res) => {
  try {
    const complaint = await complaintService.getById(req.params.id)
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' })
    }

    res.json(complaint)
  } catch (error) {
    console.error('Error fetching complaint:', error)
    res.status(500).json({ error: 'Failed to fetch complaint' })
  }
})

// Update complaint status
router.patch('/:id/status', authMiddleware, [
  body('status').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const complaint = await complaintService.updateStatus(
      req.params.id,
      req.body.status,
      req.user.id
    )
    res.json(complaint)
  } catch (error) {
    console.error('Error updating complaint:', error)
    res.status(500).json({ error: 'Failed to update complaint' })
  }
})

// Add comment to complaint
router.post('/:id/updates', authMiddleware, [
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const update = await complaintService.addUpdate(
      req.params.id,
      'COMMENT',
      req.body.message,
      req.user.id
    )
    res.status(201).json(update)
  } catch (error) {
    console.error('Error adding update:', error)
    res.status(500).json({ error: 'Failed to add update' })
  }
})

// Get complaint updates/messages
router.get('/:id/updates', async (req, res) => {
  try {
    const updates = await prisma.update.findMany({
      where: { complaintId: req.params.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        type: true,
        message: true,
        createdBy: true,
        createdAt: true,
      }
    })
    res.json(updates)
  } catch (error) {
    console.error('Error fetching updates:', error)
    res.status(500).json({ error: 'Failed to fetch updates' })
  }
})

// Assign complaint
router.post('/:id/assign', authMiddleware, [
  body('officerId').notEmpty(),
], async (req, res) => {
  try {
    const complaint = await complaintService.assign(
      req.params.id,
      req.body.officerId,
      req.user.id
    )
    res.json(complaint)
  } catch (error) {
    console.error('Error assigning complaint:', error)
    res.status(500).json({ error: 'Failed to assign complaint' })
  }
})

export default router
