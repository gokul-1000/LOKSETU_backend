import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const API_URL = 'http://localhost:5000/api'
const testImagePath = './test-image.jpg'

async function testMismatchDetection() {
  try {
    console.log('\n🧪 Testing Image Category Mismatch Detection\n')
    
    // 1. Login
    console.log('1️⃣  Logging in...')
    let token
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: 'mismatch-test@loksetu.com',
        password: 'password123'
      })
      token = loginRes.data.token
      console.log('✅ Login successful\n')
    } catch (err) {
      // Try register if login fails
      console.log('   Registering new account...')
      const regRes = await axios.post(`${API_URL}/auth/register`, {
        email: 'mismatch-test@loksetu.com',
        password: 'password123',
        name: 'Mismatch Test User',
        role: 'CITIZEN'
      })
      token = regRes.data.token
      console.log('✅ Registration successful\n')
    }
    
    // 2. Upload same image as different categories
    const categories = ['Water & Sanitation', 'Electricity', 'Roads', 'Sanitation']
    
    console.log('📤 Uploading SAME test image with DIFFERENT complaint categories:\n')
    
    for (const category of categories) {
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
      console.log(`📋 Category: ${category}`)
      console.log(`   Relevance Score: ${verification.relevance?.relevanceScore || 'N/A'}/1.0`)
      console.log(`   Warnings: ${verification.verdict?.warnings?.length > 0 ? verification.verdict.warnings.join(', ') : 'None'}`)
      console.log(`   Verdict: ${verification.verdict?.isValid ? '✅ Valid' : '❌ Could be problematic'}\n`)
    }
    
    console.log('📝 Explanation:')
    console.log('   • Lower relevance scores = Image doesn\'t match category')
    console.log('   • Warnings alert admin if something looks off')
    console.log('   • System will flag mismatched images for review')
    console.log('   • Admin dashboard highlights suspicious uploads\n')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    if (error.response?.data) {
      console.error('Response:', error.response.data)
    }
  }
}

testMismatchDetection()
