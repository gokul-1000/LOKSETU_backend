import { ImageAnnotatorClient } from '@google-cloud/vision'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Initialize Vision API client
let visionClient = null

try {
  // Support both GOOGLE_APPLICATION_CREDENTIALS env var and inline credentials
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  
  if (credentialsPath) {
    visionClient = new ImageAnnotatorClient({
      keyFilename: credentialsPath
    })
  } else if (process.env.GOOGLE_VISION_API_KEY) {
    visionClient = new ImageAnnotatorClient({
      apiKey: process.env.GOOGLE_VISION_API_KEY
    })
  } else {
    console.warn('⚠️ Google Vision API not configured. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_VISION_API_KEY')
  }
} catch (err) {
  console.warn('⚠️ Vision API initialization failed:', err.message)
}

/**
 * Category to object mapping
 * Maps complaint categories to objects we should look for in images
 */
const categoryObjectMap = {
  'Roads': ['pothole', 'road', 'crack', 'pavement', 'asphalt', 'damaged road', 'broken pavement'],
  'Water & Sanitation': ['water', 'water pipe', 'sewage', 'drain', 'water leak', 'stagnant water'],
  'Electricity': ['power line', 'electrical pole', 'street light', 'transformer', 'electrical cable', 'lightbulb'],
  'Sanitation': ['garbage', 'trash', 'waste', 'litter', 'dustbin', 'debris'],
  'Infrastructure': ['building', 'structure', 'bridge', 'construction', 'broken structure'],
  'Encroachment': ['vehicle', 'encroached space', 'occupied space', 'illegal structure'],
  'Environment': ['tree', 'vegetation', 'pollution', 'smoke', 'air quality'],
  'Parks': ['park', 'playground', 'garden', 'bench', 'green space'],
  'Noise Pollution': ['loudspeaker', 'crowd', 'construction vehicle', 'traffic'],
  'Other': []
}

/**
 * Detect objects in image using Google Vision API
 */
export const detectObjectsInImage = async (imagePath) => {
  if (!visionClient) {
    console.warn('⚠️ Vision API not available, using fallback detection')
    return {
      detected: false,
      objects: [],
      confidence: 0,
      error: 'Vision API not configured'
    }
  }

  try {
    const request = {
      image: { source: { filename: imagePath } }
    }

    const [result] = await visionClient.objectLocalization(request)
    const objects = result.localizedObjectAnnotations || []

    // Extract object names and scores
    const detectedObjects = objects.map(obj => ({
      name: obj.name.toLowerCase(),
      score: obj.score
    }))

    return {
      detected: detectedObjects.length > 0,
      objects: detectedObjects,
      confidence: detectedObjects.length > 0 ? detectedObjects[0].score : 0,
      rawResponse: result
    }
  } catch (error) {
    console.error('Error detecting objects:', error)
    return {
      detected: false,
      objects: [],
      confidence: 0,
      error: error.message
    }
  }
}

/**
 * Match detected objects to complaint category
 */
export const matchObjectsToCategory = (detectedObjects, category) => {
  const expectedObjects = categoryObjectMap[category] || []

  if (detectedObjects.length === 0) {
    return {
      isMatch: false,
      matchedObjects: [],
      score: 0,
      reason: 'No objects detected in image'
    }
  }

  if (expectedObjects.length === 0) {
    return {
      isMatch: true,
      matchedObjects: detectedObjects,
      score: 0.5,
      reason: 'Category has no specific object requirements'
    }
  }

  // Check for matching objects
  const detectedNames = detectedObjects.map(o => o.name.toLowerCase())
  const matchedObjects = []
  let totalScore = 0

  expectedObjects.forEach(expected => {
    const matched = detectedObjects.find(obj =>
      obj.name.toLowerCase().includes(expected.toLowerCase()) ||
      expected.toLowerCase().includes(obj.name.toLowerCase())
    )

    if (matched) {
      matchedObjects.push({
        expected,
        detected: matched.name,
        confidence: matched.score
      })
      totalScore += matched.score
    }
  })

  const matchScore = matchedObjects.length > 0
    ? Math.min(totalScore / matchedObjects.length, 1.0)
    : 0

  return {
    isMatch: matchedObjects.length > 0,
    matchedObjects,
    score: matchScore,
    reason: matchedObjects.length > 0
      ? `Detected: ${matchedObjects.map(m => m.detected).join(', ')}`
      : `Expected one of: ${expectedObjects.join(', ')}`
  }
}

/**
 * Full Vision-based image verification
 */
export const verifyImageWithVision = async (imagePath, category) => {
  const detection = await detectObjectsInImage(imagePath)
  const matching = matchObjectsToCategory(detection.objects, category)

  return {
    objectDetection: detection,
    categoryMatching: matching,
    overallScore: matching.score * 0.8 + (detection.confidence * 0.2),
    isRelevant: matching.isMatch || matching.score > 0.3,
    warnings: matching.isMatch ? [] : ['Detected objects may not match complaint category']
  }
}

export default {
  detectObjectsInImage,
  matchObjectsToCategory,
  verifyImageWithVision
}
