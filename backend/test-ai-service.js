import { orchestrateComplaint, chatWithAI } from './src/services/aiService.js'

async function testAI() {
  try {
    console.log('🧪 Testing AI Service...\n')
    
    // Test 1: Orchestrate complaint
    console.log('Test 1: Orchestrating complaint')
    console.log('─'.repeat(50))
    
    const title = 'Pothole on MG Road blocking traffic'
    const description = 'There is a large pothole on MG Road near the market that is causing traffic jams. Vehicles are getting damaged. Please fix it urgently.'
    
    const result = await orchestrateComplaint(title, description, 'ENGLISH')
    
    console.log('\n✅ Orchestration successful:')
    console.log(JSON.stringify(result, null, 2))
    
    // Test 2: Chat
    console.log('\n\nTest 2: Chat functionality')
    console.log('─'.repeat(50))
    
    const messages = [
      { role: 'user', content: 'My neighborhood has a lot of garbage on the streets' }
    ]
    
    const chatResponse = await chatWithAI(messages, 'ENGLISH')
    console.log('\n✅ Chat response:')
    console.log(chatResponse)
    
    console.log('\n\n✅ All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

testAI()
