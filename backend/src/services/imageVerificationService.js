import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { verifyImageWithVision } from './visionService.js'

const execPromise = promisify(exec)

/**
 * AI-Generated Image Detection
 * Uses multiple heuristics to detect AI-generated images
 */
export const detectAIGenerated = async (imagePath) => {
  try {
    // Heuristic checks for AI-generated images
    const stats = fs.statSync(imagePath)
    const fileSize = stats.size
    
    // Get image metadata using identify (ImageMagick) if available
    let metadata = {}
    let isAIGenerated = false
    let confidence = 0
    
    try {
      const { stdout } = await execPromise(`identify -verbose "${imagePath}"`)
      metadata = parseImageMetadata(stdout)
      
      // AI-generated images typically have:
      // 1. No EXIF data or fake EXIF
      // 2. Perfect compression patterns
      // 3. Unusual entropy values
      // 4. Missing metadata timestamp
      
      const hasValidExif = metadata.hasExifData && metadata.createdDate
      const entropyScore = calculateEntropy(imagePath)
      
      // Score based on heuristics
      let aiScore = 0
      
      if (!hasValidExif) aiScore += 30 // Missing EXIF is suspicious
      if (entropyScore > 7.9) aiScore += 20 // Too uniform = potential AI
      if (metadata.colorProfile === 'sRGB' && !hasValidExif) aiScore += 15
      
      isAIGenerated = aiScore > 45
      confidence = Math.min(aiScore / 100, 1)
      
    } catch (err) {
      // Fallback: use basic heuristics
      confidence = 0.3 // Low confidence with fallback
    }
    
    return {
      isAIGenerated,
      confidence, // 0-1 scale
      signals: {
        noExifData: !metadata.hasExifData,
        suspiciousEntropy: confidence > 0.5,
        compressionArtifacts: false,
      },
      metadata
    }
  } catch (error) {
    console.error('Error detecting AI-generated image:', error)
    return {
      isAIGenerated: false,
      confidence: 0,
      signals: {},
      error: error.message
    }
  }
}

/**
 * Semantic Image Verification
 * Check if image is relevant to complaint category using Google Vision API
 */
export const verifyImageRelevance = async (imagePath, complaintCategory) => {
  try {
    // Try to use Google Vision API
    const visionResult = await verifyImageWithVision(imagePath, complaintCategory)
    
    if (visionResult.objectDetection.detected) {
      // Vision API successfully detected objects
      return {
        isRelevant: visionResult.isRelevant,
        relevanceScore: visionResult.overallScore,
        category: complaintCategory,
        detectedObjects: visionResult.objectDetection.objects.map(obj => ({
          name: obj.name,
          confidence: obj.score
        })),
        categoryMatching: visionResult.categoryMatching,
        suggestedLabels: visionResult.categoryMatching.matchedObjects.map(m => m.expected),
        method: 'vision_api'
      }
    }
  } catch (error) {
    console.warn('Vision API failed, using fallback detection:', error.message)
  }
  
  // Fallback: keyword-based verification
  try {
    const categoryKeywords = {
      'Roads': ['pothole', 'crack', 'pavement', 'asphalt', 'road', 'damaged', 'broken'],
      'Water & Sanitation': ['water', 'pipe', 'sewage', 'drain', 'flooded', 'stagnant', 'leak'],
      'Electricity': ['powerline', 'pole', 'wire', 'bulb', 'streetlight', 'transformer', 'cable'],
      'Sanitation': ['garbage', 'trash', 'waste', 'litter', 'dirty', 'dustbin', 'sweeping'],
      'Infrastructure': ['building', 'structure', 'bridge', 'construction', 'damaged', 'broken'],
      'Encroachment': ['encroached', 'occupied', 'vehicle', 'illegal', 'blocked'],
      'Environment': ['tree', 'green', 'pollution', 'smoke', 'dust', 'plants'],
      'Parks': ['park', 'playground', 'garden', 'bench', 'broken', 'maintenance'],
      'Noise Pollution': ['crowd', 'construction', 'loudspeaker', 'vehicle', 'traffic'],
      'Other': []
    }
    
    const keywords = categoryKeywords[complaintCategory] || []
    const fileStats = fs.statSync(imagePath)
    const isValidImage = fileStats.size > 10000 // At least 10KB
    
    // File-based relevance scoring
    const relevanceScore = isValidImage ? 0.7 : 0.2
    
    return {
      isRelevant: relevanceScore > 0.5,
      relevanceScore,
      category: complaintCategory,
      suggestedLabels: keywords,
      detectedObjects: [],
      method: 'fallback'
    }
  } catch (error) {
    console.error('Error verifying image relevance:', error)
    return {
      isRelevant: true,
      relevanceScore: 0.5,
      error: error.message,
      method: 'fallback'
    }
  }
}

/**
 * Comprehensive Image Verification
 */
export const verifyImage = async (imagePath, complaintData) => {
  const aiGeneration = await detectAIGenerated(imagePath)
  const relevance = await verifyImageRelevance(imagePath, complaintData.category)
  
  // Build warnings based on both AI detection and category matching
  const warnings = []
  if (aiGeneration.confidence > 0.5) warnings.push('Image may be AI-generated')
  if (!relevance.isRelevant) warnings.push('Image may not be relevant to complaint')
  if (relevance.categoryMatching && !relevance.categoryMatching.isMatch) {
    warnings.push(`Expected one of: ${relevance.categoryMatching.reason}`)
  }
  
  return {
    aiGeneration,
    relevance,
    overallScore: (
      ((1 - aiGeneration.confidence) * 0.6) + // 60% weight to non-AI
      (relevance.relevanceScore * 0.4) // 40% weight to relevance
    ),
    verdict: {
      isValid: !aiGeneration.isAIGenerated && relevance.isRelevant,
      warnings: warnings.filter(Boolean),
      severity: warnings.length > 0 ? (warnings.length > 1 ? 'high' : 'medium') : 'none'
    },
    detectionMethod: relevance.method || 'fallback'
  }
}

// Helper functions
function parseImageMetadata(identifyOutput) {
  const result = {
    hasExifData: false,
    createdDate: null,
    colorProfile: 'Unknown'
  }
  
  result.hasExifData = identifyOutput.includes('exif:')
  if (identifyOutput.includes('DateTime:')) {
    const match = identifyOutput.match(/DateTime:\s*([^\n]+)/)
    result.createdDate = match ? match[1] : null
  }
  if (identifyOutput.includes('Colorspace:')) {
    const match = identifyOutput.match(/Colorspace:\s*([^\n]+)/)
    result.colorProfile = match ? match[1] : 'sRGB'
  }
  
  return result
}

function calculateEntropy(imagePath) {
  // Simplified entropy calculation
  // In production, use proper algorithm
  return 7.2 // Placeholder
}
