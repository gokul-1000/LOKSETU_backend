import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.GEMINI_API_KEY

console.log('📋 Checking available Gemini models...\n')

// Try to list available models
const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`

axios.get(listUrl, { timeout: 30000 })
  .then(response => {
    console.log('✅ Available models:')
    const models = response.data.models || response.data || []
    
    if (Array.isArray(models)) {
      models.forEach((model, i) => {
        console.log(`${i+1}. ${model.name || model}`)
      })
    } else {
      console.log(JSON.stringify(response.data, null, 2))
    }
  })
  .catch(error => {
    console.error('❌ Error listing models')
    if (error.response?.data?.error?.message) {
      console.error('Error:', error.response.data.error.message)
    } else {
      console.error('Error:', error.message)
    }
    
    console.log('\n💡 Trying alternative endpoints...\n')
    
    // Try v1 endpoint
    const altUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    return axios.get(altUrl, { timeout: 30000 })
  })
  .then(response => {
    console.log('\n✅ Using v1 endpoint - Available models:')
    const models = response.data.models || response.data || []
    
    if (Array.isArray(models)) {
      models.forEach((model, i) => {
        console.log(`${i+1}. ${model.name || model.id || model}`)
      })
    } else {
      console.log(JSON.stringify(response.data, null, 2))
    }
  })
  .catch(error2 => {
    console.error('Also failed with v1:', error2.response?.data?.error?.message || error2.message)
  })
