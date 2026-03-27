import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.GEMINI_API_KEY

console.log('🔑 Testing Gemini API Key...')
console.log('API Key:', apiKey?.substring(0, 20) + '...')

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

const payload = {
  contents: [
    {
      parts: [
        {
          text: 'Hello, are you working?'
        }
      ]
    }
  ]
}

axios.post(url, payload, { timeout: 30000 })
  .then(response => {
    console.log('\n✅ GEMINI API IS WORKING!')
    console.log('\nResponse:', JSON.stringify(response.data, null, 2))
  })
  .catch(error => {
    console.error('\n❌ GEMINI API ERROR')
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2))
    } else {
      console.error('Error message:', error.message)
    }
    console.error('\n💡 Possible fixes:')
    console.error('1. API key might be invalid or expired')
    console.error('2. Check https://ai.google.dev/ and generate a new key')
    console.error('3. Make sure the API is enabled in Google Cloud Console')
  })
