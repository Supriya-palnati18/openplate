const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function clearAll() {
  await prisma.liveSession.deleteMany()
  console.log('✓ LiveSessions cleared')

  await prisma.order.deleteMany()
  console.log('✓ Orders cleared')

  await prisma.processPost.deleteMany()
  console.log('✓ Posts cleared')

  await prisma.chefProfile.deleteMany()
  console.log('✓ Chef profiles cleared')

  await prisma.user.deleteMany()
  console.log('✓ Users cleared')

  console.log('All data cleared successfully!')
}

clearAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect())