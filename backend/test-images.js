import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const API_URL = 'http://localhost:5000/api'

// Sample test image path
const testImagePath = path.join(__dirname, 'test-image.jpg')

// Create a simple test image if it doesn't exist (using a placeholder)
if (!fs.existsSync(testImagePath)) {
  console.log('⚠️ Test image not found at', testImagePath)
  console.log('📝 Creating a minimal test image...')
  
  // Create a minimal JPEG file (1x1 white pixel)
  const minimalJpeg = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
    0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20,
    0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
    0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
    0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
    0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D, 0x01, 0x02, 0x03, 0x00,
    0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32,
    0x81, 0x91, 0xA1, 0x08, 0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
    0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x34, 0x35,
    0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55,
    0x56, 0x57, 0x58, 0x59, 0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
    0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8A, 0x92, 0x93, 0x94,
    0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2,
    0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
    0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2, 0xE3, 0xE4, 0xE5, 0xE6,
    0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA,
    0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0xFB, 0xD2, 0x80, 0xFF, 0xD9
  ])
  
  fs.writeFileSync(testImagePath, minimalJpeg)
  console.log('✅ Test image created')
}

async function testImageUpload() {
  try {
    console.log('\n🧪 Testing Image Upload & Verification API\n')
    console.log('📁 Test image path:', testImagePath)
    
    // 1. Test without auth (should fail)
    console.log('\n1️⃣  Testing upload WITHOUT authentication...')
    try {
      const form = new FormData()
      form.append('image', fs.createReadStream(testImagePath))
      form.append('complaintCategory', 'Roads')
      
      await axios.post(`${API_URL}/images/verify`, form, {
        headers: form.getHeaders()
      })
      console.log('⚠️ Should have failed without token!')
    } catch (error) {
      console.log(`✅ Correctly rejected: ${error.response?.status} - ${error.response?.data?.error}`)
    }
    
    // 2. Login to get token
    console.log('\n2️⃣  Logging in to get authentication token...')
    let token
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: 'citizen@loksetu.com',
        password: 'password123'
      })
      token = loginRes.data.token
      console.log('✅ Login successful, token:', token.substring(0, 20) + '...')
    } catch (error) {
      console.log('⚠️ Login failed, trying to register first...')
      const regRes = await axios.post(`${API_URL}/auth/register`, {
        email: 'citizen@loksetu.com',
        password: 'password123',
        name: 'Test Citizen',
        role: 'CITIZEN'
      })
      token = regRes.data.token
      console.log('✅ Registration successful, token:', token.substring(0, 20) + '...')
    }
    
    // 3. Test image upload with auth
    console.log('\n3️⃣  Testing image upload WITH authentication...')
    const form = new FormData()
    form.append('image', fs.createReadStream(testImagePath))
    form.append('complaintCategory', 'Roads')
    
    const uploadRes = await axios.post(`${API_URL}/images/verify`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('✅ Image uploaded successfully')
    console.log('📦 Response:', {
      filename: uploadRes.data.file.filename,
      path: uploadRes.data.file.path,
      size: uploadRes.data.file.size,
      verification: {
        aiGeneration: uploadRes.data.verification.aiGeneration?.confidence || 'N/A',
        relevance: uploadRes.data.verification.relevance?.relevanceScore || 'N/A',
        overallScore: uploadRes.data.verification.overallScore || 'N/A',
        warnings: uploadRes.data.warnings || []
      }
    })
    
    // 4. Create a complaint and attach image
    console.log('\n4️⃣  Creating a test complaint...')
    const complaintRes = await axios.post(`${API_URL}/complaints/manual`, {
      title: 'Road Pothole Test',
      description: 'Testing image attachment',
      category: 'Roads',
      location: 'Test Location'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const complaintId = complaintRes.data._id || complaintRes.data.id || complaintRes.data.complaintId
    console.log('✅ Complaint created:', complaintId)
    
    // 5. Attach image to complaint
    console.log('\n5️⃣  Attaching image to complaint...')
    const form2 = new FormData()
    form2.append('image', fs.createReadStream(testImagePath))
    
    const attachRes = await axios.post(`${API_URL}/images/${complaintId}/attach`, form2, {
      headers: {
        ...form2.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('✅ Image attached to complaint')
    console.log('📦 Response:', {
      complaintId: attachRes.data.complaintId,
      imageCount: attachRes.data.imageCount,
      message: attachRes.data.message
    })
    
    console.log('\n✅ All tests passed!')
    
  } catch (error) {
    console.error('\n❌ Test failed:')
    console.error('Error:', error.message)
    if (error.response?.data) {
      console.error('Response:', error.response.data)
    }
    process.exit(1)
  }
}

// Run test
testImageUpload()
