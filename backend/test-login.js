import axios from 'axios'

async function testLogin() {
  try {
    console.log('🔐 Testing MongoDB login...')
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'officer@demo.com',
      password: 'demo123'
    })
    
    console.log('✅ Login successful!')
    console.log('Token:', res.data.token.substring(0, 20) + '...')
    console.log('User:', res.data.user)
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message)
  }
}

testLogin()
