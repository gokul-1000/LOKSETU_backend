import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedUsers() {
  try {
    console.log('🔐 Seeding users...')
    const hashedPassword = await bcrypt.hash('demo123', 10)
    
    const demoUsers = [
      {
        email: '+919876543210',
        password: hashedPassword,
        name: 'Citizen Demo',
        role: 'CITIZEN',
        phone: '+919876543210',
      },
      {
        email: 'officer@demo.com',
        password: hashedPassword,
        name: 'Ward Officer Demo',
        role: 'WARD_OFFICER',
        phone: '+919876543211',
      },
      {
        email: 'dept@demo.com',
        password: hashedPassword,
        name: 'Department Head Demo',
        role: 'DEPARTMENT_HEAD',
        phone: '+919876543212',
      },
      {
        email: 'admin@demo.com',
        password: hashedPassword,
        name: 'Admin / City Leader',
        role: 'LEADER',
        phone: '+919876543213',
      },
    ]

    for (const user of demoUsers) {
      try {
        const created = await prisma.user.create({
          data: user,
        })
        console.log(`✓ Created user: ${user.email}`)
      } catch (e) {
        console.log(`⚠ User exists: ${user.email}`)
      }
    }

    console.log('✅ Users seeded!')
  } catch (error) {
    console.error('❌ Failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

seedUsers()
