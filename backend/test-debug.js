import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function debugLogin() {
  try {
    console.log('🔍 Checking MongoDB for users...')
    
    const allUsers = await prisma.user.findMany()
    console.log(`Found ${allUsers.length} users in database`)
    
    allUsers.forEach(u => {
      console.log(`- ${u.email} (${u.role})`)
    })
    
    console.log('\n🔐 Testing password...')
    const user = await prisma.user.findUnique({ where: { email: 'officer@demo.com' } })
    
    if (!user) {
      console.log('❌ User not found!')
      return
    }
    
    console.log(`✓ Found user: ${user.name}`)
    const match = await bcrypt.compare('demo123', user.password)
    console.log(`✓ Password matches: ${match}`)
    
    if (match) {
      console.log('✅ Login should work!')
    } else {
      console.log('❌ Password does not match')
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

debugLogin()
