const prisma = require('../config/prisma')

const getSession = async (req, res) => {
  try {
    const { id } = req.params

    const session = await prisma.liveSession.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: {
          include: {
            post: {
              select: { title: true, description: true }
            },
            customer: {
              select: { id: true, name: true }
            }
          }
        }
      }
    })

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.user.id }
    })

    const isChef = chefProfile && 
      session.order.post.chefId === chefProfile.id
    const isCustomer = session.order.customerId === req.user.id

    if (!isChef && !isCustomer) {
      return res.status(403).json({ 
        message: 'Not authorized to view this session' 
      })
    }

    res.json({ session })

  } catch (error) {
    console.error('GetSession error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const startSession = async (req, res) => {
  try {
    const { id } = req.params

    const session = await prisma.liveSession.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: {
          include: {
            post: { select: { chefId: true } }
          }
        }
      }
    })

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!chefProfile || session.order.post.chefId !== chefProfile.id) {
      return res.status(403).json({ 
        message: 'Only the chef can start this session' 
      })
    }

    if (session.status !== 'SCHEDULED') {
      return res.status(400).json({ 
        message: `Session is already ${session.status}` 
      })
    }

    const updatedSession = await prisma.liveSession.update({
      where: { id: parseInt(id) },
      data: {
        status: 'LIVE',
        startedAt: new Date()
      }
    })

    res.json({
      message: 'Session is now LIVE',
      session: updatedSession
    })

  } catch (error) {
    console.error('StartSession error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const endSession = async (req, res) => {
  try {
    const { id } = req.params

    const session = await prisma.liveSession.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: {
          include: {
            post: { select: { chefId: true } }
          }
        }
      }
    })

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!chefProfile || session.order.post.chefId !== chefProfile.id) {
      return res.status(403).json({ 
        message: 'Only the chef can end this session' 
      })
    }

    if (session.status !== 'LIVE') {
      return res.status(400).json({ 
        message: 'Session is not currently live' 
      })
    }

    const updatedSession = await prisma.liveSession.update({
      where: { id: parseInt(id) },
      data: {
        status: 'ENDED',
        endedAt: new Date()
      }
    })

    await prisma.order.update({
      where: { id: session.orderId },
      data: { status: 'COMPLETED' }
    })

    res.json({
      message: 'Session ended. Order completed.',
      session: updatedSession
    })

  } catch (error) {
    console.error('EndSession error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getSession, startSession, endSession }