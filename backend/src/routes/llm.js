import express from 'express'
import { chatWithAI, orchestrateComplaint } from '../services/aiService.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Health check for AI service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'LokSetu AI Service (Gemini)',
    model: 'gemini-1.5-flash'
  })
})

// Chat endpoint - conversational complaint refinement
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { messages, language = 'ENGLISH' } = req.body
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' })
    }
    
    console.log(`💬 Processing chat with ${messages.length} messages`)
    const response = await chatWithAI(messages, language)
    
    res.json({
      success: true,
      response
    })
  } catch (error) {
    console.error('❌ Chat error:', error.message)
    res.status(500).json({ 
      success: false,
      error: 'Chat service unavailable'
    })
  }
})

// Orchestrate complaint - extract and classify
router.post('/orchestrate', authMiddleware, async (req, res) => {
  try {
    const { title, description, language = 'ENGLISH' } = req.body
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description required' })
    }
    
    console.log(`🔍 Orchestrating complaint: "${title.substring(0, 50)}..."`)
    const analysis = await orchestrateComplaint(title, description, language)
    
    res.json({
      success: true,
      analysis
    })
  } catch (error) {
    console.error('❌ Orchestration error:', error.message)
    res.status(500).json({ 
      success: false,
      error: 'Orchestration service unavailable'
    })
  }
})

export default router
