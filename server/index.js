require('dotenv').config()
const express = require('express')
const prisma = require('./config/prisma')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ 
      status: 'ok', 
      message: 'OpenPlate server is running',
      database: 'connected'
    })
  } catch (error) {
    console.error('Database error:', error.message)
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      reason: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})