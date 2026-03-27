import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authMiddleware } from '../middleware/auth.js'
import { verifyImage } from '../services/imageVerificationService.js'
import { prisma } from '../utils/db.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '../../uploads/complaints')

// Ensure upload directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const router = express.Router()

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
})

/**
 * Upload image and verify it
 */
router.post('/verify', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' })
    }

    const { complaintCategory, complaintData } = req.body
    
    if (!complaintCategory) {
      return res.status(400).json({ error: 'Complaint category is required' })
    }

    // Run image verification
    const verification = await verifyImage(
      req.file.path,
      { category: complaintCategory }
    )

    res.json({
      file: {
        filename: req.file.filename,
        path: `/uploads/complaints/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      verification,
      warnings: verification.verdict.warnings
    })
  } catch (error) {
    console.error('Error uploading/verifying image:', error)
    res.status(500).json({ error: 'Image upload failed: ' + error.message })
  }
})

/**
 * Attach verified image to complaint
 */
router.post('/:complaintId/attach', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' })
    }

    const { complaintId } = req.params
    
    // Get complaint - try both id and complaintId fields
    let complaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    })
    
    if (!complaint) {
      complaint = await prisma.complaint.findUnique({
        where: { complaintId }
      })
    }

    if (!complaint) {
      return res.status(404).json({ error: `Complaint not found with id: ${complaintId}` })
    }

    // Verify image
    const verification = await verifyImage(req.file.path, {
      category: complaint.category
    })

    // Store image reference as JSON string
    const imageRecord = {
      filename: req.file.filename,
      path: `/uploads/complaints/${req.file.filename}`,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      verification: {
        aiGenerated: verification.aiGeneration,
        relevance: verification.relevance,
        verdict: verification.verdict
      },
      uploadedBy: req.user.id
    }

    // Update complaint with image (stored as JSON string)
    const updated = await prisma.complaint.update({
      where: { id: complaint.id },
      data: {
        images: {
          push: JSON.stringify(imageRecord)
        }
      }
    })

    res.json({
      image: imageRecord,
      verification,
      complaint: updated
    })
  } catch (error) {
    console.error('Error attaching image:', error)
    res.status(500).json({ error: 'Image attachment failed: ' + error.message })
  }
})

export default router
