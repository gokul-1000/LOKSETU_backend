/**
 * Complete end-to-end test: File complaint and verify ward extraction
 */

import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const API_URL = 'http://localhost:5000/api'

async function testEndToEnd() {
  console.log('🚀 End-to-End Ward Extraction Test\n')
  
  try {
    // Step 1: Register a test user
    console.log('Step 1️⃣  Registering test user...')
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email: `test-${Date.now()}@demo.com`,
      password: 'test123456',
      name: 'Test User',
      role: 'CITIZEN'
    })
    
    const userId = registerRes.data.user.id
    const token = registerRes.data.token
    console.log(`✅ Registered: ${userId}`)
    
    // Step 2: File a complaint about Karol Bagh
    console.log('\nStep 2️⃣  Filing complaint about Karol Bagh...')
    const complaintRes = await axios.post(`${API_URL}/complaints/ai`, {
      title: 'Broken streetlight on MG Road',
      description: "There's a broken streetlight on MG Road near Karol Bagh metro station that's been out for 2 weeks",
      language: 'English'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const complaintId = complaintRes.data.complaint.id
    console.log(`✅ Filed complaint: ${complaintId}`)
    console.log(`   Title: ${complaintRes.data.complaint.title}`)
    console.log(`   Ward: ${complaintRes.data.complaint.ward}`)
    console.log(`   Zone: ${complaintRes.data.complaint.zone}`)
    console.log(`   Category: ${complaintRes.data.complaint.category}`)
    
    // Verify ward is NOT "General"
    if (complaintRes.data.complaint.ward === 'General') {
      console.log('\n❌ FAIL: Ward is still "General". Ward extraction failed.')
      process.exit(1)
    } else if (complaintRes.data.complaint.ward === 'Ward 1') {
      console.log('\n✅ SUCCESS: Ward correctly extracted as "Ward 1" for Karol Bagh!')
    } else {
      console.log(`\n⚠️  Ward extracted as "${complaintRes.data.complaint.ward}" - check if this is correct`)
    }
    
    // Step 3: Verify in database
    console.log('\nStep 3️⃣  Verifying in database...')
    console.log('📊 Open Prisma Studio to view:')
    console.log('   1. Terminal: cd backend && npx prisma studio')
    console.log('   2. View "Complaint" table')
    console.log(`   3. Find complaint ID: ${complaintId}`)
    console.log('   4. Check: ward = "Ward 1", zone = "Central", locality should show location')
    
    console.log('\n✨ End-to-End Test Complete!')
    console.log(`\nComplaint Details:`)
    console.log(JSON.stringify(complaintRes.data.complaint, null, 2))
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message)
    process.exit(1)
  }
}

testEndToEnd()
