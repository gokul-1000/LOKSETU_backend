/**
 * Test script to verify ward extraction from complaints
 */

import dotenv from 'dotenv'
dotenv.config()

import { orchestrateComplaint } from './src/services/aiService.js'

async function testWardExtraction() {
  console.log('🧪 Testing Ward Extraction...\n')
  
  const testCases = [
    {
      title: "Broken streetlight on MG Road",
      description: "There's a broken streetlight on MG Road near Karol Bagh metro station that's been out for 2 weeks"
    },
    {
      title: "Pothole in Lajpat Nagar",
      description: "A large pothole has appeared near the market in Lajpat Nagar causing accidents"
    },
    {
      title: "Water supply issue",
      description: "No water supply for 3 days in Hauz Khas area"
    },
    {
      title: "Garbage accumulation",
      description: "Garbage not collected in Saket for a week"
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n📝 Testing: "${testCase.title}"`)
    console.log(`   Description: "${testCase.description}"`)
    
    try {
      const result = await orchestrateComplaint(testCase.title, testCase.description, 'English')
      console.log(`✅ Result:`)
      console.log(`   Title: ${result.extractedTitle}`)
      console.log(`   Category: ${result.category}`)
      console.log(`   Ward: ${result.ward}`)
      console.log(`   Zone: ${result.zone}`)
      console.log(`   Locality: ${result.locality}`)
      console.log(`   Department: ${result.department}`)
      console.log(`   Urgency: ${result.urgency}/10`)
    } catch (error) {
      console.error(`❌ Error: ${error.message}`)
    }
  }
  
  console.log('\n✨ Ward extraction test completed!')
  process.exit(0)
}

testWardExtraction().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
