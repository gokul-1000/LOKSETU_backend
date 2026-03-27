import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const API_URL = 'http://localhost:5000/api'
const testImagePath = path.join(__dirname, 'test-image.jpg')

async function testVisionIntegration() {
  try {
    console.log('\n🔍 Google Vision API Integration Test\n')
    
    // Check if image exists
    if (!fs.existsSync(testImagePath)) {
      console.log('⚠️ Test image not found')
      return
    }
    
    // 1. Check Vision Service directly (if we can import it)
    console.log('1️⃣  Testing Vision Service...')
    try {
      const { verifyImageWithVision } = await import('./src/services/visionService.js')
      const result = await verifyImageWithVision(testImagePath, 'Roads')
      
      console.log('   Detection Status:', result.objectDetection.detected ? '✅ Working' : '❌ No objects detected')
      console.log('   Detected Objects:', result.objectDetection.objects.length > 0 
        ? result.objectDetection.objects.map(o => `${o.name} (${(o.score*100).toFixed(0)}%)`).join(', ')
        : 'None')
      console.log('   Overall Score:', (result.overallScore * 100).toFixed(1) + '%')
      console.log('   Method:', result.objectDetection.error ? '⚠️ Fallback' : '✅ Vision API')
      console.log()
    } catch (err) {
      console.log('   ❌ Vision Service test failed:', err.message)
      console.log()
    }
    
    // 2. Test via Backend API
    console.log('2️⃣  Testing via Backend API...')
    
    // Get auth token
    let token
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: 'vision-test@loksetu.com',
        password: 'password123'
      })
      token = loginRes.data.token
    } catch {
      const regRes = await axios.post(`${API_URL}/auth/register`, {
        email: 'vision-test@loksetu.com',
        password: 'password123',
        name: 'Vision Test User',
        role: 'CITIZEN'
      })
      token = regRes.data.token
    }
    
    // Upload and verify with multiple categories
    const testCategories = ['Water & Sanitation', 'Electricity', 'Roads']
    
    for (const category of testCategories) {
      const form = new FormData()
      form.append('image', fs.createReadStream(testImagePath))
      form.append('complaintCategory', category)
      
      const uploadRes = await axios.post(`${API_URL}/images/verify`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      })
      
      const verification = uploadRes.data.verification
      console.log(`   📋 Category: ${category}`)
      console.log(`      Detection Method: ${verification.detectionMethod}`)
      console.log(`      Detected Objects: ${(verification.relevance.detectedObjects || []).map(o => o.name).join(', ') || 'None'}`)
      console.log(`      Relevance Score: ${(verification.relevance.relevanceScore * 100).toFixed(1)}%`)
      console.log(`      Warnings: ${verification.verdict.warnings.length > 0 ? verification.verdict.warnings.join('; ') : 'None'}`)
    }
    
    console.log('\n✅ Vision API Integration Test Complete!')
    console.log('\n📊 Summary:')
    console.log('   If Detection Method = "vision_api" → Google Vision is connected!')
    console.log('   If Detection Method = "fallback" → Vision API not configured or failed')
    console.log('   If Detected Objects show real items → Vision API is working!')
    console.log('\n💡 Next: Upload a street light photo to a "Water & Sanitation" complaint')
    console.log('   You should see a warning: "Image may not be relevant to complaint"')
    console.log()
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    if (error.response?.data) {
      console.error('Response:', error.response.data)
    }
  }
}

testVisionIntegration()
