import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.activity.deleteMany({})
  await prisma.update.deleteMany({})
  await prisma.complaint.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.ward.deleteMany({})
  await prisma.zone.deleteMany({})
  await prisma.department.deleteMany({})

  console.log('✓ Cleared existing data')

  // Seed Zones
  const zones = [
    { name: 'Central', code: 'Z_CENTRAL' },
    { name: 'North', code: 'Z_NORTH' },
    { name: 'North East', code: 'Z_NORTH_EAST' },
    { name: 'North West', code: 'Z_NORTH_WEST' },
    { name: 'East', code: 'Z_EAST' },
    { name: 'South', code: 'Z_SOUTH' },
    { name: 'South East', code: 'Z_SOUTH_EAST' },
    { name: 'South West', code: 'Z_SOUTH_WEST' },
    { name: 'West', code: 'Z_WEST' },
    { name: 'New Delhi', code: 'Z_NEW_DELHI' },
  ]

  for (const zone of zones) {
    await prisma.zone.create({
      data: {
        ...zone,
        totalWards: Math.floor(Math.random() * 20) + 10,
      }
    })
  }

  console.log('✓ Zones seeded')

  // Seed Departments
  const departments = [
    {
      name: 'PWD — Engineering Wing',
      code: 'PWD_ENG',
      categories: ['Roads', 'Infrastructure', 'Bridges'],
      sla: '48 hours',
      zones: ['Central', 'North', 'South'],
    },
    {
      name: 'MCD — Local Body',
      code: 'MCD',
      categories: ['Sanitation', 'Waste Management', 'Municipal Services'],
      sla: '72 hours',
      zones: ['North', 'North West', 'Central'],
    },
    {
      name: 'Delhi Jal Board',
      code: 'DJB',
      categories: ['Water & Sanitation', 'Water Supply', 'Sewage'],
      sla: '24 hours',
      zones: ['All Zones'],
    },
    {
      name: 'Delhi Electricity Regulatory Commission',
      code: 'DERC',
      categories: ['Electricity', 'Power Supply'],
      sla: '72 hours',
      zones: ['All Zones'],
    },
    {
      name: 'Parks Department',
      code: 'PARKS',
      categories: ['Parks', 'Recreation', 'Green Spaces'],
      sla: '7 days',
      zones: ['All Zones'],
    },
    {
      name: 'Town Planning',
      code: 'TOWN_PLAN',
      categories: ['Encroachment', 'Land Use', 'Planning'],
      sla: '7 days',
      zones: ['All Zones'],
    },
  ]

  for (const dept of departments) {
    await prisma.department.create({
      data: dept
    })
  }

  console.log('✓ Departments seeded')

  // Seed sample wards
  const zoneData = [
    { name: 'Central', code: 'Z_CENTRAL' },
    { name: 'North', code: 'Z_NORTH' },
    { name: 'North East', code: 'Z_NORTH_EAST' },
    { name: 'North West', code: 'Z_NORTH_WEST' },
    { name: 'East', code: 'Z_EAST' },
    { name: 'South', code: 'Z_SOUTH' },
    { name: 'South East', code: 'Z_SOUTH_EAST' },
    { name: 'South West', code: 'Z_SOUTH_WEST' },
    { name: 'West', code: 'Z_WEST' },
    { name: 'New Delhi', code: 'Z_NEW_DELHI' },
  ]
  const wardCount = 32
  for (let i = 1; i <= wardCount; i++) {
    await prisma.ward.create({
      data: {
        name: `Ward ${i}`,
        code: `WARD_${i}`,
        zone: zoneData[Math.floor(Math.random() * zoneData.length)].name,
        population: Math.floor(Math.random() * 100000) + 50000,
      }
    })
  }

  console.log('✓ Wards seeded')

  // Seed demo users
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
    await prisma.user.create({
      data: user,
    })
  }

  console.log('✓ Demo users seeded')

  console.log('✅ Database seeded successfully!')
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
