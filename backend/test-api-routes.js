import axios from 'axios'

async function testBackendAPI() {
  try {
    // Demo credentials
    const email = '+919876543210'  // Citizen phone number
    const password = 'demo123'
    
    console.log('🔐 Step 1: Logging in...')
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    })
    
    console.log('Login response:', JSON.stringify(loginRes.data, null, 2))
    
    const token = loginRes.data.token || loginRes.data.data?.token
    console.log('✅ Login successful, token:', token.substring(0, 30) + '...')
    
    // Test orchestrate endpoint
    console.log('\n🤖 Step 2: Testing /api/llm/orchestrate...')
    const orchestrateRes = await axios.post(
      'http://localhost:5000/api/llm/orchestrate',
      {
        title: 'Broken street light in my neighborhood',
        description: 'The street light outside my house has been broken for weeks. It is making the area unsafe at night. Please fix it as soon as possible.',
        language: 'ENGLISH'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('✅ Orchestrate response:')
    console.log(JSON.stringify(orchestrateRes.data, null, 2))
    
    // Test chat endpoint
    console.log('\n💬 Step 3: Testing /api/llm/chat...')
    const chatRes = await axios.post(
      'http://localhost:5000/api/llm/chat',
      {
        messages: [
          {
            role: 'user',
            content: 'The garbage on my street is not being collected regularly'
          }
        ],
        language: 'ENGLISH'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('✅ Chat response:')
    console.log(chatRes.data.response)
    
    console.log('\n✅ All API tests passed!')
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message)
    process.exit(1)
  }
}

testBackendAPI()
